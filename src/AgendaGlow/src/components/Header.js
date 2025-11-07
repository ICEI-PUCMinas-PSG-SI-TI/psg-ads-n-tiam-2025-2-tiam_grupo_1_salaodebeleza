import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import Logout from "./Logout";

// Rotas que estão dentro do BottomTabs
const BOTTOM_TABS_ROUTES = ['home', 'agenda', 'clientes', 'mais'];

export default function Header({
  userName = "UserName",
  onNotificationPress,
  onProfilePress,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  // Verifica se a rota atual está dentro do BottomTabs
  const isBottomTabsRoute = BOTTOM_TABS_ROUTES.includes(route.name?.toLowerCase());
  
  // Verifica se pode voltar (tem histórico de navegação)
  const canGoBack = navigation.canGoBack();

  // Mostra o botão de voltar apenas se não estiver em uma rota do BottomTabs e puder voltar
  const showBackButton = !isBottomTabsRoute && canGoBack;

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={handleGoBack} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.userName}>Olá, {userName}</Text>
      </View>

      <View style={styles.right}>

        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} style={styles.avatar}>
          <Ionicons
            name="person-circle-outline"
            size={36}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <Logout/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: theme.spacing.medium,
    padding: theme.spacing.small,
    borderRadius: theme.radius.medium,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing.medium,
  },
  avatar: {
    borderRadius: 50,
  },
  
});
