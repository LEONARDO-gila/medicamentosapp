import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, Switch, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  // Estados para Login
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para Registro
  const [isRegistering, setIsRegistering] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newMatricula, setNewMatricula] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  
  // Estado de privacidad
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true);

  // ========== VERIFICAR SESIÓN ACTIVA ==========
  useEffect(() => {
    const verificarSesion = async () => {
      const sesion = await AsyncStorage.getItem('sesion_activa');
      if (sesion) {
        router.replace('/home');
      }
    };
    verificarSesion();
  }, []);

  // Cargar usuarios registrados al inicio
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const usuariosGuardados = await AsyncStorage.getItem('medicos_registrados');
      if (!usuariosGuardados) {
        // Usuario por defecto
        const usuariosDefault = [
          { id: 1, nombre: 'Dr. Juan Pérez', matricula: 'MED-2024-001', password: 'medico2025' },
          { id: 2, nombre: 'Dra. María García', matricula: 'CED-12345', password: 'doctora123' }
        ];
        await AsyncStorage.setItem('medicos_registrados', JSON.stringify(usuariosDefault));
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  // Función de Login
  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu matrícula y contraseña');
      return;
    }

    try {
      const usuariosGuardados = await AsyncStorage.getItem('medicos_registrados');
      const medicos = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
      
      const medicoEncontrado = medicos.find(
        (m: any) => m.matricula === usuario && m.password === password
      );
      
      if (medicoEncontrado) {
        // Guardar sesión
        await AsyncStorage.setItem('sesion_activa', JSON.stringify(medicoEncontrado));
        Alert.alert('Bienvenido', `Hola ${medicoEncontrado.nombre}`);
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Matrícula o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    }
  };

  // Función de Registro
  const handleRegister = async () => {
    // Validaciones
    if (!newNombre.trim() || !newMatricula.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert('Aceptación requerida', 'Debes aceptar que tus datos no serán compartidos');
      return;
    }

    // Validar formato de matrícula/cedula
    const matriculaRegex = /^[A-Za-z0-9-]{5,20}$/;
    if (!matriculaRegex.test(newMatricula)) {
      Alert.alert('Formato inválido', 'La matrícula/cedula debe tener entre 5 y 20 caracteres (letras, números o guiones)');
      return;
    }

    try {
      const usuariosGuardados = await AsyncStorage.getItem('medicos_registrados');
      const medicos = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
      
      // Verificar si ya existe la matrícula
      if (medicos.some((m: any) => m.matricula === newMatricula)) {
        Alert.alert('Error', 'Esta matrícula/cedula ya está registrada');
        return;
      }
      
      // Crear nuevo médico
      const nuevoMedico = {
        id: medicos.length + 1,
        nombre: newNombre,
        matricula: newMatricula,
        password: newPassword,
        fechaRegistro: new Date().toISOString()
      };
      
      medicos.push(nuevoMedico);
      await AsyncStorage.setItem('medicos_registrados', JSON.stringify(medicos));
      
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión con tu matrícula');
      
      // Limpiar formulario y volver al login
      setNewNombre('');
      setNewMatricula('');
      setNewPassword('');
      setConfirmPassword('');
      setAceptaTerminos(false);
      setIsRegistering(false);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro');
    }
  };

  // Cerrar advertencia
  const cerrarAdvertencia = () => {
    setMostrarAdvertencia(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo y título */}
        <Card style={styles.card}>
          <Card.Content>
            <Image 
              source={{ uri: 'https://img.icons8.com/color/96/000000/medical-doctor.png' }}
              style={styles.logo}
            />
            <Text variant="headlineMedium" style={styles.title}>
              MEDICAMENTOSAPP
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {isRegistering ? 'Registro de Médicos' : 'Acceso exclusivo para médicos'}
            </Text>
          </Card.Content>
        </Card>

        {/* Advertencia de privacidad */}
        {mostrarAdvertencia && (
          <Card style={styles.advertenciaCard}>
            <Card.Content>
              <View style={styles.advertenciaHeader}>
                <Text style={styles.advertenciaIcon}>🔒</Text>
                <Text variant="titleSmall" style={styles.advertenciaTitulo}>Privacidad y Seguridad</Text>
                <TouchableOpacity onPress={cerrarAdvertencia}>
                  <Text style={styles.cerrarAdvertencia}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.advertenciaTexto}>
                Tus datos personales y matrícula profesional NO son compartidos con terceros. 
                La información se almacena de forma local y segura en tu dispositivo.
              </Text>
            </Card.Content>
          </Card>
        )}

        {!isRegistering ? (
          // FORMULARIO DE LOGIN
          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Matrícula / Cedula Profesional"
                value={usuario}
                onChangeText={setUsuario}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="card-account-details" />}
                placeholder="Ej: MED-2024-001"
              />
              
              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              
              <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor="#2196F3"
              >
                Ingresar
              </Button>
              
              <Divider style={styles.divider} />
              
              <TouchableOpacity onPress={() => setIsRegistering(true)}>
                <Text style={styles.linkText}>
                  ¿No tienes cuenta? Regístrate aquí
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ) : (
          // FORMULARIO DE REGISTRO
          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Nombre completo"
                value={newNombre}
                onChangeText={setNewNombre}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
                placeholder="Dr. Juan Pérez"
              />
              
              <TextInput
                label="Matrícula / Cedula Profesional"
                value={newMatricula}
                onChangeText={setNewMatricula}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="badge-account" />}
                placeholder="Ej: MED-2024-001 o CED-12345"
              />
              
              <TextInput
                label="Contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showNewPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                }
              />
              
              <TextInput
                label="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              
              <View style={styles.terminosContainer}>
                <Switch
                  value={aceptaTerminos}
                  onValueChange={setAceptaTerminos}
                  color="#2196F3"
                />
                <Text style={styles.terminosTexto}>
                  Acepto que mis datos no serán compartidos con nadie
                </Text>
              </View>
              
              <Button 
                mode="contained" 
                onPress={handleRegister} 
                style={styles.button}
                buttonColor="#1976D2"
              >
                Registrarse
              </Button>
              
              <Divider style={styles.divider} />
              
              <TouchableOpacity onPress={() => setIsRegistering(false)}>
                <Text style={styles.linkText}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )}
        
        {/* Pie de página con información de privacidad */}
        <Text style={styles.footerText}>
          🔒 Tus datos están seguros. No compartimos información con terceros.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 5,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  advertenciaCard: {
    marginBottom: 20,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  advertenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  advertenciaIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  advertenciaTitulo: {
    flex: 1,
    fontWeight: 'bold',
    color: '#E65100',
  },
  cerrarAdvertencia: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  advertenciaTexto: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  formCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 20,
  },
  linkText: {
    textAlign: 'center',
    color: '#1976D2',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  terminosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  terminosTexto: {
    marginLeft: 10,
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    marginTop: 20,
  },
});