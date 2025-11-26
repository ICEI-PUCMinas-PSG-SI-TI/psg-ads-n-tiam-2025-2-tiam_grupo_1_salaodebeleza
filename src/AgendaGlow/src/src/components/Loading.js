import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../styles/theme";

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%'
  }
});
