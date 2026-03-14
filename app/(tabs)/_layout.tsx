import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slate400,
        tabBarStyle: isAdmin
          ? { display: 'none' }  // Admin no tiene tab bar
          : {
              borderTopWidth: 1,
              borderTopColor: Colors.slate200,
              backgroundColor: Colors.white,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      {/* ── Tabs de Usuario ── */}
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
        name="reports"
        options={{
          title: 'Reportes',
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="description" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />

      {/* ── Tab de Admin ── siempre oculto del tab bar, accesible por routing */}
      <Tabs.Screen
        name="admin-home"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}