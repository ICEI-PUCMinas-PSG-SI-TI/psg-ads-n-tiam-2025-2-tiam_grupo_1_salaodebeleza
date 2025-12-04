import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import Logout from "./Logout";

// Rotas que estão dentro do BottomTabs
const BOTTOM_TABS_ROUTES = ['agenda', 'clientes', 'mais'];

export default function Header({
  onNotificationPress,
  onProfilePress,
  pageTitle,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  // Verifica se a rota atual é uma das barra de navegação
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
      </View>

      <View style={styles.centerNamePage} pointerEvents="none">
        <Text style={styles.pageTitle}>{pageTitle || "AGENDA GLOW"}</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingTop: 50,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    width: 48,
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
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  centerNamePage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  right: {
    width: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
  },
  icon: {
    marginRight: theme.spacing.medium,
    color: theme.colors.text,
  },
  avatar: {
    borderRadius: 50,
  },
  
});
