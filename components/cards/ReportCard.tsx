import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, WasteColors } from '../../styles/colors';
import { Badge } from '../ui';

export interface ReportCardProps {
  type: keyof typeof WasteColors;
  location: string;
  material: string;
  dateStr: string;
  onPress?: () => void;
}

export const ReportCard = ({ type, location, material, dateStr, onPress }: ReportCardProps) => {
  const colors = WasteColors[type] || WasteColors['No Aprovechable'];

  return (
    <TouchableOpacity
      style={styles.reportCardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.reportCardContent}>
        <View style={styles.reportCardHeader}>
          <Badge label={type} bgHex={colors.bg} colorHex={colors.text} />
        </View>
        <Text style={styles.reportCardLocation} numberOfLines={1}>{location}</Text>
        <Text style={styles.reportCardMaterial} numberOfLines={1}>Material: {material}</Text>
        <View style={styles.reportCardFooter}>
          <MaterialIcons name="event" size={14} color={Colors.slate400} />
          <Text style={styles.reportCardDate}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reportCardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: Colors.slate100,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportCardContent: {
    padding: 16,
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportCardLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 4,
  },
  reportCardMaterial: {
    fontSize: 14,
    color: Colors.slate500,
    marginBottom: 12,
  },
  reportCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCardDate: {
    fontSize: 12,
    color: Colors.slate400,
    marginLeft: 6,
  },
});
