import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../styles/theme';

export interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  bgColor?: string;
}

export const IconButton = ({
  icon,
  size = 24,
  color,
  bgColor = 'transparent',
  style,
  ...props
}: IconButtonProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const finalColor = color || theme.slate700;

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
      <MaterialIcons name={icon} size={size} color={finalColor} />
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  iconBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
