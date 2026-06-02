/**
 * Card de alerta com indicador visual de severidade.
 * Permite ao usuário reconhecer (acknowledge) um alerta.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Alert as MissionAlert } from '@/utils/alertEngine';

interface AlertCardProps {
  alert: MissionAlert;
  onAcknowledge?: (id: string) => void;
}

export default function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const { colors } = useTheme();

  const severityConfig = {
    critical: { color: colors.danger, icon: 'alert-circle' as const, label: 'CRÍTICO' },
    warning: { color: colors.warning, icon: 'warning' as const, label: 'AVISO' },
    info: { color: colors.primary, icon: 'information-circle' as const, label: 'INFO' },
  };

  const config = severityConfig[alert.severity];
  const time = new Date(alert.timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: config.color,
          opacity: alert.acknowledged ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        <Ionicons name={config.icon} size={24} color={config.color} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
            <Text style={[styles.badge, { backgroundColor: config.color }]}>
              {config.label}
            </Text>
          </View>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {alert.message}
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {alert.source} • {time}
            </Text>
            {!alert.acknowledged && onAcknowledge && (
              <TouchableOpacity
                style={[styles.ackButton, { borderColor: colors.border }]}
                onPress={() => onAcknowledge(alert.id)}
              >
                <Text style={[styles.ackText, { color: colors.primary }]}>Confirmar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 11,
  },
  ackButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ackText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
