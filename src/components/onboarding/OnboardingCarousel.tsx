import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CampusEcoIllustration,
  CameraReportIllustration,
  CampusMapIllustration,
  DataAnalyticsIllustration,
} from './OnboardingIllustrations';

export interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface SlideItem {
  id: string;
  badge: string;
  badgeIcon: keyof typeof MaterialIcons.glyphMap;
  chips: [string, string];
  title: string;
  highlightWord: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  renderIllustration: (width: number, height: number) => React.ReactNode;
}

const SLIDES: SlideItem[] = [
  {
    id: '1',
    badge: 'CAMPUS SOSTENIBLE · MEDIT',
    badgeIcon: 'eco',
    chips: ['🏢 Campus Girardot', '♻️ Separación en la Fuente'],
    title: 'Transforma el campus con cada reporte',
    highlightWord: 'cada reporte',
    description:
      'Forma parte activa de la gestión ambiental de la Universidad de Cundinamarca. Tu aporte promueve una cultura ecológica y espacios más limpios y seguros.',
    icon: 'eco',
    renderIllustration: (w, h) => <CampusEcoIllustration width={w} height={h} />,
  },
  {
    id: '2',
    badge: 'REPORTE COLABORATIVO',
    badgeIcon: 'photo-camera',
    chips: ['⚡ Reporte en <60s', '📷 Evidencia Fotográfica'],
    title: 'Captura y clasifica en segundos',
    highlightWord: 'en segundos',
    description:
      'Detecta residuos o puntos saturados, toma una foto y clasifícalo según el código de colores nacional. El equipo de servicios generales atenderá la novedad de inmediato.',
    icon: 'photo-camera',
    renderIllustration: (w, h) => <CameraReportIllustration width={w} height={h} />,
  },
  {
    id: '3',
    badge: 'GEOLOCALIZACIÓN Y ESPACIOS',
    badgeIcon: 'location-on',
    chips: ['🗺️ Bloques A, B y Cafetería', '📌 Ubicación por Piso'],
    title: 'Mapeo inteligente del campus',
    highlightWord: 'inteligente',
    description:
      'Ubica y consulta en tiempo real los contenedores y reportes por bloque, piso y zona. Visualización estratégica para evitar acumulaciones en horas pico.',
    icon: 'location-on',
    renderIllustration: (w, h) => <CampusMapIllustration width={w} height={h} />,
  },
  {
    id: '4',
    badge: 'DECISIÓN BASADA EN DATOS',
    badgeIcon: 'insights',
    chips: ['🌡️ Clima Girardot >33°C', '📈 Métricas en Tiempo Real'],
    title: 'Impacto ambiental medible y real',
    highlightWord: 'medible y real',
    description:
      'Las altas temperaturas de Girardot hacen crítica la recolección ágil de orgánicos. Generamos estadísticas para optimizar rutas de aseo y cuidar la salud colectiva.',
    icon: 'insights',
    renderIllustration: (w, h) => <DataAnalyticsIllustration width={w} height={h} />,
  },
];

