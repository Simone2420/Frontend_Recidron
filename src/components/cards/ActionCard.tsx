import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../styles/colors';

export interface ActionCardProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export const ActionCard = ({ title, icon, onPress }: ActionCardProps) => {
  return (
    <TouchableOpacity
      style={styles.actionCardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.actionCardIconWrapper}>
        <MaterialIcons name={icon} size={24} color={Colors.primary} />
      </View>
      <Text style={styles.actionCardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionCardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.slate200,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  actionCardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate700,
  },
});
