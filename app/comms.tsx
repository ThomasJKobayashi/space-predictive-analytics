/**
 * Tela de detalhes de Comunicação — acessível via Stack navigation.
 * Exibe métricas detalhadas de telemetria, latência, taxa de dados e perda de pacotes.
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import MetricCard from '@/components/MetricCard';

const screenWidth = Dimensions.get('window').width - 32;

export default function CommsScreen() {
  const { colors } = useTheme();
  const { state } = useMission();
  const { comms } = state.currentData;

  const recentHistory = state.history.slice(-15);
  const signalData = recentHistory.map((s) => Math.abs(s.comms.signalStrength));
  const latencyData = recentHistory.map((s) => Math.max(0, s.comms.latency));
  const dataRateData = recentHistory.map((s) => Math.max(0, s.comms.dataRate));
  const labels = recentHistory.map((_, i) => (i % 3 === 0 ? `${i * 3}s` : ''));

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalCount: 0,
    color: (opacity = 1) => `rgba(124, 92, 252, ${opacity})`,
    labelColor: () => colors.textMuted,
    propsForDots: { r: '3', strokeWidth: '1', stroke: colors.secondary },
    propsForBackgroundLines: { stroke: colors.border },
  };

  const signalStatus =
    comms.signalStrength < state.thresholds.signalMin ? 'critical' :
    comms.signalStrength < state.thresholds.signalMin + 10 ? 'warning' : 'nominal';

  const latencyStatus =
    comms.latency > state.thresholds.latencyMax ? 'critical' :
    comms.latency > state.thresholds.latencyMax * 0.8 ? 'warning' : 'nominal';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Métricas atuais */}
      <View style={styles.grid}>
        <MetricCard
          label="Sinal"
          value={comms.signalStrength.toFixed(0)}
          unit="dBm"
          icon="wifi"
          status={signalStatus}
        />
        <MetricCard
          label="Latência"
          value={comms.latency.toFixed(0)}
          unit="ms"
          icon="time"
          status={latencyStatus}
        />
      </View>
      <View style={styles.grid}>
        <MetricCard
          label="Taxa de Dados"
          value={comms.dataRate.toFixed(0)}
          unit="kbps"
          icon="analytics"
          status="nominal"
        />
        <MetricCard
          label="Perda de Pacotes"
          value={comms.packetLoss.toFixed(1)}
          unit="%"
          icon="warning"
          status={comms.packetLoss > state.thresholds.packetLossMax ? 'critical' : 'nominal'}
        />
      </View>

      {/* Status do link de comunicação */}
      <View style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.linkTitle, { color: colors.text }]}>Status do Link de Telemetria</Text>
        <View style={styles.linkRow}>
          <View style={[styles.dot, { backgroundColor: signalStatus === 'nominal' ? colors.success : colors.danger }]} />
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            {signalStatus === 'nominal' ? 'Link ativo e estável' : 'Degradação detectada no sinal'}
          </Text>
        </View>
        <View style={styles.linkRow}>
          <View style={[styles.dot, { backgroundColor: latencyStatus === 'nominal' ? colors.success : colors.warning }]} />
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            {latencyStatus === 'nominal' ? 'Latência dentro do aceitável' : 'Latência elevada — verificar'}
          </Text>
        </View>
      </View>

      {/* Gráfico — Intensidade do Sinal */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        INTENSIDADE DO SINAL (|dBm|)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {signalData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: signalData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      {/* Gráfico — Latência */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        LATÊNCIA (ms)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {latencyData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: latencyData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
              propsForDots: { r: '3', strokeWidth: '1', stroke: colors.warning },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      {/* Gráfico — Taxa de Dados */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        TAXA DE DADOS (kbps)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {dataRateData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: dataRateData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
              propsForDots: { r: '3', strokeWidth: '1', stroke: colors.primaryLight },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  linkCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    gap: 10,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  linkText: {
    fontSize: 13,
  },
  chartContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: { borderRadius: 12 },
});
