import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { getMedicamentoById } from './database/db';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [medicamento, setMedicamento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getMedicamentoById(Number(id));
    if (data.length > 0) setMedicamento(data[0]);
    setLoading(false);
  }, [id]);

  if (loading) return <ActivityIndicator animating={true} style={styles.loader} />;
  if (!medicamento) return <Text style={styles.errorText}>No encontrado</Text>;

  // Parsear los datos si vienen en formato especial
  const usos = medicamento.usos ? medicamento.usos.split('|') : [medicamento.uso];
  const enfermedades = medicamento.enfermedades ? medicamento.enfermedades.split('|') : [medicamento.enfermedades];
  const efectos = medicamento.efectos ? medicamento.efectos.split('|') : ['Náuseas', 'Dolor de cabeza', 'Mareos'];
  const contraindicaciones = medicamento.contraindicaciones ? medicamento.contraindicaciones.split('|') : ['Hipersensibilidad', 'Embarazo', 'Insuficiencia hepática'];

  return (
    <ScrollView style={styles.container}>
      {/* Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver a {medicamento.categoria === 'hospital' ? 'Uso Hospitalario' : medicamento.categoria === 'cotidiano' ? 'Uso Cotidiano' : medicamento.categoria === 'primeros' ? 'Primeros Auxilios' : 'Enfermedades Crónicas'}</Text>
      </TouchableOpacity>

      {/* Título del Medicamento */}
      <Card style={styles.titleCard}>
        <Card.Content>
          <Text style={styles.nombreGenerico}>Nombre genérico: {medicamento.nombre}</Text>
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaTexto}>
              {medicamento.categoria === 'hospital' ? '🏥 Uso Hospitalario' : 
               medicamento.categoria === 'cotidiano' ? '🏠 Uso Cotidiano' :
               medicamento.categoria === 'primeros' ? '🚑 Primeros Auxilios' : '🦠 Enfermedades Crónicas'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Advertencias Importantes */}
      <Card style={[styles.card, styles.advertenciaCard]}>
        <Card.Content>
          <Text style={styles.advertenciaTitulo}>⚠️ Advertencias Importantes</Text>
          <Text style={styles.advertenciaTexto}>
            {medicamento.advertencia || 'Uso exclusivo bajo supervisión médica. No automedicarse.'}
          </Text>
        </Card.Content>
      </Card>

      {/* Usos e Indicaciones */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📋 Usos e Indicaciones</Text>
          {usos.map((uso: string, index: number) => (
            <Text key={index} style={styles.listItem}>{index + 1}. {uso}</Text>
          ))}
        </Card.Content>
      </Card>

      {/* Dosificación */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>💊 Dosificación</Text>
          <Text style={styles.text}>{medicamento.dosificacion || medicamento.uso}</Text>
        </Card.Content>
      </Card>

      {/* Enfermedades Relacionadas */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>🦠 Enfermedades Relacionadas</Text>
          {enfermedades.map((enf: string, index: number) => (
            <Text key={index} style={styles.bulletPoint}>• {enf}</Text>
          ))}
        </Card.Content>
      </Card>

      {/* Efectos Secundarios */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>⚠️ Efectos Secundarios</Text>
          {efectos.map((efecto: string, index: number) => (
            <Text key={index} style={styles.bulletPoint}>• {efecto}</Text>
          ))}
        </Card.Content>
      </Card>

      {/* Contraindicaciones */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>🚫 Contraindicaciones</Text>
          {contraindicaciones.map((contra: string, index: number) => (
            <Text key={index} style={styles.bulletPoint}>• {contra}</Text>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  backButton: { margin: 16, marginBottom: 0 },
  backText: { fontSize: 16, color: '#2E7D32', fontWeight: '500' },
  loader: { flex: 1, justifyContent: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' },
  
  titleCard: { margin: 16, marginTop: 8, backgroundColor: '#fff', elevation: 2 },
  nombreGenerico: { fontSize: 14, color: '#666', marginBottom: 8 },
  categoriaBadge: { backgroundColor: '#2E7D32', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  categoriaTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  advertenciaCard: { backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#FF9800', marginHorizontal: 16 },
  advertenciaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#E65100', marginBottom: 8 },
  advertenciaTexto: { fontSize: 14, color: '#555', lineHeight: 20 },
  
  card: { margin: 16, marginTop: 0, backgroundColor: '#fff', elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 12 },
  text: { fontSize: 14, color: '#333', lineHeight: 22 },
  listItem: { fontSize: 14, color: '#333', lineHeight: 24, marginLeft: 8 },
  bulletPoint: { fontSize: 14, color: '#333', lineHeight: 24, marginLeft: 8 },
});