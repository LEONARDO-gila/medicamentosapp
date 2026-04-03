import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Text, ActivityIndicator } from 'react-native-paper';
import { initDatabase, getMedicamentosByCategoria, searchMedicamentos } from '../database/db';
import { router } from 'expo-router';

export default function CotidianoScreen() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDatabase();
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const data = getMedicamentosByCategoria('cotidiano');
    setMedicamentos(data);
    setFiltered(data);
    setLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const results = searchMedicamentos(text);
      setFiltered(results.filter((m: any) => m.categoria === 'cotidiano'));
    } else {
      setFiltered(medicamentos);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}>
      <Card style={styles.card}>
        <Card.Title 
          title={item.nombre} 
          subtitle={item.descripcion} 
          left={(props) => <Text {...props}>💊</Text>} 
        />
        <Card.Content>
          <Text variant="bodyMedium">Enfermedades: {item.enfermedades}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator animating={true} style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar medicamento de uso cotidiano..."
        onChangeText={handleSearch}
        value={search}
        style={styles.searchbar}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchbar: { margin: 16 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  list: { paddingBottom: 16 },
  loader: { flex: 1, justifyContent: 'center' }
});