# Frontend Recidron 🍃🚁

¡Bienvenido al repositorio del Frontend de **Recidron**! Esta es una aplicación móvil robusta y moderna construida en **React Native** con **Expo** y **TypeScript**, diseñada para el monitoreo de zonas de reciclaje, reportes de residuos en el campus universitario e integración con sistemas de backend.

---

## 🚀 Características Principales

*   **Autenticación JWT Avanzada:** Sistema seguro de inicio de sesión, registro, recuperación y restablecimiento de contraseñas. Los datos de sesión y tokens de seguridad se guardan cifrados localmente a través de `SecureStore` (`expo-secure-store`).
*   **Interceptor de Peticiones (Axios):** Redirección automática en caso de sesiones expiradas (errores `401`) e inyección transparente del Bearer Token en todas las peticiones salientes.
*   **Asistente de Creación de Reportes (Wizard de 3 Pasos):**
    *   *Paso 1: Clasificación:* Selección dinámica del tipo de residuo (Aprovechable, Orgánico, Peligroso, No Aprovechable) y material asociado, con códigos de color visuales.
    *   *Paso 2: Ubicación:* Selección de la zona del campus y descripción detallada del punto exacto.
    *   *Paso 3: Evidencia:* Estimación del tamaño del residuo y captura de fotos mediante la cámara nativa del dispositivo (`expo-image-picker`).
*   **Búsqueda y Filtros de Reportes:** Filtro rápido por tipo de residuo, buscador de texto integrado y sección dedicada de *"Mis Reportes"* para los estudiantes, todo optimizado con paginación infinita (Infinite Scroll) en `FlatList`.
*   **Mapa Interactivo del Campus:** Ubicación visual de los reportes en tiempo real sobre un mapa estático del campus (`assets/images/campus_map.png`) usando coordenadas relativas y un sistema de dispersión controlada (*jitter*) para evitar la superposición de múltiples reportes en la misma área.
*   **Panel de Administración (Dashboard):**
    *   Métricas clave en tarjetas KPI (Total de reportes, usuarios activos).
    *   Gráficos dinámicos e interactivos construidos nativamente con **`react-native-svg`**:
        *   **Donut Chart** (Gráfico de Rosquilla) para la distribución por tipo de residuo.
        *   **Bar Chart** (Gráfico de Barras) para reportes por zona.
        *   **Line Chart** (Gráfico de Línea) para tendencias de reportes en los últimos 30 días.
        *   **Horizontal Bars** (Barras Horizontales) para materiales más comunes.
*   **Exportación de Reportes a PDF:** Los administradores pueden descargar reportes consolidados en formato PDF directamente desde el backend y compartirlos localmente usando las utilidades nativas del sistema (`expo-sharing`).
*   **Gestión Administrativa de Usuarios:**
    *   Búsqueda y visualización de perfiles.
    *   Activación y desactivación de cuentas en tiempo real.
    *   Modificación de información de usuario y contraseñas.
    *   Ascenso o revocación del rol de administrador (protegiendo siempre la cuenta del administrador maestro).

---

## 🛠️ Tecnologías y Librerías (Tech Stack)

*   **Framework Base:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 54)
*   **Navegación:** Expo Router (Enrutamiento basado en archivos)
*   **Gestión de Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
*   **Cliente HTTP:** Axios con interceptores de seguridad
*   **Gráficos Nativos:** `react-native-svg`
*   **Almacenamiento Seguro:** `expo-secure-store`
*   **Multimedia:** `expo-image-picker` y `expo-image`
*   **Animaciones:** `react-native-reanimated`
*   **Notificaciones:** `react-native-toast-message`
*   **Tipografía e Interfaz:** Soporte nativo para TypeScript

---

## 📂 Estructura del Proyecto

El código está organizado de la siguiente manera:

