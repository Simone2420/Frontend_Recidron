import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../styles/colors';

export interface BadgeProps {
  label: string;
  colorHex?: string;
  bgHex?: string;
}

export const Badge = ({ label, colorHex = Colors.primary, bgHex = Colors.primaryLight }: BadgeProps) => {
  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgHex }]}>
      <Text style={[styles.badgeText, { color: colorHex }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
