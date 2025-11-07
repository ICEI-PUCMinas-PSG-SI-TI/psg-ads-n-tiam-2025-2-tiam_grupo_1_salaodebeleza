import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

WebBrowser.maybeCompleteAuthSession();

export default function VincularGoogle({ navigation }) {
  const [loading, setLoading] = React.useState(false);

  // Ajuste clientId para sua credencial (Web/Android/iOS conforme necessário)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '223905135120-7juc9frafb7jm75k5ajtm6nf8k6cnjb8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      if (access_token) {
        fetchGoogleProfile(access_token);
      } else {
        console.log('Erro', 'Não foi possível obter token de acesso do Google.');
      }
    } else if (response?.type === 'error') {
      console.log('Erro', 'Autenticação cancelada ou falhou.');
    }
  }, [response]);

  async function fetchGoogleProfile(accessToken) {
    setLoading(true);
    try {
      // Obter perfil do usuário com o access token
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();

      if (profile && profile.email) {
        // Aqui você deve enviar o token/profile para seu backend para vincular a conta
        // Exemplo (substitua a URL e payload conforme seu backend):
        // await fetch('https://seu-backend.com/api/link-google', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ accessToken, email: profile.email }),
        // });

        console.log('Sucesso', `Conta vinculada: ${profile.email}`);
        // navigation.goBack() // ou redirecione conforme necessário
      } else {
        console.log('Erro', 'Não foi possível ler o e‑mail do perfil Google.');
      }
    } catch (err) {
      console.log(err);
      console.log('Erro', 'Falha ao buscar perfil do Google.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vincular conta Google</Text>
      <Text style={styles.subtitle}>
        Ao vincular sua conta Google, poderemos usar seu e‑mail para logins e sincronizações.
      </Text>

      <TouchableOpacity
        style={[styles.button, !request && styles.buttonDisabled]}
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request || loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="logo-google" size={20} color={theme.colors.white} style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Vincular com Google</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textInput,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 260,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});