/**
 * Card reutilizável para exibir uma métrica de telemetria.
 * Mostra ícone, label, valor e indicador de status (normal/warning/critical).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  status?: 'nominal' | 'warning' | 'critical';
  compact?: boolean;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  status = 'nominal',
  compact = false,
}: MetricCardProps) {
  const { colors } = useTheme();

  const statusColor =
    status === 'critical'
      ? colors.danger
      : status === 'warning'
      ? colors.warning
      : colors.success;

  return (
    <View
      style={[
        styles.card,
        compact && styles.compact,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name={icon} size={compact ? 18 : 22} color={colors.primary} />
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
  },
  compact: {
    padding: 12,
    minWidth: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
