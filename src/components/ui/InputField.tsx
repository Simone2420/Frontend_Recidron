import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../styles/theme';

export interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
}

export const InputField = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  style,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? theme.primary : theme.slate400}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.input, 
            icon && styles.inputWithIcon, 
            rightIcon && styles.inputWithRightIcon, 
            style
          ]}
          placeholderTextColor={theme.slate400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconWrapper}>
            <MaterialIcons
              name={rightIcon}
              size={22}
              color={theme.slate400}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.slate800,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.slate200,
    borderRadius: 12,
    height: 56,
  },
  inputFocused: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: theme.danger,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.slate900,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  rightIconWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.danger,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
