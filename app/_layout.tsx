/**
 * Layout raiz — envolve toda a aplicação com os providers de tema e missão.
 * Configura notificações e o StatusBar de acordo com o tema.
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { MissionProvider } from '@/contexts/MissionContext';
import { setupNotifications, requestNotificationPermission } from '@/utils/notifications';

function RootNav() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    setupNotifications();
    requestNotificationPermission();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="comms"
          options={{
            headerShown: true,
            title: 'Comunicação — Detalhes',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MissionProvider>
        <RootNav />
      </MissionProvider>
    </ThemeProvider>
  );
}
