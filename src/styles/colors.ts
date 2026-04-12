export const Colors = {
  primary: '#2f7f33',
  primaryLight: '#2f7f3318',
  primaryMedium: '#2f7f3340',
  primaryBorder: '#2f7f3330',
 
  backgroundLight: '#f6f8f6',
  backgroundDark: '#141e15',
 
  white: '#ffffff',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
 
  danger: '#C62828',
  dangerLight: '#C6282815',
  teal: '#00695C',
  tealLight: '#00695C15',
  grayMuted: '#78909C',
  grayMutedLight: '#78909C15',
 
  green700: '#15803d',
} as const;
 
export const WasteColors: Record<string, { bg: string; text: string }> = {
  'Aprovechable':      { bg: '#2E7D3218', text: '#2E7D32' },
  'Peligroso':         { bg: '#C6282818', text: '#C62828' },
  'Orgánico':          { bg: '#00695C18', text: '#00695C' },
  'No Aprovechable': { bg: '#78909C18', text: '#78909C' },
};