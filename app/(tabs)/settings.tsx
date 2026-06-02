/**
 * Tela de Configurações — formulário com validação para limiares de alerta,
 * nome da missão, toggle de dark mode e toggle de notificações.
 * Dados persistidos com AsyncStorage via MissionContext e ThemeContext.
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useMission } from '@/contexts/MissionContext';
import { AlertThresholds } from '@/utils/alertEngine';

// ─── Tipos de validação ───────────────────────────────────────────────────────

interface FieldError {
  [key: string]: string | null;
}

interface ThresholdField {
  key: keyof AlertThresholds;
  label: string;
  unit: string;
  min: number;
  max: number;
  placeholder: string;
}

const THRESHOLD_FIELDS: ThresholdField[] = [
  { key: 'tempMax', label: 'Temp. Máxima', unit: '°C', min: 20, max: 80, placeholder: '35' },
  { key: 'tempMin', label: 'Temp. Mínima', unit: '°C', min: -50, max: 15, placeholder: '0' },
  { key: 'radiationMax', label: 'Radiação Máxima', unit: 'mSv/h', min: 0.1, max: 5, placeholder: '0.8' },
  { key: 'batteryMin', label: 'Bateria Mínima', unit: '%', min: 5, max: 50, placeholder: '20' },
  { key: 'solarOutputMin', label: 'Geração Solar Mín.', unit: 'W', min: 100, max: 1000, placeholder: '500' },
  { key: 'signalMin', label: 'Sinal Mínimo', unit: 'dBm', min: -120, max: -40, placeholder: '-85' },
  { key: 'latencyMax', label: 'Latência Máxima', unit: 'ms', min: 100, max: 5000, placeholder: '800' },
  { key: 'packetLossMax', label: 'Perda Pacotes Máx.', unit: '%', min: 1, max: 20, placeholder: '4' },
];

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { state, updateThresholds, updateMissionName, toggleNotifications } = useMission();

  // Estado local do formulário
  const [missionName, setMissionName] = useState(state.missionName);
  const [thresholdValues, setThresholdValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<FieldError>({});
  const [saved, setSaved] = useState(false);

  // Inicializa valores dos campos a partir do estado global
  useEffect(() => {
    const initial: Record<string, string> = {};
    THRESHOLD_FIELDS.forEach((f) => {
      initial[f.key] = String(state.thresholds[f.key]);
    });
    setThresholdValues(initial);
  }, []);

  /** Atualiza valor de um campo de limiar */
  const handleThresholdChange = (key: string, value: string) => {
    setThresholdValues((prev) => ({ ...prev, [key]: value }));
    // Limpa erro ao digitar
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
    setSaved(false);
  };

  /** Valida todos os campos e retorna true se válido */
  const validate = (): boolean => {
    const newErrors: FieldError = {};
    let valid = true;

    // Validação do nome da missão
    if (!missionName.trim()) {
      newErrors.missionName = 'Nome da missão é obrigatório';
      valid = false;
    }

    // Validação dos limiares
    THRESHOLD_FIELDS.forEach((field) => {
      const raw = thresholdValues[field.key];
      const num = parseFloat(raw);

      if (!raw || raw.trim() === '') {
        newErrors[field.key] = 'Campo obrigatório';
        valid = false;
      } else if (isNaN(num)) {
        newErrors[field.key] = 'Deve ser um número válido';
        valid = false;
      } else if (num < field.min || num > field.max) {
        newErrors[field.key] = `Deve estar entre ${field.min} e ${field.max}`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  /** Salva configurações após validação */
  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Erro de Validação', 'Corrija os campos destacados antes de salvar.');
      return;
    }

    // Monta objeto de limiares
    const newThresholds: AlertThresholds = {} as AlertThresholds;
    THRESHOLD_FIELDS.forEach((f) => {
      (newThresholds as any)[f.key] = parseFloat(thresholdValues[f.key]);
    });

    updateThresholds(newThresholds);
    updateMissionName(missionName.trim());
    setSaved(true);

    Alert.alert('Configurações Salvas', 'Os novos limiares de alerta foram aplicados com sucesso.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        {/* Seção: Missão */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          CONFIGURAÇÃO DA MISSÃO
        </Text>
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Nome da Missão</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: errors.missionName ? colors.danger : colors.border,
              },
            ]}
            value={missionName}
            onChangeText={(v) => {
              setMissionName(v);
              if (errors.missionName) setErrors((p) => ({ ...p, missionName: null }));
              setSaved(false);
            }}
            placeholder="Ex: Missão Orbital Alpha"
            placeholderTextColor={colors.textMuted}
          />
          {errors.missionName && (
            <Text style={[styles.errorText, { color: colors.danger }]}>{errors.missionName}</Text>
          )}
        </View>

        {/* Seção: Preferências */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERÊNCIAS</Text>
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Ionicons name="moon" size={20} color={colors.primary} />
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Modo Escuro</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Ionicons name="notifications" size={20} color={colors.primary} />
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Notificações</Text>
            </View>
            <Switch
              value={state.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Seção: Limiares de Alerta */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          LIMIARES DE ALERTA
        </Text>
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {THRESHOLD_FIELDS.map((field, index) => (
            <View key={field.key}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {field.label} ({field.unit})
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: errors[field.key] ? colors.danger : colors.border,
                  },
                ]}
                value={thresholdValues[field.key]}
                onChangeText={(v) => handleThresholdChange(field.key, v)}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
              {errors[field.key] && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {errors[field.key]}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: saved ? colors.success : colors.primary }]}
          onPress={handleSave}
        >
          <Ionicons name={saved ? 'checkmark' : 'save'} size={20} color="#FFF" />
          <Text style={styles.saveText}>{saved ? 'Salvo!' : 'Salvar Configurações'}</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  fieldCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
