import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

export interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  bgColor?: string;
}

export const IconButton = ({
  icon,
  size = 24,
  color = Colors.slate700,
  bgColor = 'transparent',
  style,
  ...props
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.iconBtnContainer,
        { backgroundColor: bgColor },
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      <MaterialIcons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
