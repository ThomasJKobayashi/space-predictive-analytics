/**
 * Dashboard de Sensores — exibe gráficos de linha com histórico de leituras
 * de temperatura, radiação, pressão e umidade em tempo real simulado.
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import MetricCard from '@/components/MetricCard';

const screenWidth = Dimensions.get('window').width - 32;

export default function SensorsScreen() {
  const { colors, isDark } = useTheme();
  const { state } = useMission();
  const { sensors } = state.currentData;

  // Prepara dados para os gráficos (últimas 15 leituras)
  const recentHistory = state.history.slice(-15);
  const tempData = recentHistory.map((s) => s.sensors.temperature);
  const radData = recentHistory.map((s) => s.sensors.radiation);
  const pressData = recentHistory.map((s) => s.sensors.pressure);
  const humData = recentHistory.map((s) => s.sensors.humidity);
  const labels = recentHistory.map((_, i) => (i % 3 === 0 ? `${i * 3}s` : ''));

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalCount: 1,
    color: (opacity = 1) => `rgba(74, 158, 255, ${opacity})`,
    labelColor: () => colors.textMuted,
    propsForDots: { r: '3', strokeWidth: '1', stroke: colors.primary },
    propsForBackgroundLines: { stroke: colors.border },
  };

  const tempStatus =
    sensors.temperature > state.thresholds.tempMax ? 'critical' :
    sensors.temperature > state.thresholds.tempMax - 5 ? 'warning' : 'nominal';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Cards de métricas atuais */}
      <View style={styles.grid}>
        <MetricCard
          label="Temperatura"
          value={sensors.temperature.toFixed(1)}
          unit="°C"
          icon="thermometer"
          status={tempStatus}
        />
        <MetricCard
          label="Radiação"
          value={sensors.radiation.toFixed(2)}
          unit="mSv/h"
          icon="nuclear"
          status={sensors.radiation > state.thresholds.radiationMax ? 'critical' : 'nominal'}
        />
      </View>
      <View style={styles.grid}>
        <MetricCard
          label="Pressão"
          value={sensors.pressure.toFixed(1)}
          unit="kPa"
          icon="speedometer"
          status="nominal"
        />
        <MetricCard
          label="Umidade"
          value={sensors.humidity.toFixed(0)}
          unit="%"
          icon="water"
          status="nominal"
        />
      </View>

      {/* Gráfico — Temperatura */}
      <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
        HISTÓRICO DE TEMPERATURA (°C)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {tempData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: tempData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      {/* Gráfico — Radiação */}
      <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
        HISTÓRICO DE RADIAÇÃO (mSv/h)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {radData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: radData }] }}
            width={screenWidth - 16}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 71, 87, ${opacity})`,
              propsForDots: { r: '3', strokeWidth: '1', stroke: colors.danger },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
          />
        )}
      </View>

      {/* Gráfico — Pressão e Umidade */}
      <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
        PRESSÃO ATMOSFÉRICA (kPa)
      </Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {pressData.length > 1 && (
          <LineChart
            data={{ labels, datasets: [{ data: pressData }] }}
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
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  chartContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
});
