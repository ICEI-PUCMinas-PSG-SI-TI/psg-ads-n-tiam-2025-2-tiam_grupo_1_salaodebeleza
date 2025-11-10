// src/screens/ClienteCadastro.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Input value={nome} onChangeText={setNome} placeholder="Nome*" />

          <Input value={telefone} onChangeText={setTelefone} placeholder="Telefone*" keyboardType="phone-pad" />

          <Input value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

          <TextArea value={observacoes} onChangeText={setObservacoes} placeholder="Observações" />

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
});
