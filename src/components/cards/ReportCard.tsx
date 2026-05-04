import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../styles/theme';
import { WasteColors } from '../../styles/colors';
import { Badge } from '../ui';

export interface ReportCardProps {
  type: keyof typeof WasteColors;
  location: string;
  material: string;
  dateStr: string;
  foto_url?: string | null;
  onPress?: () => void;
}

export const ReportCard = ({ type, location, material, dateStr, foto_url, onPress }: ReportCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const colors = WasteColors[type] || WasteColors['No Aprovechable'];

  return (
    <TouchableOpacity
      style={styles.reportCardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={foto_url ? { uri: foto_url } : require('../../../assets/images/placeholder_recycling.png')}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
      </View>
      <View style={styles.reportCardContent}>
        <View style={styles.reportCardHeader}>
          <Badge label={type} bgHex={colors.bg} colorHex={colors.text} />
        </View>
        <Text style={styles.reportCardLocation} numberOfLines={1}>{location}</Text>
        <Text style={styles.reportCardMaterial} numberOfLines={1}>Material: {material}</Text>
        <View style={styles.reportCardFooter}>
          <MaterialIcons name="event" size={14} color={theme.slate400} />
          <Text style={styles.reportCardDate}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  reportCardContainer: {
    backgroundColor: theme.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: theme.slate100,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
    height: 120,
    shadowColor: theme.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: '100%',
    backgroundColor: theme.slate100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  reportCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reportCardLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.slate900,
    marginBottom: 2,
  },
  reportCardMaterial: {
    fontSize: 13,
    color: theme.slate500,
    marginBottom: 8,
  },
  reportCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCardDate: {
    fontSize: 11,
    color: theme.slate400,
    marginLeft: 6,
  },
});
