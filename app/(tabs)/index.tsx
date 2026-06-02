/**
 * Dashboard principal — visão geral de todos os sistemas da missão.
 * Exibe status, métricas resumidas e acesso rápido aos detalhes de comunicação.
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import MetricCard from '@/components/MetricCard';
import StatusBanner from '@/components/StatusBanner';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { state, activeAlertCount } = useMission();
  const router = useRouter();
  const { sensors, energy, comms, orbital } = state.currentData;

  /** Determina status de uma métrica com base em limiar */
  const tempStatus =
    sensors.temperature > state.thresholds.tempMax
      ? 'critical'
      : sensors.temperature > state.thresholds.tempMax - 5
      ? 'warning'
      : 'nominal';

  const batteryStatus =
    energy.batteryLevel < state.thresholds.batteryMin
      ? 'critical'
      : energy.batteryLevel < state.thresholds.batteryMin + 10
      ? 'warning'
      : 'nominal';

  const signalStatus =
    comms.signalStrength < state.thresholds.signalMin
      ? 'critical'
      : comms.signalStrength < state.thresholds.signalMin + 10
      ? 'warning'
      : 'nominal';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Banner de Status */}
      <StatusBanner
        status={state.status}
        missionName={state.missionName}
        alertCount={activeAlertCount}
      />

      {/* Dados Orbitais */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        DADOS ORBITAIS
      </Text>
      <View style={[styles.orbitalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.orbitalRow}>
          <View style={styles.orbitalItem}>
            <Text style={[styles.orbitalValue, { color: colors.primaryLight }]}>
              {orbital.altitude.toFixed(1)}
            </Text>
            <Text style={[styles.orbitalLabel, { color: colors.textMuted }]}>Altitude (km)</Text>
          </View>
          <View style={styles.orbitalItem}>
            <Text style={[styles.orbitalValue, { color: colors.primaryLight }]}>
              {orbital.velocity.toFixed(2)}
            </Text>
            <Text style={[styles.orbitalLabel, { color: colors.textMuted }]}>Velocidade (km/s)</Text>
          </View>
          <View style={styles.orbitalItem}>
            <Text style={[styles.orbitalValue, { color: colors.primaryLight }]}>
              {orbital.inclination.toFixed(1)}°
            </Text>
            <Text style={[styles.orbitalLabel, { color: colors.textMuted }]}>Inclinação</Text>
          </View>
          <View style={styles.orbitalItem}>
            <Text style={[styles.orbitalValue, { color: colors.primaryLight }]}>
              {orbital.period.toFixed(1)}
            </Text>
            <Text style={[styles.orbitalLabel, { color: colors.textMuted }]}>Período (min)</Text>
          </View>
        </View>
      </View>

      {/* Métricas Resumidas */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        VISÃO GERAL DOS SISTEMAS
      </Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          label="Temperatura"
          value={sensors.temperature.toFixed(1)}
          unit="°C"
          icon="thermometer"
          status={tempStatus}
        />
        <MetricCard
          label="Bateria"
          value={energy.batteryLevel.toFixed(0)}
          unit="%"
          icon="battery-half"
          status={batteryStatus}
        />
      </View>
      <View style={styles.metricsGrid}>
        <MetricCard
          label="Sinal"
          value={comms.signalStrength.toFixed(0)}
          unit="dBm"
          icon="wifi"
          status={signalStatus}
        />
        <MetricCard
          label="Radiação"
          value={sensors.radiation.toFixed(2)}
          unit="mSv/h"
          icon="nuclear"
          status={sensors.radiation > state.thresholds.radiationMax ? 'critical' : 'nominal'}
        />
      </View>

      {/* Acesso rápido — Comunicação */}
      <TouchableOpacity
        style={[styles.commsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push('/comms')}
      >
        <View style={styles.commsLeft}>
          <Ionicons name="radio" size={24} color={colors.primary} />
          <View>
            <Text style={[styles.commsTitle, { color: colors.text }]}>Painel de Comunicação</Text>
            <Text style={[styles.commsSub, { color: colors.textMuted }]}>
              Latência: {comms.latency.toFixed(0)} ms • Taxa: {comms.dataRate.toFixed(0)} kbps
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },
  orbitalCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  orbitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orbitalItem: {
    alignItems: 'center',
  },
  orbitalValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orbitalLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  commsButton: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  commsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  commsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  commsSub: {
    fontSize: 12,
  },
});
