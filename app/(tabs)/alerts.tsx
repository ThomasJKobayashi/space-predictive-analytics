/**
 * Central de Alertas — lista alertas ativos e histórico.
 * Permite reconhecer alertas individuais ou limpar todos.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import AlertCard from '@/components/AlertCard';

type TabFilter = 'active' | 'history';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const { state, acknowledgeAlert, clearAlerts } = useMission();
  const [tab, setTab] = useState<TabFilter>('active');

  const activeAlerts = state.alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = state.alertHistory.filter((a) => a.acknowledged);
  const displayAlerts = tab === 'active' ? activeAlerts : state.alertHistory;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs de filtro */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, tab === 'active' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setTab('active')}
        >
          <Text style={[styles.tabText, { color: tab === 'active' ? colors.primary : colors.textMuted }]}>
            Ativos ({activeAlerts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'history' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setTab('history')}
        >
          <Text style={[styles.tabText, { color: tab === 'history' ? colors.primary : colors.textMuted }]}>
            Histórico ({state.alertHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão limpar (só na aba ativa) */}
      {tab === 'active' && activeAlerts.length > 0 && (
        <TouchableOpacity
          style={[styles.clearBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={clearAlerts}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[styles.clearText, { color: colors.danger }]}>Limpar todos os alertas</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {displayAlerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={tab === 'active' ? 'checkmark-circle' : 'time-outline'}
              size={64}
              color={colors.textMuted}
            />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              {tab === 'active' ? 'Nenhum alerta ativo' : 'Sem histórico de alertas'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {tab === 'active'
                ? 'Todos os sistemas estão operando dentro dos limiares configurados.'
                : 'Os alertas aparecerão aqui conforme forem gerados.'}
            </Text>
          </View>
        ) : (
          displayAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={tab === 'active' ? acknowledgeAlert : undefined}
            />
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    marginBottom: 4,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
