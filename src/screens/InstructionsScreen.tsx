import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

export default function InstructionsScreen({ navigation }: any) {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLogged(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsLogged(!!session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuração Rápida</Text>
      <Text style={styles.subtitle}>POC Integração Supabase</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Passos Essenciais</Text>
        <Text style={styles.item}>1. Configure o Supabase (URL e anon key).</Text>
        <Text style={styles.item}>2. Renomeie src/config.example.ts para src/config.ts e cole suas credenciais.</Text>
        <Text style={styles.item}>3. Execute o arquivo database-setup.sql no Supabase.</Text>
        <Text style={styles.item}>4. Crie o bucket de storage chamado "avatars".</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Telas implementadas</Text>
        <Text style={styles.item}>- Login com email e senha</Text>
        <Text style={styles.item}>- Cadastro com validações</Text>
        <Text style={styles.item}>- Edição de perfil (nome, descrição e foto)</Text>
        <Text style={styles.item}>- Acesso ao perfil apenas logado</Text>
      </View>

      <View style={styles.actions}>
        {isLogged ? (
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.buttonText}>Ir para Perfil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Ir para Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.secondaryText}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Detalhes completos em CONFIGURACAO-RAPIDA.md e README.md</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  item: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});
