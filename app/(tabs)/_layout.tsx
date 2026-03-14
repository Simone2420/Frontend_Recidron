import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="user-home" options={{ href: null }} />
      <Tabs.Screen name="admin-home" options={{ href: null }} />
    </Tabs>
  );
}