export function OnboardingCarousel({ onComplete, onSkip }: OnboardingCarouselProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<SlideItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardWidth = Math.min(windowWidth - 36, 420);
  const illustrationWidth = Math.min(cardWidth - 40, 300);
  const illustrationHeight = Math.min(windowHeight * 0.26, 210);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / windowWidth);
    if (index >= 0 && index < SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const handleJumpToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const renderTitle = (title: string, highlight: string) => {
    if (!title.includes(highlight)) {
      return <Text style={styles.cardTitle}>{title}</Text>;
    }
    const parts = title.split(highlight);
    return (
      <Text style={styles.cardTitle}>
        {parts[0]}
        <Text style={styles.highlightText}>{highlight}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Círculos decorativos de fondo con efecto gradiente ambiental */}
      <View style={styles.ambientGlowTop} pointerEvents="none" />
      <View style={styles.ambientGlowBottom} pointerEvents="none" />

      {/* Barra Superior: Logo / Nombre Institucional y botón Saltar */}
      <View style={styles.topHeader}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="eco" size={18} color="#34d399" />
          </View>
          <View>
            <Text style={styles.brandTitle}>Recidron</Text>
            <Text style={styles.brandSubtitle}>UdeC Girardot · MEDIT</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityLabel="Saltar introducción"
          accessibilityRole="button"
        >
          <Text style={styles.skipButtonText}>Saltar</Text>
          <MaterialIcons name="chevron-right" size={18} color="#a7f3d0" />
        </TouchableOpacity>
      </View>

      {/* Carrusel Deslizable */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        contentContainerStyle={{ alignItems: 'center' }}
        renderItem={({ item }) => (
          <View style={[styles.slideWrapper, { width: windowWidth }]}>
            <View style={[styles.card, { width: cardWidth }]}>
              {/* Badge superior de categoría */}
              <View style={styles.categoryBadge}>
                <MaterialIcons name={item.badgeIcon} size={14} color="#34d399" />
                <Text style={styles.categoryBadgeText}>{item.badge}</Text>
              </View>

              {/* Área de Ilustración con Chips Flotantes */}
              <View style={styles.illustrationContainer}>
                {/* Chip Flotante Superior Izquierdo */}
                <View style={[styles.floatingChip, styles.floatingChipLeft]}>
                  <Text style={styles.floatingChipText}>{item.chips[0]}</Text>
                </View>

                {/* Ilustración Vectorial Isométrica */}
                <View style={styles.illustrationWrapper}>
                  {item.renderIllustration(illustrationWidth, illustrationHeight)}
                </View>

                {/* Chip Flotante Inferior Derecho */}
                <View style={[styles.floatingChip, styles.floatingChipRight]}>
                  <Text style={styles.floatingChipText}>{item.chips[1]}</Text>
                </View>
              </View>

              {/* Textos descriptivos */}
              <View style={styles.textContainer}>
                {renderTitle(item.title, item.highlightWord)}
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Barra Inferior de Navegación y Acciones */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: Math.max((windowWidth - cardWidth) / 2, 18),
          },
        ]}
      >
        {/* Cápsula de Indicadores de Icono Interactivas */}
        <View style={styles.indicatorCapsule}>
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <TouchableOpacity
                key={slide.id}
                onPress={() => handleJumpToIndex(idx)}
                activeOpacity={0.7}
                style={[
                  styles.indicatorTab,
                  isActive && styles.indicatorTabActive,
                ]}
                accessibilityLabel={`Ir a diapositiva ${idx + 1}`}
              >
                <MaterialIcons
                  name={slide.icon}
                  size={isActive ? 20 : 18}
                  color={isActive ? '#062d1d' : 'rgba(255, 255, 255, 0.45)'}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón Siguiente / Comenzar */}
        {currentIndex === SLIDES.length - 1 ? (
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={handleNext}
            accessibilityLabel="Comenzar"
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText} numberOfLines={1}>Comenzar</Text>
            <View style={styles.startArrowBadge}>
              <MaterialIcons name="arrow-forward" size={17} color="#052e16" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextCircleButton}
            activeOpacity={0.85}
            onPress={handleNext}
            accessibilityLabel="Siguiente diapositiva"
            accessibilityRole="button"
          >
            <MaterialIcons name="arrow-forward" size={22} color="#052e16" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051a12', // Verde oscuro profundo
    justifyContent: 'space-between',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#047857',
    opacity: 0.18,
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#065f46',
    opacity: 0.22,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#34d399',
    marginTop: -1,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginRight: 2,
  },
  slideWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  card: {
    backgroundColor: 'rgba(10, 36, 27, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6ee7b7',
    letterSpacing: 0.8,
  },
  illustrationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    minHeight: 190,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingChip: {
    position: 'absolute',
    backgroundColor: 'rgba(5, 26, 18, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingChipLeft: {
    top: 6,
    left: 4,
  },
  floatingChipRight: {
    bottom: 6,
    right: 4,
  },
  floatingChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d1fae5',
  },
  textContainer: {
    marginTop: 18,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 28,
    marginBottom: 8,
  },
  highlightText: {
    color: '#34d399',
  },
  cardDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#94a3b8',
    fontWeight: '400',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    gap: 12,
  },
  indicatorCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 38, 27, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 5,
    gap: 3,
  },
  indicatorTab: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorTabActive: {
    backgroundColor: '#34d399',
  },
  nextCircleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34d399',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34d399',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 8,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#052e16',
    letterSpacing: 0.2,
  },
  startArrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(5, 46, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
