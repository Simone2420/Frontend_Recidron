import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../styles/theme';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  onPress?: () => void;
}

export const StatCard = ({ title, value, subtitle, onPress }: StatCardProps) => {
  const Container = onPress ? TouchableOpacity : View;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Container
      style={styles.statCardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <View style={styles.statCardBody}>
        <Text style={styles.statCardValue} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>{value}</Text>
        <Text style={styles.statCardSubtitle}>{subtitle}</Text>
      </View>
    </Container>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  statCardContainer: {
    backgroundColor: theme.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: theme.slate100,
    borderWidth: 1,
    flex: 1,
  },
  statCardHeader: {
    backgroundColor: theme.primary,
    padding: 16,
    borderBottomWidth: 0,
  },
  statCardTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statCardBody: {
    padding: 16,
    paddingTop: 8,
  },
  statCardValue: {
    color: theme.slate900,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  statCardSubtitle: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
