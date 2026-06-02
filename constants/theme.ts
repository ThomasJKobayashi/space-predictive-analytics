/**
 * Paleta de cores para tema espacial (dark/light mode).
 * O dark mode é o padrão, alinhado com a temática de operações espaciais.
 */

export const darkColors = {
  background: '#0B0D17',
  surface: '#1B1D2A',
  card: '#1E2035',
  cardAlt: '#252840',
  primary: '#4A9EFF',
  primaryLight: '#00D4FF',
  secondary: '#7C5CFC',
  success: '#2ED573',
  warning: '#FFB800',
  danger: '#FF4757',
  text: '#FFFFFF',
  textSecondary: '#A0A3B1',
  textMuted: '#6B6E7B',
  border: '#2A2D3E',
  tabBar: '#12141F',
  statusBar: 'light' as const,
};

export const lightColors = {
  background: '#F0F2F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardAlt: '#F8F9FB',
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  secondary: '#7C3AED',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  tabBar: '#FFFFFF',
  statusBar: 'dark' as const,
};

export type ThemeColors = typeof darkColors;
