import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Polygon,
  Path,
  G,
  Text as SvgText,
} from 'react-native-svg';

interface IllustrationProps {
  width?: number;
  height?: number;
}

/**
 * Ilustración 1: Campus Universitario Sostenible (MEDIT)
 * Representa el campus de Girardot con arquitectura moderna, paneles solares, áreas verdes y conectividad.
 */
export function CampusEcoIllustration({ width = 280, height = 200 }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 200" fill="none">
      <Defs>
        <LinearGradient id="buildingGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
        </LinearGradient>
        <LinearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
          <Stop offset="100%" stopColor="#065f46" stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#064e3b" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="solarGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#38bdf8" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
      </Defs>

      {/* Terreno Isométrico */}
      <Polygon points="140,20 260,85 140,150 20,85" fill="url(#groundGrad)" />
      
      {/* Camellón y senderos peatonales */}
      <Polygon points="140,40 180,62 140,84 100,62" fill="#047857" opacity="0.4" />
      <Polygon points="140,84 200,117 175,130 115,97" fill="#065f46" opacity="0.3" />

      {/* Edificio Central Izquierdo (Bloque Académico) */}
      <G transform="translate(60, 30)">
        {/* Fachada Izquierda */}
        <Polygon points="0,50 45,75 45,115 0,90" fill="#047857" />
        {/* Fachada Derecha */}
        <Polygon points="45,75 90,50 90,90 45,115" fill="#10b981" />
        {/* Techo */}
        <Polygon points="45,35 90,50 45,75 0,50" fill="url(#buildingGrad)" />
        {/* Ventanales fachada derecha */}
        <Polygon points="52,72 82,55 82,68 52,85" fill="url(#glassGrad)" />
        <Polygon points="52,90 82,73 82,86 52,103" fill="url(#glassGrad)" />
        {/* Paneles Solares en el techo */}
        <Polygon points="25,48 45,58 40,64 20,54" fill="url(#solarGrad)" />
        <Polygon points="48,52 68,42 72,46 52,56" fill="url(#solarGrad)" />
      </G>

      {/* Edificio Secundario Derecho (Biblioteca / Hub Digital) */}
      <G transform="translate(140, 50)">
        <Polygon points="0,40 40,62 40,95 0,73" fill="#065f46" />
        <Polygon points="40,62 80,40 80,73 40,95" fill="#059669" />
        <Polygon points="40,28 80,40 40,62 0,40" fill="#34d399" />
        {/* Ventanales */}
        <Polygon points="46,58 74,43 74,53 46,68" fill="#a7f3d0" opacity="0.8" />
        <Polygon points="46,73 74,58 74,68 46,83" fill="#a7f3d0" opacity="0.8" />
      </G>

      {/* Árboles Isométricos de la Seccional Girardot */}
      <G transform="translate(45, 95)">
        <Rect x="13" y="18" width="4" height="12" fill="#78350f" />
        <Circle cx="15" cy="14" r="14" fill="#10b981" />
        <Circle cx="12" cy="10" r="10" fill="#34d399" />
      </G>
      <G transform="translate(200, 75)">
        <Rect x="13" y="18" width="4" height="12" fill="#78350f" />
        <Circle cx="15" cy="14" r="13" fill="#059669" />
        <Circle cx="12" cy="10" r="9" fill="#10b981" />
      </G>
      <G transform="translate(125, 125)">
        <Rect x="10" y="14" width="3" height="8" fill="#78350f" />
        <Circle cx="11" cy="10" r="10" fill="#34d399" />
      </G>

      {/* Señalética / Mini Punto Ecológico */}
      <G transform="translate(170, 115)">
        <Rect x="0" y="0" width="8" height="12" rx="2" fill="#10b981" />
        <Rect x="10" y="0" width="8" height="12" rx="2" fill="#3b82f6" />
        <Rect x="20" y="0" width="8" height="12" rx="2" fill="#1e293b" />
      </G>
    </Svg>
  );
}

/**
 * Ilustración 2: Reporte con Cámara y Detección de Desechos
 * Representa el smartphone capturando un residuo con visor de cámara, láser de detección y clasificación.
 */
