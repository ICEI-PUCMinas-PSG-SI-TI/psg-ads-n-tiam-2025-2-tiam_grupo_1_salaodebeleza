import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Componente quadrado com ícone, número (opcional) e título.
export default function Square({
  icon = 'calendar-outline',
  title,
  number,
  onPress,
  color = theme.colors.container3,
}) {
  return (
    <TouchableOpacity
      style={[styles.square, { backgroundColor: color }]}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Ionicons name={icon} size={28} color={theme.colors.primary} />
        {number !== undefined && (
          <Text style={styles.number}>{number}</Text>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Estilos do componente Square
const styles = StyleSheet.create({
  square: {
    width: 110,
    height: 110,
    borderRadius: theme.radius.large,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.small,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.05,
    boxShadowRadius: 4,
    boxShadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 6,
  },
  title: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
});
