/**
 * Layout de abas — navegação principal com 5 tabs.
 * Exibe badge com contagem de alertas ativos na aba "Alertas".
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { activeAlertCount } = useMission();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: '🛰️ Space Predictive Analytics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Sensores',
          headerTitle: '📡 Sensores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energia',
          headerTitle: '⚡ Energia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="battery-charging" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          headerTitle: '🚨 Central de Alertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge: activeAlertCount > 0 ? activeAlertCount : undefined,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          headerTitle: '⚙️ Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
