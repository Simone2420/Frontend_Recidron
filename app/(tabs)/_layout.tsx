import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/store/authStore';
import { Colors } from '../../src/styles/colors';

const CustomCreateButton = ({ onPress }: any) => (
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
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <MaterialIcons name="add" size={32} color={Colors.white} />
    </View>
  </TouchableOpacity>
);

export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slate400,
        tabBarStyle: {
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
        name="create-report-dummy"
        options={isAdmin ? { href: null } : {
          title: '',
          tabBarButton: (props) => (
            <CustomCreateButton {...props} onPress={() => router.push('/new-report')} />
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
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}