# Documentación Técnica Detallada: Frontend (Expo, Zustand & Navigation)

## 1. Autenticación JWT y Flujo de Credenciales

La arquitectura de seguridad del frontend se basa en un esquema de **Bearer Token**. El flujo comienza en la interfaz de usuario y termina con la persistencia del secreto en el hardware del dispositivo.

### Flujo de Envío y Recepción
Cuando el usuario interactúa con `LoginScreen`, los datos se procesan a través del servicio de autenticación.

**Implementación del Servicio (`src/services/auth_service.ts`):**
```typescript
export const authService = {
  login: async (email: string, password: string) => {
    // El backend recibe un JSON directamente
    const response = await api.post('/usuarios/login', {
      email,
      password,
    });
    return response.data;
  },
};
```

**Ejemplo de Salida del Backend (JSON):**
```json
{
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@unicundinamarca.edu.co",
  "rol_id": 1,
  "rol": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Zustand & Persistencia: Gestión del Estado Global

Para la gestión del estado, se utiliza **Zustand**, una librería reactiva. La persistencia se logra mediante `expo-secure-store`, que cifra los datos en el dispositivo.

### Configuración del Store (`src/store/authStore.ts`)
El store mapea el rol del usuario basándose tanto en el nombre del rol como en su ID.

```typescript
export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      // Lógica de determinación de rol basada en el código real:
      const esAdmin = data.rol === 'admin' || data.rol_id === 1;
      const role: Role = esAdmin ? 'admin' : 'user';

      const userData: AuthUser = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role,
        rol_id: data.rol_id,
        token: data.token
      };

      if (data.token) {
        await SecureStore.setItemAsync('user_token', data.token);
      }

      set({ user: userData });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail };
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('user_token');
    set({ user: null });
  },
}));
```

---

## 3. Navegación y Guards: Protección de Vistas

La protección de rutas se maneja mediante lógica condicional en los Layouts de **Expo Router**.

### Implementación en Tabs (`app/(tabs)/_layout.tsx`)
Se utiliza el estado global para habilitar o deshabilitar dinámicamente las rutas.

```tsx
export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs>
      <Tabs.Screen
        name="user-home"
        options={{
          title: 'Inicio',
          href: isAdmin ? null : undefined, // Ocultar si es admin
        }}
      />
      
      <Tabs.Screen
        name="admin-home"
        options={{
          title: 'Panel',
          href: !isAdmin ? null : undefined, // Ocultar si NO es admin
        }}
      />
    </Tabs>
  );
}
```

---

## 4. Ciclo de Vida del Token

El token es gestionado por un interceptor de **Axios**, garantizando que cada petición saliente incluya las credenciales necesarias.

### Interceptor de Peticiones (`src/services/base_service.ts`)
```typescript
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return config;
  }
});
```

### Manejo de Expiración
Cuando el backend detecta un token inválido o expirado, retorna un estado **401 (Unauthorized)**. En el frontend, el flujo de autenticación está diseñado para que, al detectar la ausencia de una sesión válida, el componente `index.tsx` redirija automáticamente al login:

```tsx
// app/index.tsx
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
```
