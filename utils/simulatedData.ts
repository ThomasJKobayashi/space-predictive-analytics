/**
 * Gerador de dados simulados para telemetria de missão espacial.
 * Produz valores realistas com flutuações aleatórias e eventos críticos ocasionais.
 */

export interface SensorData {
  temperature: number;   // °C — nominal: 18-26, crítico: >40 ou <-5
  pressure: number;      // kPa — nominal: 100-102
  radiation: number;     // mSv/h — nominal: 0.1-0.5, crítico: >1.0
  humidity: number;      // % — nominal: 40-60
}

export interface EnergyData {
  solarOutput: number;     // W — nominal: 800-1200
  batteryLevel: number;    // % — 0-100
  consumption: number;     // W — nominal: 600-900
  panelEfficiency: number; // % — nominal: 85-95
}

export interface CommsData {
  signalStrength: number; // dBm — nominal: -50 a -70, crítico: < -90
  latency: number;        // ms — nominal: 200-500, crítico: >1000
  dataRate: number;       // kbps — nominal: 100-500
  packetLoss: number;     // % — nominal: 0-2, crítico: >5
}

export interface OrbitalData {
  altitude: number;    // km
  velocity: number;    // km/s
  inclination: number; // graus
  period: number;      // minutos
}

export interface MissionSnapshot {
  sensors: SensorData;
  energy: EnergyData;
  comms: CommsData;
  orbital: OrbitalData;
  timestamp: number;
}

/** Gera variação aleatória em torno de um valor base */
function fluctuate(base: number, range: number): number {
  return base + (Math.random() - 0.5) * 2 * range;
}

/** Chance de evento anômalo (5% por leitura) */
function anomalyChance(): boolean {
  return Math.random() < 0.05;
}

/** Gera um snapshot completo dos dados da missão */
export function generateSnapshot(): MissionSnapshot {
  const sensors: SensorData = {
    temperature: anomalyChance() ? fluctuate(45, 10) : fluctuate(22, 4),
    pressure: fluctuate(101, 1.5),
    radiation: anomalyChance() ? fluctuate(1.5, 0.5) : fluctuate(0.3, 0.15),
    humidity: fluctuate(50, 10),
  };

  const batteryBase = 60 + Math.random() * 30;
  const energy: EnergyData = {
    solarOutput: anomalyChance() ? fluctuate(400, 100) : fluctuate(1000, 200),
    batteryLevel: Math.min(100, Math.max(0, batteryBase)),
    consumption: fluctuate(750, 150),
    panelEfficiency: anomalyChance() ? fluctuate(60, 10) : fluctuate(90, 5),
  };

  const comms: CommsData = {
    signalStrength: anomalyChance() ? fluctuate(-95, 5) : fluctuate(-60, 10),
    latency: anomalyChance() ? fluctuate(1200, 300) : fluctuate(350, 100),
    dataRate: fluctuate(300, 150),
    packetLoss: anomalyChance() ? fluctuate(8, 3) : fluctuate(1, 0.8),
  };

  const orbital: OrbitalData = {
    altitude: fluctuate(408, 2),
    velocity: fluctuate(7.66, 0.05),
    inclination: fluctuate(51.6, 0.1),
    period: fluctuate(92.5, 0.3),
  };

  return {
    sensors,
    energy,
    comms,
    orbital,
    timestamp: Date.now(),
  };
}

/**
 * Gera um histórico inicial com N snapshots para popular os gráficos.
 * Espaçados em intervalos de 3 segundos (simulando dados anteriores).
 */
export function generateInitialHistory(count: number = 20): MissionSnapshot[] {
  const history: MissionSnapshot[] = [];
  const now = Date.now();
  for (let i = count; i > 0; i--) {
    const snapshot = generateSnapshot();
    snapshot.timestamp = now - i * 3000;
    history.push(snapshot);
  }
  return history;
}
