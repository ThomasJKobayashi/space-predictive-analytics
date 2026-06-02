/**
 * Configuração de notificações locais com expo-notifications.
 * Envia notificações push locais quando alertas críticos são gerados.
 */

import * as Notifications from 'expo-notifications';
import { Alert as MissionAlert } from './alertEngine';

/** Configura o handler de notificações */
export function setupNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/** Solicita permissão para enviar notificações */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Envia notificação local para um alerta da missão */
export async function sendAlertNotification(alert: MissionAlert): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `⚠️ ${alert.title}`,
      body: alert.message,
      data: { alertId: alert.id, severity: alert.severity },
      sound: alert.severity === 'critical' ? 'default' : undefined,
    },
    trigger: null, // Envia imediatamente
  });
}