```text
├── app/                              # Rutas y Pantallas (Expo Router)
│   ├── (auth)/                       # Flujo de autenticación
│   │   ├── _layout.tsx
│   │   ├── forgot-password.tsx       # Recuperación de contraseña
│   │   ├── login.tsx                 # Inicio de sesión
│   │   ├── register.tsx              # Registro de nuevos usuarios
│   │   └── reset-password.tsx        # Restablecimiento de contraseña
│   ├── (tabs)/                       # Vistas principales de navegación
│   │   ├── _layout.tsx               # Control de accesos según rol
│   │   ├── admin-home.tsx            # Dashboard de administrador (Gráficos)
│   │   ├── user-home.tsx             # Inicio para estudiantes
│   │   ├── reports.tsx               # Historial de reportes y exportación
│   │   ├── profile.tsx               # Perfil del usuario autenticado
│   │   └── settings.tsx              # Configuración de la aplicación
│   ├── _layout.tsx                   # Layout principal y Providers globales
│   ├── index.tsx                     # Redirección inicial
│   ├── admin-users.tsx               # Gestión y CRUD de usuarios
│   ├── campus-map.tsx                # Mapa interactivo con jitter
│   ├── new-report.tsx                # Formulario interactivo de 3 pasos
│   └── report-detail.tsx             # Detalle y fotografía del reporte
│
└── src/                              # Lógica de negocio y utilidades
    ├── components/                   # Componentes de UI reutilizables
    │   ├── cards/                    # Tarjetas custom (ReportCard, StatCard, etc.)
    │   └── ui/                       # Botones, campos de entrada, badges y modales
    ├── services/                     # Consumo de API (Axios)
    │   ├── base_service.ts           # Configuración de Axios e interceptor Bearer Token
    │   ├── auth_service.ts           # Peticiones de inicio de sesión/registro
    │   ├── user_service.ts           # Gestión de usuarios y perfiles
    │   ├── waste_service.ts          # Creación, lectura de reportes y descargas PDF
    │   └── stats_service.ts          # Estadísticas del dashboard de administración
    ├── store/                        # Estado global de la aplicación
    │   └── authStore.ts              # Control de sesión y almacenamiento seguro con Zustand
    ├── styles/                       # Sistema de diseño de la aplicación
    │   ├── ThemeProvider.tsx         # Contexto de modo claro y oscuro
    │   ├── theme.ts                  # Estructura del tema y colores base
    │   └── colors.ts                 # Paleta de colores para tipos de residuos
    ├── hooks/                        # Custom hooks reutilizables
    └── types/                        # Tipos e interfaces de TypeScript
```

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto localmente:

**1. Clonar el repositorio:**
```bash
git clone https://github.com/Simone2420/Frontend_Recidron.git
cd Frontend_Recidron
```

**2. Instalar las dependencias del proyecto:**
```bash
npm install
```

**3. Configurar variables de entorno (Opcional):**
Asegúrate de que la URL base en tu cliente de Axios (`src/services/base_service.ts`) apunte correctamente a la dirección IP de tu servidor backend de FastAPI en desarrollo (ej. `http://tu-ip-local:8000/` o la del render `https://recidron-backend-proyecto.onrender.com/`).

---

## 🏃 Ejecutando el Proyecto

Inicia el servidor de desarrollo de Expo ejecutando el siguiente comando:

```bash
npx expo start
```

### 📱 Visualización en dispositivos:
*   **Dispositivo Físico:** Descarga la aplicación **Expo Go** en tu smartphone (Android o iOS) y escanea el código QR que se visualiza en la terminal.
*   **Emulador iOS/Android:** Presiona `i` para iniciar el simulador de iOS (requiere macOS y Xcode) o `a` para iniciar el emulador de Android (requiere Android Studio y un dispositivo virtual configurado).

> ⚠️ **Notas Importantes:**
> 1. Las herramientas de cámara nativa (`expo-image-picker`) y descarga/compartición de archivos (`expo-file-system`, `expo-sharing`) requieren ser testeadas en emuladores completos o dispositivos físicos utilizando **Expo Go**.
> 2. Asegúrate de que el backend de FastAPI esté en ejecución y sea accesible desde la misma red local en la que está conectado tu dispositivo móvil para evitar problemas de conexión.