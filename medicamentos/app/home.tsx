import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Text, Avatar, Button, Divider, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categorias = [
  { 
    id: 1, 
    nombre: 'Uso Hospitalario', 
    icono: 'hospital-building', 
    color: '#1B5E20', 
    bgColor: '#E8F5E9',
    ruta: '/(tabs)/hospital',
    descripcion: 'Medicamentos bajo supervisión médica'
  },
  { 
    id: 2, 
    nombre: 'Uso Cotidiano', 
    icono: 'home', 
    color: '#E65100', 
    bgColor: '#FFF3E0',
    ruta: '/(tabs)/cotidiano',
    descripcion: 'Para dolencias y síntomas diarios'
  },
  { 
    id: 3, 
    nombre: 'Primeros Auxilios', 
    icono: 'first-aid-kit', 
    color: '#C62828', 
    bgColor: '#FFEBEE',
    ruta: '/(tabs)/primeros',
    descripcion: 'Botiquín de emergencia'
  },
  { 
    id: 4, 
    nombre: 'Enfermedades Crónicas', 
    icono: 'virus', 
    color: '#1565C0', 
    bgColor: '#E3F2FD',
    ruta: '/(tabs)/enfermedades',
    descripcion: 'Tratamiento a largo plazo'
  }
];

export default function HomeScreen() {
  const [medico, setMedico] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    const sesion = await AsyncStorage.getItem('sesion_activa');
    if (sesion) {
      setMedico(JSON.parse(sesion));
    }
  };

 const cerrarSesion = async () => {
  await AsyncStorage.removeItem('sesion_activa');
  router.replace('/');  // ← Cambia '/index' por '/'
};

  return (
    <ScrollView style={styles.container}>
      {/* Header con info del médico en esquina superior izquierda */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.perfilButton}>
                <Avatar.Icon 
                  icon="doctor" 
                  size={45} 
                  style={{ backgroundColor: '#2E7D32' }} 
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={cerrarSesion} title="Cerrar Sesión" leadingIcon="logout" />
          </Menu>
          <View style={styles.infoMedico}>
            <Text variant="titleSmall" style={styles.nombreMedico}>
              {medico?.nombre || 'Cargando...'}
            </Text>
            <Text variant="bodySmall" style={styles.matriculaMedico}>
              Matrícula: {medico?.matricula || ''}
            </Text>
          </View>
        </View>
        <Image 
          source={{ uri: 'https://img.icons8.com/color/96/000000/medical-doctor.png' }}
          style={styles.logo}
        />
      </View>

      <Text variant="bodyMedium" style={styles.subtitleHeader}>
        Información completa sobre medicamentos organizados por categorías de uso.
        Consulta descripciones, indicaciones, dosis y precauciones.
      </Text>

      {/* Categorías */}
      <Text variant="titleLarge" style={styles.sectionTitle}>Categorías de Medicamentos</Text>
      
      <View style={styles.grid}>
        {categorias.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.card, { backgroundColor: cat.bgColor }]}
            onPress={() => router.push(cat.ruta as any)}
          >
            <Avatar.Icon 
              icon={cat.icono} 
              size={50} 
              style={{ backgroundColor: cat.color }} 
              color="#fff"
            />
            <Text variant="titleMedium" style={[styles.cardTitle, { color: cat.color }]}>
              {cat.nombre}
            </Text>
            <Text variant="bodySmall" style={styles.cardDesc}>
              {cat.descripcion}
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => router.push(cat.ruta as any)}
              textColor={cat.color}
              style={styles.cardButton}
            >
              Ver más →
            </Button>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilButton: {
    marginRight: 12,
  },
  infoMedico: {
    justifyContent: 'center',
  },
  nombreMedico: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  matriculaMedico: {
    color: '#666',
    fontSize: 11,
  },
  logo: { 
    width: 45, 
    height: 45, 
  },
  subtitleHeader: { 
    marginHorizontal: 16, 
    marginTop: 12, 
    marginBottom: 8, 
    color: '#666', 
    fontSize: 13,
    textAlign: 'center',
  },
  sectionTitle: { 
    margin: 16, 
    marginBottom: 8, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 12 
  },
  card: { 
    width: '48%', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { 
    marginTop: 12, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  cardDesc: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 4, 
    fontSize: 11 
  },
  cardButton: { 
    marginTop: 12, 
    borderRadius: 20 
  },
});