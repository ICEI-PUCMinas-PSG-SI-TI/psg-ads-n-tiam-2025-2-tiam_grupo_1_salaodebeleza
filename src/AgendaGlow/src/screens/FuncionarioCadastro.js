import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { addFuncionario } from '../services/funcionarioService';

export default function FuncionarioCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !cargo || !telefone || !email) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    setLoading(true);
    const result = await addFuncionario({ nome, cargo, telefone, email });
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', result.message || 'Falha ao cadastrar funcionário.');
    }
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuario" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Funcionário</Text>

        <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <View>
          <Picker
            selectedValue={cargo}
            onValueChange={setCargo}
            style={styles.inputLike}
            dropdownIconColor={theme.colors.textInput}
          >
            <Picker.Item label="Cargo" value="" color={theme.colors.textInput} />
            <Picker.Item label="Gestor" value="Gestor" />
            <Picker.Item label="Funcionário" value="Funcionário" />
          </Picker>
        </View>
        <Input placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
        <Input placeholder="E-mail" value={email} onChangeText={setEmail} />

        <Text style={styles.senhaInfo}>
          A senha padrão do funcionário será <Text style={styles.bold}>agendaglow12345</Text>.{"\n"}
          Ele poderá alterá-la mais tarde.
        </Text>

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
});
