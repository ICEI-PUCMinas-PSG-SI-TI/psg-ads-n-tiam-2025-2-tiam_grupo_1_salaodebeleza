import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TextInput } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { addClientes } from '../services/clienteService'; 

export default function ClienteCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !descricao || !observacoes ) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    setLoading(true);
    const result = await addClientes({ nome, descricao, observacoes });
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', result.message || 'Falha ao cadastrar cliente.');
    }
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuario" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Cliente</Text>

        <Input placeholder="Nome do cliente" value={nome} onChangeText={setNome} />
        <View style={styles.container}>
          <TextArea
            style={styles.textArea}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4} // define a altura inicial
            textAlignVertical="top" // faz o texto começar do topo
          />
        </View>
        <View style={styles.container}>
          <TextArea
            style={styles.textArea}
            placeholder="Observações"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4} // define a altura inicial
            textAlignVertical="top" // faz o texto começar do topo
          />
        </View>

        <Button
          title={loading ? 'Salvando...' : 'Salvar'}
          onPress={handleSalvar}
          style={styles.saveButton}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.large },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.medium },
  inputLike: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    marginVertical: theme.spacing.small,
    color: theme.colors.textInput,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.container3,
  },
  senhaInfo: {
    color: theme.colors.textSecondary || '#777',
    fontSize: 14,
    marginTop: theme.spacing.medium,
  },
  bold: { fontWeight: '700', color: theme.colors.text },
  saveButton: { marginTop: theme.spacing.large },
  textArea: {
    height: 120,
    borderColor: theme?.colors?.textInput || '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
