/**
 * Utilitários de persistência com AsyncStorage.
 * Persiste configurações de alerta, histórico de missão e preferências.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertThresholds, DEFAULT_THRESHOLDS } from './alertEngine';

const KEYS = {
  THRESHOLDS: '@spa_alert_thresholds',
  MISSION_NAME: '@spa_mission_name',
  NOTIFICATIONS_ENABLED: '@spa_notifications_enabled',
} as const;

/** Salva limiares de alerta */
export async function saveThresholds(thresholds: AlertThresholds): Promise<void> {
  await AsyncStorage.setItem(KEYS.THRESHOLDS, JSON.stringify(thresholds));
}

/** Carrega limiares salvos ou retorna os padrões */
export async function loadThresholds(): Promise<AlertThresholds> {
  const raw = await AsyncStorage.getItem(KEYS.THRESHOLDS);
  if (raw) {
    return JSON.parse(raw) as AlertThresholds;
  }
  return DEFAULT_THRESHOLDS;
}

/** Salva nome da missão */
export async function saveMissionName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.MISSION_NAME, name);
}

/** Carrega nome da missão */
export async function loadMissionName(): Promise<string> {
  const name = await AsyncStorage.getItem(KEYS.MISSION_NAME);
  return name || 'Missão Orbital Alpha';
}

/** Salva preferência de notificações */
export async function saveNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(enabled));
}

/** Carrega preferência de notificações */
export async function loadNotificationsEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
  if (raw !== null) return JSON.parse(raw);
  return true;
}
