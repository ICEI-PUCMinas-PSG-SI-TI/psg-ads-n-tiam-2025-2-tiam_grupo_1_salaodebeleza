import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import Button from './Button';

// Card principal do App, usado nas telas de listagem
// Possui Ícone, Título, Subtítulo e 2 Botões de ação
export default function Card({
  icon = 'person-circle-outline', // ícone padrão
  title,
  subtitle,
  onEdit,
  onView,
  style,
}) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.left}>
        <Ionicons name={icon} size={36} color={theme.colors.primary} style={styles.icon} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.actions}>
        {onView && (
          <Button
            title=""
            icon="eye-outline"
            onPress={onView}
            style={styles.Button}
            small
          />
        )}
        {onEdit && (
          <Button
            title=""
            icon="create-outline"
            onPress={onEdit}
            style={styles.Button}
            small
          />
        )}
      </View>
    </View>
  );
}

// Estilos do componente Card
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.radius.large,
    marginBottom: theme.spacing.small,
    ...theme.shadows.light,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  title: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textInput,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  }
});
