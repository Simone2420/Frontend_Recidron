# Frontend Recidron 🍃🚁

¡Bienvenido al repositorio del Frontend de **Recidron**! Esta es una aplicación móvil construida en **React Native** con **Expo**, diseñada para el monitoreo de zonas de reciclaje e integración con reportes de drones.

## 🚀 Características Principales

* **Autenticación de Usuarios:** Sistema de inicio de sesión y registro gestionado dinámicamente con Zustand.
* **Gestión de Reportes:** Creación y visualización de reportes (ej. materiales detectados, zonas activas).
* **Geolocalización Avanzada:** Integración con API nativa de GPS (`expo-location`) con seguimiento en tiempo real y alta precisión para la ubicación de los reportes.
* **Navegación Tab & Stack:** Enrutamiento ágil basado en el sistema de directorios y archivos de **Expo Router**.
* **Animaciones Fluidas:** Interfaces amigables con transiciones utilizando `react-native-reanimated`.
* **Roles de usuario:** Vistas de Home adaptadas para perfiles genéricos y de administrador.

## 🛠️ Tecnologías y Librerías (Tech Stack)

* **Framework Base:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
* **Navegación:** Expo Router
* **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
* **Animaciones:** React Native Reanimated
* **Geolocalización:** Expo Location (*Testeo únicamente en dispositivo nativo*)
* **Lenguaje:** TypeScript

## 📂 Estructura del Proyecto

El código está organizado en dos directorios principales:

* `app/`: Contiene todas las pantallas o vistas (Screens) y el enrutamiento de **Expo Router**.
  * `(auth)/`: Pantallas de inicio de sesión, registro y recuperación de contraseña.
  * `(tabs)/`: Vistas principales con navegación de barra inferior (Home, Perfil, Reportes).
* `src/`: Carpeta de recursos e implementaciones técnicas.
  * `components/`: Componentes de interfaz reutilizables (tarjetas, botones, etc).
  * `store/`: Estado global de la aplicación (ej. `AuthStore` para Zustand).
  * `services/`: Llamadas a la API y la conexión con el Backend (FastAPI).
  * `styles/`: Variables globales de diseño, colores y utilidades.
  * `hooks/` & `types/`: Custom hooks y definiciones de interfaces en TypeScript.

## ⚙️ Instalación y Configuración

**1. Clonar el repositorio:**
```bash
git clone https://github.com/Simone2420/Frontend_Recidron.git
```

**2. Ingresar al directorio del proyecto:**
```bash
cd Frontend_Recidron
```

**3. Instalar las dependencias:**
```bash
npm install
```

## 🏃 Ejecutando el Proyecto

Inicia el entorno de desarrollo y abre la app escaneando el código QR en la aplicación **Expo Go** en Android/iOS o ejecutando un emulador.

```bash
npx expo start
```

> ⚠️ **Nota importante sobre el GPS / Native Maps:**
> Las pantallas de testeo de locación (como `app/test-location.tsx`) requieren características de **GPS nativo**. No funcionarán adecuadamente ejecutando el servidor en formato Web (`--web`), por lo que su testeo **debe realizarse estricta y únicamente sobre un dispositivo móvil físico** o emulador nativo configurado con acceso de ubicación.