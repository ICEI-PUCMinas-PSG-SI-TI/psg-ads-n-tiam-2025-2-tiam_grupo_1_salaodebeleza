import React, { useContext, useEffect, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications'; 
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import Loading from '../components/Loading';

// Ref para armazenar o último Deep Link (caso chegue antes do navigation ser Ready)
let initialDeepLink = null; 

// --- FUNÇÃO DE TRATAMENTO ÚNICA ---
const handleNotificationResponse = (response, navRef) => {
    const data = response.notification.request.content.data;
    
    // Verifica se temos um destino de tela válido e parâmetros
    if (data.screen && data.params) {
        
        // 1. Se a navegação JÁ está pronta, navegamos imediatamente.
        if (navRef.isReady()) {
            console.log(`Deep Link IMEDIATO: ${data.screen}`);
            navRef.navigate(data.screen, data.params); 
            
        } else {
            // 2. Se não está pronta (app fechado/iniciando), SALVAMOS o link
            console.log("Navigation NOT READY. Salvando Deep Link inicial.");
            initialDeepLink = { screen: data.screen, params: data.params };
        }
    }
};

export default function AppRoutes() {
    const { user, loading } = useContext(AuthContext);
    // Movemos o navigationRef para ser a variável de navegação principal
    const navigationRef = useNavigationContainerRef(); 
    
    // --- EFEITO 1: LISTENERS PARA NOTIFICAÇÕES (Background/Foreground) ---
    useEffect(() => {
        // 1. Listener para Notificações que chegam enquanto o app está ativo
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
             // Quando uma notificação é clicada, tratamos o response
             handleNotificationResponse(response, navigationRef);
        });

        // 2. Tenta obter o link se o app foi aberto AGORA (Background/Closed)
        // Não usamos isReady aqui, pois será tratado no onReady do NavigationContainer
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (response) {
                // Ao obter o response, chamamos o handler para salvar ou navegar
                handleNotificationResponse(response, navigationRef);
            }
        });

        // Limpeza dos listeners
        return () => {
             if (responseListener) {
                 responseListener.remove(); 
             }
        }; 
   }, [navigationRef]);


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading/>
            </View>
        );
    }

    return (
        <NavigationContainer
            ref={navigationRef} 
            onReady={() => {
                // --- EFEITO 2: PROCESSAR LINK SALVO QUANDO A NAVEGAÇÃO ESTÁ PRONTA ---
                if (initialDeepLink) {
                    console.log("Navigation Ready. Processando link salvo.");
                    navigationRef.navigate(initialDeepLink.screen, initialDeepLink.params);
                    // Limpamos o link para não ser executado novamente
                    initialDeepLink = null; 
                }
            }}
        > 
            {/* Agora o componente de navegação é direto */}
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}