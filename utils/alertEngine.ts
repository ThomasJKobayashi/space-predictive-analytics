/**
 * Motor de alertas — avalia dados da missão contra limiares configuráveis
 * e gera alertas com níveis de criticidade.
 */

import { MissionSnapshot } from './simulatedData';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
  source: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
}

export interface AlertThresholds {
  tempMax: number;
  tempMin: number;
  radiationMax: number;
  signalMin: number;
  latencyMax: number;
  packetLossMax: number;
  batteryMin: number;
  solarOutputMin: number;
}

/** Limiares padrão da missão */
export const DEFAULT_THRESHOLDS: AlertThresholds = {
  tempMax: 35,
  tempMin: 0,
  radiationMax: 0.8,
  signalMin: -85,
  latencyMax: 800,
  packetLossMax: 4,
  batteryMin: 20,
  solarOutputMin: 500,
};

/** Gera ID único para cada alerta */
function makeId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Avalia um snapshot da missão e retorna uma lista de alertas gerados.
 * Cada violação de limiar gera um alerta independente.
 */
export function evaluateAlerts(
  snapshot: MissionSnapshot,
  thresholds: AlertThresholds
): Alert[] {
  const alerts: Alert[] = [];
  const { sensors, energy, comms } = snapshot;
  const now = snapshot.timestamp;

  // --- Sensores ---
  if (sensors.temperature > thresholds.tempMax) {
    alerts.push({
      id: makeId(),
      title: 'Temperatura Elevada',
      message: `Temperatura em ${sensors.temperature.toFixed(1)}°C — acima do limiar de ${thresholds.tempMax}°C`,
      severity: sensors.temperature > thresholds.tempMax + 10 ? 'critical' : 'warning',
      timestamp: now,
      source: 'Sensores',
      value: sensors.temperature,
      threshold: thresholds.tempMax,
      acknowledged: false,
    });
  }

  if (sensors.temperature < thresholds.tempMin) {
    alerts.push({
      id: makeId(),
      title: 'Temperatura Baixa',
      message: `Temperatura em ${sensors.temperature.toFixed(1)}°C — abaixo do limiar de ${thresholds.tempMin}°C`,
      severity: 'warning',
      timestamp: now,
      source: 'Sensores',
      value: sensors.temperature,
      threshold: thresholds.tempMin,
      acknowledged: false,
    });
  }

  if (sensors.radiation > thresholds.radiationMax) {
    alerts.push({
      id: makeId(),
      title: 'Radiação Elevada',
      message: `Radiação em ${sensors.radiation.toFixed(2)} mSv/h — acima do limiar de ${thresholds.radiationMax} mSv/h`,
      severity: sensors.radiation > 1.5 ? 'critical' : 'warning',
      timestamp: now,
      source: 'Sensores',
      value: sensors.radiation,
      threshold: thresholds.radiationMax,
      acknowledged: false,
    });
  }

  // --- Energia ---
  if (energy.batteryLevel < thresholds.batteryMin) {
    alerts.push({
      id: makeId(),
      title: 'Bateria Baixa',
      message: `Nível da bateria em ${energy.batteryLevel.toFixed(0)}% — abaixo do limiar de ${thresholds.batteryMin}%`,
      severity: energy.batteryLevel < 10 ? 'critical' : 'warning',
      timestamp: now,
      source: 'Energia',
      value: energy.batteryLevel,
      threshold: thresholds.batteryMin,
      acknowledged: false,
    });
  }

  if (energy.solarOutput < thresholds.solarOutputMin) {
    alerts.push({
      id: makeId(),
      title: 'Baixa Geração Solar',
      message: `Saída solar em ${energy.solarOutput.toFixed(0)}W — abaixo do limiar de ${thresholds.solarOutputMin}W`,
      severity: 'warning',
      timestamp: now,
      source: 'Energia',
      value: energy.solarOutput,
      threshold: thresholds.solarOutputMin,
      acknowledged: false,
    });
  }

  // --- Comunicação ---
  if (comms.signalStrength < thresholds.signalMin) {
    alerts.push({
      id: makeId(),
      title: 'Sinal Fraco',
      message: `Intensidade do sinal em ${comms.signalStrength.toFixed(0)} dBm — abaixo do limiar de ${thresholds.signalMin} dBm`,
      severity: comms.signalStrength < -95 ? 'critical' : 'warning',
      timestamp: now,
      source: 'Comunicação',
      value: comms.signalStrength,
      threshold: thresholds.signalMin,
      acknowledged: false,
    });
  }

  if (comms.latency > thresholds.latencyMax) {
    alerts.push({
      id: makeId(),
      title: 'Latência Alta',
      message: `Latência em ${comms.latency.toFixed(0)} ms — acima do limiar de ${thresholds.latencyMax} ms`,
      severity: 'warning',
      timestamp: now,
      source: 'Comunicação',
      value: comms.latency,
      threshold: thresholds.latencyMax,
      acknowledged: false,
    });
  }

  if (comms.packetLoss > thresholds.packetLossMax) {
    alerts.push({
      id: makeId(),
      title: 'Perda de Pacotes',
      message: `Perda de pacotes em ${comms.packetLoss.toFixed(1)}% — acima do limiar de ${thresholds.packetLossMax}%`,
      severity: comms.packetLoss > 8 ? 'critical' : 'warning',
      timestamp: now,
      source: 'Comunicação',
      value: comms.packetLoss,
      threshold: thresholds.packetLossMax,
      acknowledged: false,
    });
  }

  return alerts;
}
