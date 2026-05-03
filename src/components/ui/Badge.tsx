import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../styles/theme';

export interface BadgeProps {
  label: string;
  colorHex?: string;
  bgHex?: string;
}

export const Badge = ({ label, colorHex, bgHex }: BadgeProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const finalColor = colorHex || theme.primary;
  const finalBgColor = bgHex || theme.primaryLight;

  return (
    <View style={[styles.badgeContainer, { backgroundColor: finalBgColor }]}>
      <Text style={[styles.badgeText, { color: finalColor }]}>{label}</Text>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
