/**
 * Banner de status geral da missão — exibido no topo do dashboard.
 * Indica visualmente se a missão está nominal, em aviso ou em estado crítico.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface StatusBannerProps {
  status: 'nominal' | 'warning' | 'critical';
  missionName: string;
  alertCount: number;
}

export default function StatusBanner({ status, missionName, alertCount }: StatusBannerProps) {
  const { colors } = useTheme();

  const config = {
    nominal: {
      color: colors.success,
      icon: 'checkmark-circle' as const,
      label: 'SISTEMAS NOMINAIS',
    },
    warning: {
      color: colors.warning,
      icon: 'warning' as const,
      label: `${alertCount} ALERTA${alertCount > 1 ? 'S' : ''} ATIVO${alertCount > 1 ? 'S' : ''}`,
    },
    critical: {
      color: colors.danger,
      icon: 'alert-circle' as const,
      label: `${alertCount} ALERTA${alertCount > 1 ? 'S' : ''} CRÍTICO${alertCount > 1 ? 'S' : ''}`,
    },
  };

  const cfg = config[status];

  return (
    <View style={[styles.banner, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.missionName, { color: colors.text }]}>{missionName}</Text>
      <View style={[styles.statusRow, { backgroundColor: cfg.color + '20' }]}>
        <Ionicons name={cfg.icon} size={16} color={cfg.color} />
        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  missionName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
