import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { Button, InputField } from '../src/components/ui';
import { useTheme } from '../src/styles/theme';
import { WasteColors } from '../src/styles/colors';
import { wasteService, WasteCatalogItem, Subzone } from '../src/services/waste_service';
import { locationService, GeoCoordinates } from '../src/services/location_service';
import { useAuth } from '../src/store/authStore';
import Toast from 'react-native-toast-message';

export default function NewReportScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
  const [photoTaken, setPhotoTaken] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Subzones State
  const [availableSubzones, setAvailableSubzones] = useState<Subzone[]>([]);
  const [selectedSubzone, setSelectedSubzone] = useState<number | null>(null);
  const [isLoadingSubzones, setIsLoadingSubzones] = useState(false);
  const [isSubzoneModalVisible, setIsSubzoneModalVisible] = useState(false);
  const [subzoneSearch, setSubzoneSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('all');

  // GPS State
  const [coords, setCoords] = useState<GeoCoordinates | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturing' | 'ready' | 'denied' | 'error'>('idle');

  useEffect(() => {
    loadCatalogs();
  }, []);

  const captureLocation = async () => {
    setGpsStatus('capturing');
    const result = await locationService.getCurrentCoordinates();
    setCoords(result.coords);
    setGpsStatus(result.status);
    if (result.status === 'ready' && result.coords) {
      Toast.show({
        type: 'success',
        text1: 'Coordenadas capturadas',
        text2: `Margen de error: ±${result.coords.precision ? result.coords.precision.toFixed(1) : 0} m | Altitud: ${result.coords.altitud ? result.coords.altitud.toFixed(1) + ' m' : 'N/A'}`,
      });
    } else if (result.status === 'denied') {
      Toast.show({
        type: 'info',
        text1: 'Permiso de ubicación denegado',
        text2: 'Puedes continuar sin GPS; el reporte quedará como No especificada.',
      });
    } else if (result.status === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Error de GPS',
        text2: result.errorMessage || 'No se pudo obtener la posición exacta.',
      });
    }
  };

  const handleClearCoords = () => {
    setCoords(null);
    setGpsStatus('idle');
  };

  const handleSelectZone = async (zoneId: number) => {
    setSelectedZone(zoneId);
    setSelectedSubzone(null);
    setIsLoadingSubzones(true);
    try {
      const list = await wasteService.getSubzones(zoneId);
      setAvailableSubzones(list);
    } catch (error) {
      console.error('Error loading subzones:', error);
      setAvailableSubzones([]);
    } finally {
      setIsLoadingSubzones(false);
    }
  };

  const selectedSubzoneObj = useMemo(() => {
    return availableSubzones.find((s) => s.id === selectedSubzone);
  }, [availableSubzones, selectedSubzone]);

  const selectedZoneName = useMemo(() => {
    return zones.find((z) => z.id === selectedZone)?.nombre_zona || '';
  }, [zones, selectedZone]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    availableSubzones.forEach((s) => {
      if (s.tipo_subzona_nombre) set.add(s.tipo_subzona_nombre);
    });
    return Array.from(set);
  }, [availableSubzones]);

  const availableFloors = useMemo(() => {
    const set = new Set<string>();
    availableSubzones.forEach((s) => {
      if (s.piso) set.add(s.piso);
    });
    return Array.from(set).sort();
  }, [availableSubzones]);

  const filteredSubzones = useMemo(() => {
    return availableSubzones.filter((item) => {
      const matchType = selectedTypeFilter === 'all' || item.tipo_subzona_nombre === selectedTypeFilter;
      const matchFloor = selectedFloorFilter === 'all' || item.piso === selectedFloorFilter;
      const query = subzoneSearch.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        item.nombre_subzona.toLowerCase().includes(query) ||
        (item.tipo_subzona_nombre && item.tipo_subzona_nombre.toLowerCase().includes(query)) ||
        (item.piso && item.piso.toLowerCase().includes(query));
      return matchType && matchFloor && matchSearch;
    });
  }, [availableSubzones, selectedTypeFilter, selectedFloorFilter, subzoneSearch]);

  const getSubzoneIcon = (tipo?: string): any => {
    if (!tipo) return 'place';
    const t = tipo.toLowerCase();
    if (t.includes('aula')) return 'meeting-room';
    if (t.includes('oficina') || t.includes('coordinación') || t.includes('rectoría') || t.includes('admisiones')) return 'business';
    if (t.includes('baño') || t.includes('sanitario')) return 'wc';
    if (t.includes('laboratorio')) return 'biotech';
    if (t.includes('área común') || t.includes('comun') || t.includes('ajedrez') || t.includes('hall') || t.includes('ala') || t.includes('libre')) return 'deck';
    if (t.includes('servicio') || t.includes('papelería')) return 'store';
    return 'place';
  };

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
    if (step === 1) {
      if (!selectedType || !selectedMaterial) {
        Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Por favor selecciona el tipo de residuo y el material.' });
        return;
      }
    } else if (step === 2) {
      if (!selectedZone) {
        Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Por favor selecciona la zona del campus.' });
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permiso denegado',
        text2: 'Necesitamos acceso a la cámara para tomar la foto.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPhotoTaken(true);
    }
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

      const newReport = await wasteService.createReport({
        usuario_id: user.id,
        tipo_residuo_id: selectedType,
        material_id: selectedMaterial,
        zona_id: selectedZone,
        subzona_id: selectedSubzone ?? undefined,
        tamano_id: selectedSize,
        descripcion: finalDescription,
        latitud: coords?.latitud,
        longitud: coords?.longitud,
        altitud: coords?.altitud ?? undefined,
        precision: coords?.precision ?? undefined,
      });

      if (imageUri && newReport?.id) {
        await wasteService.uploadReportPhoto(newReport.id, imageUri);
      }
      
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Reporte emitido',
        text2: 'El reporte se ha creado correctamente.',
      });
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
          const colorSet = isType ? (WasteColors[name] || { bg: theme.slate100, text: theme.slate700 }) : null;

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
                <View style={[styles.categoryColorDot, { backgroundColor: colorSet?.text || theme.slate400 }]} />
              )}
              <Text style={[
                isType ? styles.categoryCardText : styles.catalogCardText, 
                isSelected && (isType ? { fontWeight: 'bold', color: colorSet?.text } : styles.catalogCardTextActive)
              ]}>
                {name}
              </Text>
              {!isType && isSelected && <MaterialIcons name="check-circle" size={16} color={theme.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderStep1 = () => {
    return (
      <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Clasificación</Text>
        <Text style={styles.stepSubtitle}>Selecciona el tipo de residuo y el material principal.</Text>

        <Text style={styles.inputLabelLabel}>Tipo de Residuo</Text>
        {renderCatalogList(types, selectedType, setSelectedType, "tipos")}

        <Text style={[styles.inputLabelLabel, { marginTop: 20 }]}>Material</Text>
        {renderCatalogList(materials, selectedMaterial, setSelectedMaterial, "materiales")}
      </Animated.View>
    );
  };

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeInLeft} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ubicación</Text>
      <Text style={styles.stepSubtitle}>Indica dónde se encuentra y añade una descripción.</Text>

      <Text style={styles.inputLabelLabel}>Zona del Campus</Text>
      {renderCatalogList(zones, selectedZone, handleSelectZone, "zonas")}

      {/* Subzona / Punto Específico */}
      <View style={styles.subzoneSectionContainer}>
        <View style={styles.subzoneSectionHeader}>
          <Text style={styles.inputLabelLabel}>Subzona / Punto Específico</Text>
          <Text style={styles.subzoneOptionalBadge}>Opcional</Text>
        </View>

        {!selectedZone ? (
          <View style={styles.subzoneEmptyHint}>
            <MaterialIcons name="info-outline" size={20} color={theme.slate400} />
            <Text style={styles.subzoneEmptyHintText}>
              Selecciona primero una zona del campus para ver las aulas, oficinas y puntos específicos disponibles.
            </Text>
          </View>
        ) : isLoadingSubzones ? (
          <View style={styles.subzoneLoadingCard}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={styles.subzoneLoadingText}>Cargando subzonas de {selectedZoneName}...</Text>
          </View>
        ) : availableSubzones.length === 0 ? (
          <View style={styles.subzoneEmptyHint}>
            <MaterialIcons name="location-off" size={20} color={theme.slate400} />
            <Text style={styles.subzoneEmptyHintText}>
              No hay subzonas registradas para esta zona. Puedes ingresar el punto en la descripción abajo.
            </Text>
          </View>
        ) : selectedSubzone && selectedSubzoneObj ? (
          <View style={styles.subzoneSelectedCard}>
            <View style={styles.subzoneIconBox}>
              <MaterialIcons
                name={getSubzoneIcon(selectedSubzoneObj.tipo_subzona_nombre)}
                size={22}
                color={theme.primary}
              />
            </View>
            <View style={styles.subzoneCardInfo}>
              <Text style={styles.subzoneCardTitle}>{selectedSubzoneObj.nombre_subzona}</Text>
              <View style={styles.subzoneBadgesRow}>
                {selectedSubzoneObj.tipo_subzona_nombre && (
                  <View style={styles.subzoneBadge}>
                    <Text style={styles.subzoneBadgeText}>{selectedSubzoneObj.tipo_subzona_nombre}</Text>
                  </View>
                )}
                {selectedSubzoneObj.piso && (
                  <View style={[styles.subzoneBadge, styles.subzoneBadgeFloor]}>
                    <Text style={[styles.subzoneBadgeText, styles.subzoneBadgeFloorText]}>
                      Piso {selectedSubzoneObj.piso}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.subzoneChangeBtn}
              onPress={() => setIsSubzoneModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.subzoneChangeBtnText}>Cambiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subzoneRemoveBtn}
              onPress={() => setSelectedSubzone(null)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={18} color={theme.slate400} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.subzoneSelectTriggerCard}
            onPress={() => setIsSubzoneModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.subzoneIconBoxInactive}>
              <MaterialIcons name="add-location-alt" size={22} color={theme.slate500} />
            </View>
            <View style={styles.subzoneCardInfo}>
              <Text style={styles.subzoneSelectTriggerTitle}>Seleccionar punto específico...</Text>
              <Text style={styles.subzoneSelectTriggerSubtitle}>
                {availableSubzones.length} puntos disponibles (Aulas, Oficinas, Baños, etc.)
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.slate400} />
          </TouchableOpacity>
        )}
      </View>

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

      {/* Sección de Coordenadas GPS */}
      <View style={styles.gpsSectionContainer}>
        <Text style={styles.inputLabelLabel}>Coordenadas GPS (Opcional)</Text>
        
        {gpsStatus === 'idle' && (
          <View style={styles.gpsIdleCard}>
            <View style={styles.gpsIdleHeader}>
              <View style={styles.gpsIconWrap}>
                <MaterialIcons name="my-location" size={22} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.gpsTitle}>Ubicación GPS del Campus</Text>
                <Text style={styles.gpsSubtitle}>
                  Captura el punto exacto y altitud del residuo con alta precisión.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.gpsTriggerBtn}
              onPress={captureLocation}
              activeOpacity={0.8}
            >
              <MaterialIcons name="gps-fixed" size={18} color={theme.white} />
              <Text style={styles.gpsTriggerBtnText}>Suministrar Coordenadas GPS</Text>
            </TouchableOpacity>
          </View>
        )}

        {gpsStatus === 'capturing' && (
          <View style={[styles.gpsCard, styles.gpsCardCapturing]}>
            <ActivityIndicator size="small" color={theme.primary} />
            <View style={styles.gpsInfo}>
              <Text style={styles.gpsTitle}>Obteniendo coordenadas exactas...</Text>
              <Text style={styles.gpsSubtitle}>
                Calibrando sensores GNSS/GPS para precisión de campus universitario.
              </Text>
            </View>
          </View>
        )}

        {gpsStatus === 'ready' && coords && (
          <View style={[styles.gpsCard, styles.gpsCardSuccess]}>
            <View style={styles.gpsHeaderSuccess}>
              <View style={styles.gpsSuccessBadge}>
                <MaterialIcons name="check-circle" size={18} color="#059669" />
                <Text style={styles.gpsSuccessBadgeText}>GPS Fijado (Alta Precisión)</Text>
              </View>
              <TouchableOpacity onPress={handleClearCoords} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={18} color={theme.slate500} />
              </TouchableOpacity>
            </View>

            <View style={styles.gpsValuesGrid}>
              <View style={styles.gpsValueCol}>
                <Text style={styles.gpsValueLabel}>COORDENADAS</Text>
                <Text style={styles.gpsValueMono}>{coords.latitud.toFixed(8)}, {coords.longitud.toFixed(8)}</Text>
              </View>
              <View style={styles.gpsValueRow}>
                <View style={styles.gpsValueColHalf}>
                  <Text style={styles.gpsValueLabel}>MARGEN DE ERROR</Text>
                  <Text style={styles.gpsValueText}>±{coords.precision != null ? coords.precision.toFixed(2) : '0.00'} m</Text>
                </View>
                <View style={styles.gpsValueColHalf}>
                  <Text style={styles.gpsValueLabel}>ALTITUD EXACTA</Text>
                  <Text style={styles.gpsValueText}>{coords.altitud != null ? `${coords.altitud.toFixed(2)} msnm` : 'No disponible'}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.gpsRefreshBtn}
              onPress={captureLocation}
              activeOpacity={0.7}
            >
              <MaterialIcons name="refresh" size={16} color={theme.primary} />
              <Text style={styles.gpsRefreshBtnText}>Actualizar Coordenadas</Text>
            </TouchableOpacity>
          </View>
        )}

        {(gpsStatus === 'denied' || gpsStatus === 'error') && (
          <View style={[styles.gpsCard, styles.gpsCardWarning]}>
            <View style={styles.gpsIconWrap}>
              <MaterialIcons
                name={gpsStatus === 'denied' ? "location-disabled" : "error-outline"}
                size={22}
                color="#D97706"
              />
            </View>
            <View style={styles.gpsInfo}>
              <Text style={styles.gpsTitle}>
                {gpsStatus === 'denied' ? 'Permiso de GPS Denegado' : 'Error al Obtener GPS'}
              </Text>
              <Text style={styles.gpsSubtitle}>
                {gpsStatus === 'denied'
                  ? 'Sin acceso al sensor. El reporte se registrará como "No especificada".'
                  : 'No se pudo leer la señal GPS. Puedes reintentar o continuar sin ella.'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.gpsRetryBtn}
              onPress={captureLocation}
              activeOpacity={0.7}
            >
              <MaterialIcons name="refresh" size={18} color="#D97706" />
              <Text style={styles.gpsRetryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
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
        onPress={takePhoto}
      >
        {photoTaken && imageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
            <View style={styles.previewOverlay}>
              <MaterialIcons name="check-circle" size={32} color={theme.white} />
              <Text style={styles.previewText}>Cambiar Foto</Text>
            </View>
          </View>
        ) : (
          <>
            <MaterialIcons 
              name="camera-alt" 
              size={48} 
              color={theme.slate400} 
            />
            <Text style={styles.cameraText}>
              Abrir Cámara Nativa
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 12, color: theme.slate500 }}>Sincronizando con el servidor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack}>
          <MaterialIcons name="close" size={24} color={theme.slate900} />
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

      {/* Modal Selector de Subzonas con Doble Filtro */}
      <Modal
        visible={isSubzoneModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSubzoneModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalDragHandle} />

            {/* Encabezado del modal */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Punto Específico / Subzona</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedZoneName ? `${selectedZoneName} • ` : ''}{filteredSubzones.length} opciones disponibles
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsSubzoneModalVisible(false)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="close" size={22} color={theme.slate500} />
              </TouchableOpacity>
            </View>

            {/* Barra de Búsqueda en tiempo real */}
            <View style={styles.modalSearchContainer}>
              <MaterialIcons name="search" size={20} color={theme.slate400} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Buscar aula, oficina, baño (ej: 204, Bienestar)..."
                placeholderTextColor={theme.slate400}
                value={subzoneSearch}
                onChangeText={setSubzoneSearch}
                clearButtonMode="while-editing"
              />
              {subzoneSearch.length > 0 && (
                <TouchableOpacity onPress={() => setSubzoneSearch('')}>
                  <MaterialIcons name="cancel" size={18} color={theme.slate400} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtro por Tipo de Espacio */}
            {availableTypes.length > 1 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Tipo de Espacio</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                  <TouchableOpacity
                    style={[styles.filterChip, selectedTypeFilter === 'all' && styles.filterChipActive]}
                    onPress={() => setSelectedTypeFilter('all')}
                  >
                    <Text style={[styles.filterChipText, selectedTypeFilter === 'all' && styles.filterChipTextActive]}>
                      Todos
                    </Text>
                  </TouchableOpacity>
                  {availableTypes.map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[styles.filterChip, selectedTypeFilter === tipo && styles.filterChipActive]}
                      onPress={() => setSelectedTypeFilter(tipo)}
                    >
                      <Text style={[styles.filterChipText, selectedTypeFilter === tipo && styles.filterChipTextActive]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Filtro por Piso / Nivel */}
            {availableFloors.length > 1 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Piso / Nivel</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                  <TouchableOpacity
                    style={[styles.filterChip, selectedFloorFilter === 'all' && styles.filterChipActive]}
                    onPress={() => setSelectedFloorFilter('all')}
                  >
                    <Text style={[styles.filterChipText, selectedFloorFilter === 'all' && styles.filterChipTextActive]}>
                      Todos los pisos
                    </Text>
                  </TouchableOpacity>
                  {availableFloors.map((piso) => (
                    <TouchableOpacity
                      key={piso}
                      style={[styles.filterChip, selectedFloorFilter === piso && styles.filterChipActive]}
                      onPress={() => setSelectedFloorFilter(piso)}
                    >
                      <Text style={[styles.filterChipText, selectedFloorFilter === piso && styles.filterChipTextActive]}>
                        Piso {piso}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Lista de subzonas */}
            <ScrollView style={styles.subzoneList} showsVerticalScrollIndicator={false}>
              {filteredSubzones.length === 0 ? (
                <View style={styles.subzoneListEmpty}>
                  <MaterialIcons name="search-off" size={36} color={theme.slate400} />
                  <Text style={styles.subzoneListEmptyText}>No se encontraron subzonas</Text>
                  <Text style={styles.subzoneListEmptySubtext}>
                    Intenta cambiar los filtros o el término de búsqueda.
                  </Text>
                </View>
              ) : (
                filteredSubzones.map((item) => {
                  const isSelected = selectedSubzone === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.subzoneListItem, isSelected && styles.subzoneListItemActive]}
                      onPress={() => {
                        setSelectedSubzone(item.id);
                        setIsSubzoneModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.subzoneListIcon, isSelected && styles.subzoneListIconActive]}>
                        <MaterialIcons
                          name={getSubzoneIcon(item.tipo_subzona_nombre)}
                          size={20}
                          color={isSelected ? theme.primary : theme.slate500}
                        />
                      </View>
                      <View style={styles.subzoneListContent}>
                        <Text style={[styles.subzoneListName, isSelected && styles.subzoneListNameActive]}>
                          {item.nombre_subzona}
                        </Text>
                        <View style={styles.subzoneListMetaRow}>
                          {item.tipo_subzona_nombre && (
                            <Text style={styles.subzoneListType}>{item.tipo_subzona_nombre}</Text>
                          )}
                          {item.tipo_subzona_nombre && item.piso && (
                            <Text style={styles.subzoneListDot}>•</Text>
                          )}
                          {item.piso && (
                            <Text style={styles.subzoneListFloor}>Piso {item.piso}</Text>
                          )}
                        </View>
                      </View>
                      <MaterialIcons
                        name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                        size={20}
                        color={isSelected ? theme.primary : theme.slate400}
                      />
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            {/* Footer del Modal */}
            <View style={styles.modalFooter}>
              {selectedSubzone && (
                <TouchableOpacity
                  style={styles.modalClearBtn}
                  onPress={() => {
                    setSelectedSubzone(null);
                    setIsSubzoneModalVisible(false);
                  }}
                >
                  <Text style={styles.modalClearBtnText}>Quitar selección</Text>
                </TouchableOpacity>
              )}
              <Button
                title="Cerrar"
                variant="outline"
                onPress={() => setIsSubzoneModalVisible(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.backgroundLight },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.slate900 },
  stepIndicatorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.slate200 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.slate200, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: theme.primary },
  stepNumber: { fontSize: 14, fontWeight: 'bold', color: theme.slate500 },
  stepNumberActive: { color: theme.white },
  stepLine: { width: 40, height: 2, backgroundColor: theme.slate200, marginHorizontal: 8 },
  stepLineActive: { backgroundColor: theme.primary },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: theme.slate900, marginBottom: 4 },
  stepSubtitle: { fontSize: 14, color: theme.slate500, marginBottom: 24 },
  inputLabelLabel: { fontSize: 14, fontWeight: '600', color: theme.slate800, marginBottom: 12 },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catalogCard: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.slate200, flexDirection: 'row', alignItems: 'center', gap: 6 },
  catalogCardActive: { borderColor: theme.primary, backgroundColor: theme.primaryLight },
  catalogCardText: { fontSize: 13, color: theme.slate700 },
  catalogCardTextActive: { color: theme.primary, fontWeight: 'bold' },
  emptyCatalogText: { fontSize: 13, color: theme.danger, fontStyle: 'italic', marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: theme.slate100, borderWidth: 1, borderColor: theme.slate300, borderRadius: 12 },
  sizeChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  sizeChipText: { fontSize: 14, color: theme.slate900 },
  sizeChipTextActive: { color: theme.white, fontWeight: 'bold' },
  cameraBox: { height: 160, backgroundColor: theme.slate100, borderRadius: 16, borderWidth: 2, borderColor: theme.slate300, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  cameraBoxSuccess: { backgroundColor: theme.slate100, borderColor: '#059669', borderStyle: 'solid' },
  cameraText: { fontSize: 15, color: theme.slate900 },
  previewContainer: { width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  previewText: { color: theme.white, fontSize: 13, fontWeight: 'bold' },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.slate200 },
  footerBackBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  footerBackText: { fontSize: 15, fontWeight: '600', color: theme.slate800 },
  footerNextBtn: { flex: 1, marginLeft: 16 },
  footerSubmitBtn: { flex: 1, marginLeft: 16, backgroundColor: '#059669' },
  // Category Specific Styles
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  categoryCard: { width: '48%', padding: 16, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.slate200, flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryCardText: { fontSize: 13, color: theme.slate700, flex: 1 },
  categoryColorDot: { width: 10, height: 10, borderRadius: 5 },
  otherInputContainer: { marginTop: 12, paddingBottom: 8 },
  // GPS Status Card Styles
  gpsSectionContainer: {
    marginTop: 24,
  },
  gpsIdleCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.slate200,
    gap: 14,
  },
  gpsIdleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  gpsTriggerBtnText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: '700',
  },
  gpsCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.slate200,
  },
  gpsCardCapturing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderColor: theme.primary,
    backgroundColor: theme.primaryLight,
  },
  gpsCardSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    gap: 12,
  },
  gpsCardWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    gap: 12,
  },
  gpsHeaderSuccess: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsSuccessBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  gpsValuesGrid: {
    backgroundColor: theme.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  gpsValueCol: {
    borderBottomWidth: 1,
    borderBottomColor: theme.slate100,
    paddingBottom: 6,
  },
  gpsValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gpsValueColHalf: {
    flex: 1,
  },
  gpsValueLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.slate500,
    letterSpacing: 0.5,
  },
  gpsValueMono: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.slate900,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  gpsValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.slate800,
    marginTop: 2,
  },
  gpsRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  gpsRefreshBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  gpsRetryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gpsRetryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  gpsIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.slate100,
  },
  gpsInfo: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.slate900,
  },
  gpsSubtitle: {
    fontSize: 12,
    color: theme.slate600,
    marginTop: 2,
  },

  // Subzone Trigger Card Styles
  subzoneSectionContainer: {
    marginTop: 20,
  },
  subzoneSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subzoneOptionalBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primary,
    backgroundColor: theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  subzoneEmptyHint: {
    backgroundColor: theme.slate50,
    borderWidth: 1,
    borderColor: theme.slate200,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subzoneEmptyHintText: {
    fontSize: 13,
    color: theme.slate500,
    flex: 1,
    lineHeight: 18,
  },
  subzoneLoadingCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.slate200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subzoneLoadingText: {
    fontSize: 13,
    color: theme.slate500,
  },
  subzoneSelectedCard: {
    backgroundColor: theme.white,
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subzoneSelectTriggerCard: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.slate200,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subzoneIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subzoneIconBoxInactive: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subzoneCardInfo: {
    flex: 1,
  },
  subzoneCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.slate900,
  },
  subzoneSelectTriggerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.slate800,
  },
  subzoneSelectTriggerSubtitle: {
    fontSize: 12,
    color: theme.slate500,
    marginTop: 2,
  },
  subzoneBadgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  subzoneBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: theme.slate100,
  },
  subzoneBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.slate700,
  },
  subzoneBadgeFloor: {
    backgroundColor: '#EEF2FF',
  },
  subzoneBadgeFloorText: {
    color: '#4F46E5',
  },
  subzoneChangeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.primaryLight,
  },
  subzoneChangeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
  subzoneRemoveBtn: {
    padding: 6,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.slate200,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.slate900,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.slate500,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.slate100,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.slate900,
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.slate500,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.slate100,
    borderWidth: 1,
    borderColor: theme.slate200,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.slate700,
  },
  filterChipTextActive: {
    color: theme.white,
  },
  subzoneList: {
    flex: 1,
    marginVertical: 8,
  },
  subzoneListEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  subzoneListEmptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.slate700,
    marginTop: 6,
  },
  subzoneListEmptySubtext: {
    fontSize: 12,
    color: theme.slate500,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subzoneListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.slate200,
    marginBottom: 8,
    backgroundColor: theme.white,
    gap: 10,
  },
  subzoneListItemActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primaryLight,
  },
  subzoneListIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subzoneListIconActive: {
    backgroundColor: theme.white,
  },
  subzoneListContent: {
    flex: 1,
  },
  subzoneListName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.slate900,
  },
  subzoneListNameActive: {
    color: theme.primary,
    fontWeight: '700',
  },
  subzoneListMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  subzoneListType: {
    fontSize: 12,
    color: theme.slate500,
  },
  subzoneListDot: {
    fontSize: 12,
    color: theme.slate400,
  },
  subzoneListFloor: {
    fontSize: 12,
    color: theme.slate500,
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.slate100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalClearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.slate200,
  },
  modalClearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.slate700,
  },
});
