import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import { AuthContext } from "../context/AuthContext";
import { getFuncionarioByUid } from "../services/funcionarioService";

const BOTTOM_TABS_ROUTES = ['agenda', 'clientes', 'mais'];

export default function Header({
  pageTitle,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  const { user } = useContext(AuthContext);
  const [funcionario, setFuncionario] = useState(null);

  useEffect(() => {
    async function loadFuncionario() {
      if (!user) return;
      const result = await getFuncionarioByUid(user.uid);
      if (result.success) {
        setFuncionario(result.data);
      }
    }

    loadFuncionario();
  }, [user]);

  const isBottomTabsRoute = BOTTOM_TABS_ROUTES.includes(route.name?.toLowerCase());
  const canGoBack = navigation.canGoBack();
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
          <TouchableOpacity onPress={navigation.goBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerNamePage} pointerEvents="none">
        <Text style={styles.pageTitle}>{pageTitle || "AGENDA GLOW"}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => navigation.navigate("Mais")} activeOpacity={0.7}>
          <Image
            source={{
              uri:
                funcionario?.fotoUrl ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ddd",
  },
  
});