export function CameraReportIllustration({ width = 280, height = 200 }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 200" fill="none">
      <Defs>
        <LinearGradient id="phoneBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#1e293b" />
          <Stop offset="100%" stopColor="#0f172a" />
        </LinearGradient>
        <LinearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#042f2e" />
          <Stop offset="100%" stopColor="#021c17" />
        </LinearGradient>
        <LinearGradient id="laserGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
        </LinearGradient>
      </Defs>

      {/* Sombra base */}
      <Polygon points="140,155 240,175 140,195 40,175" fill="#022c22" opacity="0.6" />

      {/* Smartphone Isométrico en perspectiva */}
      <G transform="translate(65, 10)">
        {/* Cuerpo del teléfono */}
        <Polygon points="75,0 150,42 75,170 0,128" fill="url(#phoneBodyGrad)" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Borde biselado */}
        <Polygon points="0,128 75,170 75,176 0,134" fill="#0f172a" />
        <Polygon points="75,170 150,42 150,48 75,176" fill="#334155" />
        {/* Pantalla del teléfono */}
        <Polygon points="75,12 140,48 75,158 10,122" fill="url(#screenGrad)" />
        
        {/* Retícula de Enfoque de Cámara */}
        <G transform="translate(40, 55)">
          <Path d="M 15 15 L 25 15 M 15 15 L 15 25" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 55 15 L 45 15 M 55 15 L 55 25" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 15 55 L 25 55 M 15 55 L 15 45" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 55 55 L 45 55 M 55 55 L 55 45" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Mira central */}
          <Circle cx="35" cy="35" r="8" stroke="#10b981" strokeWidth="1.5" fill="none" />
          <Circle cx="35" cy="35" r="2" fill="#10b981" />
        </G>

        {/* Botón de Disparo Cámara */}
        <Circle cx="75" cy="142" r="10" fill="#ffffff" opacity="0.9" />
        <Circle cx="75" cy="142" r="8" fill="#10b981" />
      </G>

      {/* Residuo Detectado (Botella plástica isométrica flotante) */}
      <G transform="translate(170, 80)">
        <Polygon points="20,0 35,8 20,45 5,37" fill="#67e8f9" opacity="0.85" />
        <Polygon points="35,8 45,3 30,40 20,45" fill="#38bdf8" opacity="0.85" />
        <Polygon points="20,0 28, -5 35,8 20,0" fill="#bae6fd" />
        <Rect x="23" y="-9" width="7" height="5" fill="#0284c7" rx="1" />
        
        {/* Cono / Haz de escaneo láser */}
        <Polygon points="20,-5 80,-30 80,50 20,45" fill="url(#laserGrad)" opacity="0.4" />
      </G>

      {/* Tags de clasificación de residuo flotantes */}
      <G transform="translate(180, 40)">
        <Rect x="0" y="0" width="70" height="22" rx="11" fill="#10b981" />
        <SvgText x="35" y="15" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          Plástico
        </SvgText>
      </G>
      <G transform="translate(30, 95)">
        <Rect x="0" y="0" width="65" height="22" rx="11" fill="#0284c7" />
        <SvgText x="32" y="15" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          Mediano
        </SvgText>
      </G>
    </Svg>
  );
}

/**
 * Ilustración 3: Mapa 3D del Campus y Georreferenciación
 * Representa la maqueta tridimensional del campus universitario con edificios identificados y pines de ubicación.
 */
export function CampusMapIllustration({ width = 280, height = 200 }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 200" fill="none">
      <Defs>
        <LinearGradient id="mapGridGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#047857" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
        </LinearGradient>
        <LinearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#38bdf8" />
          <Stop offset="100%" stopColor="#0284c7" />
        </LinearGradient>
      </Defs>

      {/* Plataforma base del mapa isométrico */}
      <Polygon points="140,15 265,85 140,155 15,85" fill="url(#mapGridGrad)" stroke="#10b981" strokeWidth="1" />
      <Polygon points="15,85 140,155 140,165 15,95" fill="#022c22" />
      <Polygon points="140,155 265,85 265,95 140,165" fill="#011b15" />

      {/* Red de Vías y Senderos Internos */}
      <Path d="M 60 70 L 140 115 L 220 70 M 140 30 L 140 115 M 100 92 L 180 50" stroke="#34d399" strokeWidth="3" opacity="0.5" strokeDasharray="4 2" />

      {/* Edificio Bloque A (Izquierda) */}
      <G transform="translate(50, 45)">
        <Polygon points="0,20 30,37 30,62 0,45" fill="#047857" />
        <Polygon points="30,37 60,20 60,45 30,62" fill="#10b981" />
        <Polygon points="30,5 60,20 30,37 0,20" fill="#34d399" />
        <SvgText x="30" y="32" fill="#064e3b" fontSize="8" fontWeight="bold" textAnchor="middle">
          BLQ A
        </SvgText>
      </G>

      {/* Edificio Biblioteca (Centro-Fondo) */}
      <G transform="translate(110, 15)">
        <Polygon points="0,25 30,42 30,67 0,50" fill="#0f766e" />
        <Polygon points="30,42 60,25 60,50 30,67" fill="#14b8a6" />
        <Polygon points="30,10 60,25 30,42 0,25" fill="#5eead4" />
        <SvgText x="30" y="35" fill="#042f2e" fontSize="7" fontWeight="bold" textAnchor="middle">
          BIBLIO
        </SvgText>
      </G>

      {/* Edificio Cafetería Central (Derecha - Zona Crítica) */}
      <G transform="translate(170, 45)">
        <Polygon points="0,22 35,42 35,67 0,47" fill="#047857" />
        <Polygon points="35,42 70,22 70,47 35,67" fill="#10b981" />
        <Polygon points="35,5 70,22 35,42 0,22" fill="#6ee7b7" />
        <SvgText x="35" y="32" fill="#064e3b" fontSize="7" fontWeight="bold" textAnchor="middle">
          CAFETERÍA
        </SvgText>
      </G>

      {/* Pin 3D Gigante en Cafetería (Reporte Activo) */}
      <G transform="translate(195, 30)">
        {/* Sombra del Pin */}
        <Circle cx="10" cy="55" r="8" fill="#022c22" opacity="0.6" />
        {/* Cuerpo del Pin */}
        <Path d="M 10 10 C 2 10, 0 18, 10 38 C 20 18, 18 10, 10 10 Z" fill="url(#pinGrad)" stroke="#ffffff" strokeWidth="1.5" />
        <Circle cx="10" cy="18" r="4" fill="#ffffff" />
      </G>

      {/* Pin Secundario en Bloque A */}
      <G transform="translate(70, 35)">
        <Path d="M 10 10 C 4 10, 2 16, 10 30 C 18 16, 16 10, 10 10 Z" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
        <Circle cx="10" cy="16" r="3" fill="#ffffff" />
      </G>

      {/* Mini árboles dispersos */}
      <Circle cx="100" cy="115" r="8" fill="#10b981" />
      <Circle cx="155" cy="125" r="9" fill="#059669" />
      <Circle cx="170" cy="100" r="7" fill="#34d399" />
    </Svg>
  );
}

