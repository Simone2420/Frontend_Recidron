import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  icon,
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const isPrimary = variant === 'primary';

  const getContainerStyle = () => {
    switch (variant) {
      case 'primary': return [styles.btnPrimary, disabled && styles.btnDisabled];
      case 'secondary': return [styles.btnSecondary, disabled && styles.btnDisabled];
      case 'outline': return [styles.btnOutline, disabled && styles.btnDisabled];
      case 'text': return [styles.btnText, disabled && styles.btnDisabled];
      default: return [styles.btnPrimary, disabled && styles.btnDisabled];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return styles.btnTextPrimary;
      case 'secondary': return styles.btnTextSecondary;
      case 'outline': return styles.btnTextOutline;
      case 'text': return styles.btnTextText;
      default: return styles.btnTextPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btnContainer, ...getContainerStyle(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? Colors.white : Colors.primary} />
      ) : (
        <View style={styles.btnContent}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={isPrimary ? Colors.white : Colors.primary}
              style={styles.btnIcon}
            />
          )}
          <Text style={[styles.btnTextBase, getTextStyle()]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnIcon: { marginRight: 8 },
  btnPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSecondary: { backgroundColor: Colors.primaryLight },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  btnText: { backgroundColor: 'transparent', paddingVertical: 8, paddingHorizontal: 12 },
  btnDisabled: { opacity: 0.6 },
  btnTextBase: { fontSize: 16, fontWeight: '700' },
  btnTextPrimary: { color: Colors.white },
  btnTextSecondary: { color: Colors.primary },
  btnTextOutline: { color: Colors.primary },
  btnTextText: { color: Colors.primary },
});
