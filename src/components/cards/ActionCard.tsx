import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../styles/theme';

export interface ActionCardProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export const ActionCard = ({ title, icon, onPress }: ActionCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={styles.actionCardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.actionCardIconWrapper}>
        <MaterialIcons name={icon} size={24} color={theme.primary} />
      </View>
      <Text style={styles.actionCardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  actionCardContainer: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.slate200,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  actionCardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.slate700,
  },
});
