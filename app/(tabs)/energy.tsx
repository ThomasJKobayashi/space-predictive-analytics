/**
 * Dashboard de Energia — monitora painéis solares, bateria, consumo e eficiência.
 * Inclui indicadores visuais de progresso e gráficos de histórico.
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import MetricCard from '@/components/MetricCard';

const screenWidth = Dimensions.get('window').width - 32;

/** Barra de progresso customizada */
function ProgressBar({
  value,
  max,
  color,
  bgColor,
}: {
  value: number;
  max: number;
  color: string;
  bgColor: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={[progressStyles.bar, { backgroundColor: bgColor }]}>
      <View style={[progressStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const progressStyles = StyleSheet.create({
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});

export default function EnergyScreen() {
  const { colors } = useTheme();
  const { state } = useMission();
  const { energy } = state.currentData;

  const recentHistory = state.history.slice(-15);
  const solarData = recentHistory.map((s) => Math.max(0, s.energy.solarOutput));
  const batteryData = recentHistory.map((s) => s.energy.batteryLevel);
  const consumptionData = recentHistory.map((s) => s.energy.consumption);
  const labels = recentHistory.map((_, i) => (i % 3 === 0 ? `${i * 3}s` : ''));

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalCount: 0,
    color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
    labelColor: () => colors.textMuted,
    propsForDots: { r: '3', strokeWidth: '1', stroke: colors.warning },
    propsForBackgroundLines: { stroke: colors.border },
  };

  // Balanço energético (geração vs consumo)
  const energyBalance = energy.solarOutput - energy.consumption;
  const balanceStatus = energyBalance > 0 ? 'nominal' : energyBalance > -100 ? 'warning' : 'critical';

  const batteryStatus =
    energy.batteryLevel < state.thresholds.batteryMin ? 'critical' :
    energy.batteryLevel < state.thresholds.batteryMin + 10 ? 'warning' : 'nominal';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Métricas atuais */}
      <View style={styles.grid}>
        <MetricCard
          label="Geração Solar"
          value={energy.solarOutput.toFixed(0)}
          unit="W"
          icon="sunny"
          status={energy.solarOutput < state.thresholds.solarOutputMin ? 'warning' : 'nominal'}
        />
        <MetricCard
          label="Consumo"
          value={energy.consumption.toFixed(0)}
          unit="W"
          icon="flash"
          status="nominal"
        />
      </View>
      <View style={styles.grid}>
        <MetricCard
          label="Bateria"
          value={energy.batteryLevel.toFixed(0)}
          unit="%"
          icon="battery-charging"
          status={batteryStatus}
        />
        <MetricCard
          label="Balanço"
          value={`${energyBalance > 0 ? '+' : ''}${energyBalance.toFixed(0)}`}
          unit="W"
          icon="swap-vertical"
          status={balanceStatus}
        />
      </View>

      {/* Indicadores de progresso */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        INDICADORES DE ENERGIA
      </Text>
      <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Nível da Bateria</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>
              {energy.batteryLevel.toFixed(0)}%
            </Text>
          </View>
          <ProgressBar
            value={energy.batteryLevel}
            max={100}
            color={energy.batteryLevel < 20 ? colors.danger : colors.success}
            bgColor={colors.border}
          />
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Eficiência Solar</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>
              {energy.panelEfficiency.toFixed(0)}%
            </Text>
          </View>
          <ProgressBar
            value={energy.panelEfficiency}
            max={100}
            color={colors.warning}
            bgColor={colors.border}
          />
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Carga vs Consumo</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>
              {((energy.solarOutput / Math.max(1, energy.consumption)) * 100).toFixed(0)}%
            </Text>
          </View>
          <ProgressBar
            value={energy.solarOutput}
            max={Math.max(energy.consumption, energy.solarOutput)}
            color={colors.primary}
            bgColor={colors.border}
          />
        </View>
      </View>

      {/* Gráfico — Geração Solar */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        GERAÇÃO SOLAR (W)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {solarData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: solarData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      {/* Gráfico — Bateria */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        NÍVEL DE BATERIA (%)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {batteryData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: batteryData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(46, 213, 115, ${opacity})`,
              propsForDots: { r: '3', strokeWidth: '1', stroke: colors.success },
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
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  progressItem: { gap: 6 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: { fontSize: 14, fontWeight: '500' },
  progressValue: { fontSize: 14, fontWeight: '700' },
  chartContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: { borderRadius: 12 },
});
