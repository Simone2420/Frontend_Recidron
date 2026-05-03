import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/store/authStore';
import { useTheme } from '../../src/styles/theme';

const CustomCreateButton = ({ onPress }: any) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme.primary,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <MaterialIcons name="add" size={32} color={theme.white} />
      </View>
    </TouchableOpacity>
  );
};

export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.slate400,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.slate200,
          backgroundColor: theme.white,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="user-home"
        options={{
          title: 'Inicio',
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="admin-home"
        options={{
          title: 'Panel',
          href: !isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-report-dummy"
        options={isAdmin ? { href: null } : {
          title: '',
          tabBarButton: (props) => (
            <CustomCreateButton {...props} onPress={() => router.push('/new-report')} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}