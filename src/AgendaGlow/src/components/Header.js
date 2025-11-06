import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import Logout from "./Logout";

export default function Header({
  userName = "UserName",
  onNotificationPress,
  onProfilePress,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Olá, {userName}</Text>

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
