/**
 * Contexto global da missão — gerencia dados simulados, alertas e limiares.
 * Consumido por múltiplas telas para exibir dados em tempo real.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import {
  MissionSnapshot,
  generateSnapshot,
  generateInitialHistory,
} from '@/utils/simulatedData';
import {
  Alert as MissionAlert,
  AlertThresholds,
  DEFAULT_THRESHOLDS,
  evaluateAlerts,
} from '@/utils/alertEngine';
import {
  loadThresholds,
  saveThresholds,
  loadMissionName,
  saveMissionName,
  loadNotificationsEnabled,
  saveNotificationsEnabled,
} from '@/utils/storage';
import { sendAlertNotification } from '@/utils/notifications';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type MissionStatus = 'nominal' | 'warning' | 'critical';

interface MissionState {
  currentData: MissionSnapshot;
  history: MissionSnapshot[];
  alerts: MissionAlert[];
  alertHistory: MissionAlert[];
  thresholds: AlertThresholds;
  missionName: string;
  status: MissionStatus;
  notificationsEnabled: boolean;
}

type MissionAction =
  | { type: 'UPDATE_DATA'; payload: MissionSnapshot }
  | { type: 'ADD_ALERTS'; payload: MissionAlert[] }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'SET_THRESHOLDS'; payload: AlertThresholds }
  | { type: 'SET_MISSION_NAME'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'INIT'; payload: Partial<MissionState> };

// ─── Reducer ──────────────────────────────────────────────────────────────────

const MAX_HISTORY = 30;
const MAX_ALERT_HISTORY = 50;

function computeStatus(alerts: MissionAlert[]): MissionStatus {
  const active = alerts.filter((a) => !a.acknowledged);
  if (active.some((a) => a.severity === 'critical')) return 'critical';
  if (active.some((a) => a.severity === 'warning')) return 'warning';
  return 'nominal';
}

function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'UPDATE_DATA': {
      const newHistory = [...state.history, action.payload].slice(-MAX_HISTORY);
      return { ...state, currentData: action.payload, history: newHistory };
    }
    case 'ADD_ALERTS': {
      const newAlerts = [...action.payload, ...state.alerts];
      const newAlertHistory = [...action.payload, ...state.alertHistory].slice(
        0,
        MAX_ALERT_HISTORY
      );
      return {
        ...state,
        alerts: newAlerts,
        alertHistory: newAlertHistory,
        status: computeStatus(newAlerts),
      };
    }
    case 'ACKNOWLEDGE_ALERT': {
      const updated = state.alerts.map((a) =>
        a.id === action.payload ? { ...a, acknowledged: true } : a
      );
      return { ...state, alerts: updated, status: computeStatus(updated) };
    }
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [], status: 'nominal' };
    case 'SET_THRESHOLDS':
      return { ...state, thresholds: action.payload };
    case 'SET_MISSION_NAME':
      return { ...state, missionName: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notificationsEnabled: action.payload };
    case 'INIT':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface MissionContextType {
  state: MissionState;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
  updateThresholds: (t: AlertThresholds) => void;
  updateMissionName: (name: string) => void;
  toggleNotifications: (enabled: boolean) => void;
  activeAlertCount: number;
}

const MissionContext = createContext<MissionContextType | null>(null);

export const useMission = (): MissionContextType => {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission deve ser usado dentro de MissionProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

const initialSnapshot = generateSnapshot();
const initialHistory = generateInitialHistory(20);

const initialState: MissionState = {
  currentData: initialSnapshot,
  history: initialHistory,
  alerts: [],
  alertHistory: [],
  thresholds: DEFAULT_THRESHOLDS,
  missionName: 'Missão Orbital Alpha',
  status: 'nominal',
  notificationsEnabled: true,
};

export function MissionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(missionReducer, initialState);
  const [loaded, setLoaded] = useState(false);

  // Carrega dados persistidos do AsyncStorage na inicialização
  useEffect(() => {
    async function load() {
      const [thresholds, name, notifs] = await Promise.all([
        loadThresholds(),
        loadMissionName(),
        loadNotificationsEnabled(),
      ]);
      dispatch({
        type: 'INIT',
        payload: {
          thresholds,
          missionName: name,
          notificationsEnabled: notifs,
        },
      });
      setLoaded(true);
    }
    load();
  }, []);

  // Atualiza dados simulados a cada 3 segundos
  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(() => {
      const snapshot = generateSnapshot();
      dispatch({ type: 'UPDATE_DATA', payload: snapshot });

      // Avalia alertas com os limiares atuais
      const newAlerts = evaluateAlerts(snapshot, state.thresholds);
      if (newAlerts.length > 0) {
        dispatch({ type: 'ADD_ALERTS', payload: newAlerts });

        // Envia notificação para alertas críticos
        if (state.notificationsEnabled) {
          newAlerts
            .filter((a) => a.severity === 'critical')
            .forEach((a) => sendAlertNotification(a));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [loaded, state.thresholds, state.notificationsEnabled]);

  const acknowledgeAlert = useCallback((id: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: id });
  }, []);

  const clearAlerts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALERTS' });
  }, []);

  const updateThresholds = useCallback((t: AlertThresholds) => {
    dispatch({ type: 'SET_THRESHOLDS', payload: t });
    saveThresholds(t);
  }, []);

  const updateMissionName = useCallback((name: string) => {
    dispatch({ type: 'SET_MISSION_NAME', payload: name });
    saveMissionName(name);
  }, []);

  const toggleNotifications = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled });
    saveNotificationsEnabled(enabled);
  }, []);

  const activeAlertCount = state.alerts.filter((a) => !a.acknowledged).length;

  return (
    <MissionContext.Provider
      value={{
        state,
        acknowledgeAlert,
        clearAlerts,
        updateThresholds,
        updateMissionName,
        toggleNotifications,
        activeAlertCount,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}