/**
 * Ilustración 4: Analítica de Residuos, Clima y Toma de Decisiones
 * Representa la pantalla de visualización de datos con gráficas de barras, sensor de temperatura y reducción de contaminación.
 */
export function DataAnalyticsIllustration({ width = 280, height = 200 }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 200" fill="none">
      <Defs>
        <LinearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
          <Stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
        </LinearGradient>
        <LinearGradient id="barGrad1" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#6ee7b7" />
        </LinearGradient>
        <LinearGradient id="barGrad2" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#f59e0b" />
          <Stop offset="100%" stopColor="#fde68a" />
        </LinearGradient>
      </Defs>

      {/* Tablero Isométrico de Monitoreo */}
      <G transform="translate(40, 15)">
        {/* Marco del Tablero Digital */}
        <Polygon points="100,0 200,55 100,165 0,110" fill="url(#panelGrad)" stroke="#10b981" strokeWidth="1.5" />
        <Polygon points="0,110 100,165 100,172 0,117" fill="#021c17" />
        <Polygon points="100,165 200,55 200,62 100,172" fill="#0f172a" />

        {/* Gráfica de Barras Tridimensionales en el Tablero */}
        {/* Barra 1 */}
        <G transform="translate(45, 80)">
          <Polygon points="0,10 10,15 10,-25 0,-30" fill="#059669" />
          <Polygon points="10,15 20,10 20,-30 10,-25" fill="#10b981" />
          <Polygon points="10,-25 20,-30 10,-35 0,-30" fill="#34d399" />
        </G>
        {/* Barra 2 (Más alta) */}
        <G transform="translate(75, 65)">
          <Polygon points="0,10 10,15 10,-45 0,-50" fill="#d97706" />
          <Polygon points="10,15 20,10 20,-50 10,-45" fill="#f59e0b" />
          <Polygon points="10,-45 20,-50 10,-55 0,-50" fill="#fde68a" />
        </G>
        {/* Barra 3 */}
        <G transform="translate(105, 50)">
          <Polygon points="0,10 10,15 10,-20 0,-25" fill="#0284c7" />
          <Polygon points="10,15 20,10 20,-25 10,-20" fill="#38bdf8" />
          <Polygon points="10,-20 20,-25 10,-30 0,-25" fill="#bae6fd" />
        </G>

        {/* Línea de Tendencia Ascendente */}
        <Path d="M 35 70 L 65 45 L 95 25 L 135 15" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Circle cx="35" cy="70" r="3" fill="#ffffff" />
        <Circle cx="65" cy="45" r="3" fill="#ffffff" />
        <Circle cx="95" cy="25" r="3" fill="#ffffff" />
        <Circle cx="135" cy="15" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      </G>

      {/* Mini Widget Flotante de Clima / Temperatura de Girardot */}
      <G transform="translate(165, 95)">
        <Rect x="0" y="0" width="85" height="42" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <Circle cx="20" cy="21" r="10" fill="#f59e0b" opacity="0.2" />
        <SvgText x="20" y="25" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
          ☀️
        </SvgText>
        <SvgText x="52" y="18" fill="#fde68a" fontSize="12" fontWeight="bold">
          33°C
        </SvgText>
        <SvgText x="40" y="32" fill="#94a3b8" fontSize="8">
          Girardot
        </SvgText>
      </G>

      {/* Mini Widget de Eficacia / Reportes Resueltos */}
      <G transform="translate(30, 130)">
        <Rect x="0" y="0" width="90" height="36" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <SvgText x="15" y="22" fill="#34d399" fontSize="14" fontWeight="bold">
          ✓
        </SvgText>
        <SvgText x="55" y="17" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
          94.9%
        </SvgText>
        <SvgText x="55" y="29" fill="#a7f3d0" fontSize="8" textAnchor="middle">
          Eficacia
        </SvgText>
      </G>
    </Svg>
  );
}
