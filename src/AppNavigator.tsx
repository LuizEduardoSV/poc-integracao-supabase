import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import InstructionsScreen from './screens/InstructionsScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import { supabase } from './supabase';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Instructions"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Instructions" 
        component={InstructionsScreen}
        options={{ title: 'Instruções' }}
      />

      {!session ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: 'Login',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ 
              title: 'Cadastro',
              headerShown: false
            }} 
          />
        </>
      ) : (
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Meu Perfil',
            headerShown: false
          }} 
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
