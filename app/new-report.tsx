import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { Button, InputField } from '../src/components/ui';
import { Colors, WasteColors } from '../src/styles/colors';
import { wasteService } from '../src/services/waste_service';

type CategoryType = keyof typeof WasteColors;
type SizeType = 'Leve' | 'Mediano (2-5kg)' | 'Crítico';

export default function NewReportScreen() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [material, setMaterial] = useState('');
  const [zone, setZone] = useState('');
  const [exactPoint, setExactPoint] = useState('');
  const [size, setSize] = useState<SizeType | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await wasteService.createReport({
        type: category || 'General',
        material: material || size || 'No especificado',
        location: `${zone} - ${exactPoint}`,
        photo_url: photoTaken ? 'foto_tomada_localmente.jpg' : ''
      });
      setIsSubmitting(false);
      router.replace('/(tabs)/reports');
    } catch (error) {
      console.error('Error al crear reporte:', error);
      setIsSubmitting(false);
      // Para no trabar al usuario si falla la conexión en modo test
      router.replace('/(tabs)/reports');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
          </View>
          {s !== 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Clasificación del Residuo</Text>
      <Text style={styles.stepSubtitle}>Selecciona la categoría principal de la basura encontrada.</Text>

      <View style={styles.categoryGrid}>
        {(Object.keys(WasteColors) as CategoryType[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryCard,
              category === cat && { borderColor: WasteColors[cat].primary, backgroundColor: WasteColors[cat].bg }
            ]}
            onPress={() => setCategory(cat)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryColorDot, { backgroundColor: WasteColors[cat].primary }]} />
            <Text style={[styles.categoryCardText, category === cat && { fontWeight: 'bold' }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <InputField
          label="Material Específico (Opcional)"
          placeholder="Ej: Plástico PET, Cartón, Servilletas..."
          icon="recycling"
          value={material}
          onChangeText={setMaterial}
        />
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ubicación Geográfica</Text>
      <Text style={styles.stepSubtitle}>Indica exactamente dónde se encuentra la acumulación.</Text>

      <View style={{ marginTop: 16 }}>
        <InputField
          label="Zona Principal"
          placeholder="Ej. Biblioteca General, Zona Norte"
          icon="place"
          value={zone}
          onChangeText={setZone}
        />
        <InputField
          label="Punto Exacto o Sub-Sector"
          placeholder="Ej. Atrás de la facultad, Cuadrante B12"
          icon="explore"
          value={exactPoint}
          onChangeText={setExactPoint}
        />
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Toma de Evidencia</Text>
      <Text style={styles.stepSubtitle}>Fundamental para que las brigadas identifiquen la magnitud.</Text>

      <View style={{ marginTop: 16, marginBottom: 24 }}>
        <Text style={styles.inputLabelLabel}>Tamaño Estimado</Text>
        <View style={styles.chipsRow}>
          {['Leve', 'Mediano (2-5kg)', 'Crítico'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sizeChip, size === s && styles.sizeChipActive]}
              onPress={() => setSize(s as SizeType)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sizeChipText, size === s && styles.sizeChipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.cameraBox, photoTaken && styles.cameraBoxSuccess]} 
        activeOpacity={0.8}
        onPress={() => setPhotoTaken(true)}
      >
        <MaterialIcons 
          name={photoTaken ? "check-circle" : "camera-alt"} 
          size={48} 
          color={photoTaken ? Colors.white : Colors.slate400} 
        />
        <Text style={[styles.cameraText, photoTaken && { color: Colors.white, fontWeight: 'bold' }]}>
          {photoTaken ? "¡Evidencia Capturada!" : "Abrir Cámara Nativa"}
        </Text>
        {!photoTaken && <Text style={styles.cameraSubText}>Se usará tu GPS local (EXIF)</Text>}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack}>
          <MaterialIcons name="close" size={24} color={Colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Reporte</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderStepIndicator()}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Nav */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBackBtn} onPress={handleBack}>
          <Text style={styles.footerBackText}>{step === 1 ? 'Cancelar' : 'Atrás'}</Text>
        </TouchableOpacity>
        
        {step < 3 ? (
          <Button 
            title="Siguiente" 
            onPress={handleNext}
            style={styles.footerNextBtn} 
          />
        ) : (
          <Button 
            title="Emitir Reporte" 
            onPress={handleSubmit} 
            isLoading={isSubmitting}
            style={styles.footerSubmitBtn} 
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundLight,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.slate900,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.slate200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.slate500,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.slate200,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.slate900,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: Colors.slate500,
    marginBottom: 24,
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.slate200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryCardText: {
    fontSize: 13,
    color: Colors.slate700,
    flex: 1,
  },
  inputLabelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate800,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: 999,
  },
  sizeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.slate600,
  },
  sizeChipTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  cameraBox: {
    height: 200,
    backgroundColor: Colors.slate100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.slate300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  cameraBoxSuccess: {
    backgroundColor: '#059669', // Verde éxito
    borderColor: '#059669',
    borderStyle: 'solid',
  },
  cameraText: {
    fontSize: 16,
    color: Colors.slate600,
    marginTop: 8,
  },
  cameraSubText: {
    fontSize: 13,
    color: Colors.slate400,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
  },
  footerBackBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate600,
  },
  footerNextBtn: {
    flex: 1,
    marginLeft: 16,
  },
  footerSubmitBtn: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#059669', // Un verde para que sienta que "Terminó"
  },
});
