import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/colors';

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
            color={isFocused ? Colors.primary : Colors.slate400}
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
          placeholderTextColor={Colors.slate400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconWrapper}>
            <MaterialIcons
              name={rightIcon}
              size={22}
              color={Colors.slate400}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate800,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    height: 56,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.slate900,
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
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
