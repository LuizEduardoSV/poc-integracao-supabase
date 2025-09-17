import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../supabase';

export default function ProfileScreen() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || '');
        await carregarPerfil(user.id);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
    }
  }

  async function carregarPerfil(id: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      if (data) {
        setNome(data.nome || '');
        setDescricao(data.descricao || '');
        setFoto(data.avatar_url || null);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async function solicitarPermissaoCamera() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para acessar sua galeria de fotos.'
      );
      return false;
    }
    return true;
  }

  async function escolherFoto() {
    const temPermissao = await solicitarPermissaoCamera();
    if (!temPermissao) return;

    try {
      setUploading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        await fazerUploadFoto(file);
      }
    } catch (error) {
      console.error('Erro ao escolher foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    } finally {
      setUploading(false);
    }
  }

  async function fazerUploadFoto(file: any) {
    if (!userId) return;

    try {
      // Converter URI para blob
      const response = await fetch(file.uri);
      const blob = await response.blob();
      
      // Criar nome único para o arquivo
      const fileExt = file.uri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFoto(urlData.publicUrl);
      
      // Atualizar perfil com nova foto
      await atualizarPerfil(urlData.publicUrl);
      
      Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Não foi possível fazer upload da foto');
    }
  }

  async function atualizarPerfil(novaFoto?: string) {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          nome: nome.trim(),
          descricao: descricao.trim(),
          avatar_url: novaFoto || foto,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async function salvarPerfil() {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return;
    }

    setLoading(true);
    try {
      await atualizarPerfil();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil');
    } finally {
      setLoading(false);
    }
  }

  async function sair() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao sair:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>{userEmail}</Text>
        </View>

        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Sem foto</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.photoButton, uploading && styles.photoButtonDisabled]} 
            onPress={escolherFoto}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.photoButtonText}>
                {foto ? 'Alterar Foto' : 'Adicionar Foto'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite seu nome" 
            value={nome} 
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Conte um pouco sobre você..." 
            value={descricao} 
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={salvarPerfil}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Perfil</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={sair}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    marginBottom: 15,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  photoPlaceholderText: {
    color: '#666',
    fontSize: 14,
  },
  photoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  photoButtonDisabled: {
    backgroundColor: '#ccc',
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
