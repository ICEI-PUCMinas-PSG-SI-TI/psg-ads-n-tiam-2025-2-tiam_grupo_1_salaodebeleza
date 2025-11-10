// src/screens/ClienteCadastro.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { addCliente, updateCliente, getClienteById } from '../services/clienteService';

export default function ClienteCadastro() {
  const navigation = useNavigation();
  const route = useRoute();
  const idParam = route.params?.id; // passando id


  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    //  busca dados atualizados do Firestore
    const load = async () => {
      if (idParam) {
        setLoading(true);
        const res = await getClienteById(idParam);
        if (res.success) {
          const c = res.data;
          setNome(c.nome || '');
          setTelefone(c.telefone || '');
          setEmail(c.email || '');
          setObservacoes(c.observacoes || '');
          setEditingId(c.id); 
        } else {
          Alert.alert('Erro', res.message || 'Não foi possível carregar cliente.');
        }
        setLoading(false);
      }
    };
    load();
  }, [idParam]);

    const salvar = async () => {
    if (!nome.trim()) return Alert.alert('Validação', 'Nome é obrigatório.');
    setLoading(true);
      if (!telefone.trim()) return Alert.alert('Validação', 'Telefone é obrigatório.'); 

    try {
      if (editingId) {
        // Edição
        const result = await updateCliente(editingId, {
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          observacoes,
        });

        if (result.success !== false) {
          Alert.alert('Sucesso', 'Cliente atualizado.', [
      {
        text: 'OK',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Clientes' }],
          });
        },
      },
    ]);
        }
      } else {
        // Novo cadastro
        const result = await addCliente({
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          observacoes,
        });

        if (result.success) {
          Alert.alert('Sucesso', 'Cliente criado.');
          navigation.navigate('Clientes'); // volta pra listagem
        } else {
          Alert.alert('Erro', result.message || 'Falha ao salvar.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header userName="Usuário" />

      <TouchableOpacity
  onPress={() => navigation.goBack()}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  }}
>
  <Text style={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 }}>
    ← Voltar
  </Text>
</TouchableOpacity>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo *" />

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(xx) xxxxx-xxxx *" keyboardType="phone-pad" />

          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@exemplo.com" keyboardType="email-address" />

          <Text style={styles.label}>Observações</Text>
          <TextInput style={[styles.input, { height: 100 }]} value={observacoes} onChangeText={setObservacoes} placeholder="Observações" multiline />

          <View style={{ marginTop: 20 }}>
            <Button title={editingId ? 'Salvar alterações' : 'Salvar cliente'} onPress={salvar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  label: { fontWeight: '700', color: theme.colors.primary, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    color: theme.colors.text,
  },
});
