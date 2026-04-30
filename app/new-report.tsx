import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { Button, InputField } from '../src/components/ui';
import { Colors, WasteColors } from '../src/styles/colors';
import { wasteService, WasteCatalogItem } from '../src/services/waste_service';
import { useAuth } from '../src/store/authStore';
import Toast from 'react-native-toast-message';

export default function NewReportScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catalogs from Backend
  const [types, setTypes] = useState<WasteCatalogItem[]>([]);
  const [materials, setMaterials] = useState<WasteCatalogItem[]>([]);
  const [zones, setZones] = useState<WasteCatalogItem[]>([]);
  const [sizes, setSizes] = useState<WasteCatalogItem[]>([]);

  // Form State (using IDs)
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [otherType, setOtherType] = useState('');
  const [otherMaterial, setOtherMaterial] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    setIsLoading(true);
    try {
      const [t, m, z, s] = await Promise.all([
        wasteService.getTypes(),
        wasteService.getMaterials(),
        wasteService.getZones(),
        wasteService.getSizes(),
      ]);
      setTypes(t);
      setMaterials(m);
      setZones(z);
      setSizes(s);
    } catch (error) {
      console.error('Error loading catalogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedType || !selectedMaterial || !selectedZone || !selectedSize) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor completa todos los campos obligatorios.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let finalDescription = description.trim();
      
      const selectedTypeName = types.find(t => t.id === selectedType)?.nombre_tipo;
      const selectedMaterialName = materials.find(m => m.id === selectedMaterial)?.nombre_material;
      
      const extras = [];
      if (selectedTypeName === 'Otro' && otherType.trim()) extras.push(`Tipo Específico: ${otherType.trim()}`);
      if (selectedMaterialName === 'Otro' && otherMaterial.trim()) extras.push(`Material Específico: ${otherMaterial.trim()}`);
      
      if (extras.length > 0) {
        finalDescription = extras.join(' | ') + (finalDescription ? `\n\nDescripción adicional: ${finalDescription}` : '');
      }

      await wasteService.createReport({
        usuario_id: user.id,
        tipo_residuo_id: selectedType,
        material_id: selectedMaterial,
        zona_id: selectedZone,
        tamano_id: selectedSize,
        descripcion: finalDescription,
      });
      setIsSubmitting(false);
      router.replace('/(tabs)/reports');
    } catch (error) {
      console.error('Error al crear reporte:', error);
      setIsSubmitting(false);
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

  const renderCatalogList = (items: WasteCatalogItem[], selectedId: number | null, onSelect: (id: number) => void, fieldName: string) => {
    if (items.length === 0) {
      return <Text style={styles.emptyCatalogText}>No hay {fieldName} registrados. Reinicia el servidor o contacta al admin.</Text>;
    }

    const isType = fieldName === "tipos";

    return (
      <View style={isType ? styles.categoryGrid : styles.catalogGrid}>
        {items.map((item) => {
          const name = item.nombre_tipo || item.nombre_material || item.nombre_zona || item.nombre_tamano || '';
          const isSelected = selectedId === item.id;
          const colorSet = isType ? (WasteColors[name] || { bg: Colors.slate100, text: Colors.slate700 }) : null;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                isType ? styles.categoryCard : styles.catalogCard,
                isSelected && (isType ? { borderColor: colorSet?.text, backgroundColor: colorSet?.bg } : styles.catalogCardActive)
              ]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
            >
              {isType && (
                <View style={[styles.categoryColorDot, { backgroundColor: colorSet?.text || Colors.slate400 }]} />
              )}
              <Text style={[
                isType ? styles.categoryCardText : styles.catalogCardText, 
                isSelected && (isType ? { fontWeight: 'bold', color: colorSet?.text } : styles.catalogCardTextActive)
              ]}>
                {name}
              </Text>
              {!isType && isSelected && <MaterialIcons name="check-circle" size={16} color={Colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderStep1 = () => {
    const selectedTypeName = types.find(t => t.id === selectedType)?.nombre_tipo;
    const selectedMaterialName = materials.find(m => m.id === selectedMaterial)?.nombre_material;

    return (
      <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Clasificación</Text>
        <Text style={styles.stepSubtitle}>Selecciona el tipo de residuo y el material principal.</Text>

        <Text style={styles.inputLabelLabel}>Tipo de Residuo</Text>
        {renderCatalogList(types, selectedType, setSelectedType, "tipos")}
        
        {selectedTypeName === 'Otro' && (
          <Animated.View entering={FadeInRight} style={styles.otherInputContainer}>
            <InputField
              label="Especifica el Tipo de Residuo"
              placeholder="Ej: Escombros, Electrónicos..."
              icon="edit"
              value={otherType}
              onChangeText={setOtherType}
            />
          </Animated.View>
        )}

        <Text style={[styles.inputLabelLabel, { marginTop: 20 }]}>Material</Text>
        {renderCatalogList(materials, selectedMaterial, setSelectedMaterial, "materiales")}
        
        {selectedMaterialName === 'Otro' && (
          <Animated.View entering={FadeInRight} style={styles.otherInputContainer}>
            <InputField
              label="Especifica el Material"
              placeholder="Ej: Llantas, Baterías, Tela..."
              icon="edit"
              value={otherMaterial}
              onChangeText={setOtherMaterial}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ubicación</Text>
      <Text style={styles.stepSubtitle}>Indica dónde se encuentra y añade una descripción.</Text>

      <Text style={styles.inputLabelLabel}>Zona del Campus</Text>
      {renderCatalogList(zones, selectedZone, setSelectedZone, "zonas")}

      <View style={{ marginTop: 24 }}>
        <InputField
          label="Descripción o Punto Exacto"
          placeholder="Ej: Bajando las escaleras, junto al bote rojo..."
          icon="explore"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Evidencia</Text>
      <Text style={styles.stepSubtitle}>Selecciona el volumen estimado y toma una foto.</Text>

      <Text style={styles.inputLabelLabel}>Tamaño Estimado</Text>
      <View style={styles.chipsRow}>
        {sizes.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.sizeChip, selectedSize === s.id && styles.sizeChipActive]}
            onPress={() => setSelectedSize(s.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sizeChipText, selectedSize === s.id && styles.sizeChipTextActive]}>
              {s.nombre_tamano}
            </Text>
          </TouchableOpacity>
        ))}
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
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors.slate500 }}>Sincronizando con el servidor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.slate900 },
  stepIndicatorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate200 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.slate200, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepNumber: { fontSize: 14, fontWeight: 'bold', color: Colors.slate500 },
  stepNumberActive: { color: Colors.white },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.slate200, marginHorizontal: 8 },
  stepLineActive: { backgroundColor: Colors.primary },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.slate900, marginBottom: 4 },
  stepSubtitle: { fontSize: 14, color: Colors.slate500, marginBottom: 24 },
  inputLabelLabel: { fontSize: 14, fontWeight: '600', color: Colors.slate800, marginBottom: 12 },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catalogCard: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.slate200, flexDirection: 'row', alignItems: 'center', gap: 6 },
  catalogCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  catalogCardText: { fontSize: 13, color: Colors.slate700 },
  catalogCardTextActive: { color: Colors.primary, fontWeight: 'bold' },
  emptyCatalogText: { fontSize: 13, color: Colors.danger, fontStyle: 'italic', marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.slate300, borderRadius: 12 },
  sizeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sizeChipText: { fontSize: 14, color: Colors.slate600 },
  sizeChipTextActive: { color: Colors.white, fontWeight: 'bold' },
  cameraBox: { height: 160, backgroundColor: Colors.slate100, borderRadius: 16, borderWidth: 2, borderColor: Colors.slate300, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  cameraBoxSuccess: { backgroundColor: '#059669', borderColor: '#059669', borderStyle: 'solid' },
  cameraText: { fontSize: 15, color: Colors.slate600 },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate200 },
  footerBackBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  footerBackText: { fontSize: 15, fontWeight: '600', color: Colors.slate600 },
  footerNextBtn: { flex: 1, marginLeft: 16 },
  footerSubmitBtn: { flex: 1, marginLeft: 16, backgroundColor: '#059669' },
  // Category Specific Styles
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  categoryCard: { width: '48%', padding: 16, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.slate200, flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryCardText: { fontSize: 13, color: Colors.slate700, flex: 1 },
  categoryColorDot: { width: 10, height: 10, borderRadius: 5 },
  otherInputContainer: { marginTop: 12, paddingBottom: 8 },
});
