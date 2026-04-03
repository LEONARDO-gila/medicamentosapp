import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2196F3',  // ← Azul claro (antes #2E7D32)
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#2196F3' },  // ← Azul claro
        headerTintColor: '#fff',
      }}
    >
      {/* Resto igual */}
      <Tabs.Screen name="hospital" options={{ title: 'Uso Hospitalario', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hospital-building" size={24} color={color} /> }} />
      <Tabs.Screen name="cotidiano" options={{ title: 'Uso Cotidiano', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="primeros" options={{ title: 'Primeros Auxilios', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="first-aid-kit" size={24} color={color} /> }} />
      <Tabs.Screen name="enfermedades" options={{ title: 'Enfermedades Crónicas', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="virus" size={24} color={color} /> }} />
    </Tabs>
  );
}