// src/screens/FuncionarioCadastro.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';

export default function ServicosCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const handleSalvar = () => {
    console.log('Salvar funcionário:', { nome, cargo, telefone, email });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        userName="Melissa"
        onNotificationPress={() => console.log('Notificações')}
        onProfilePress={() => console.log('Perfil')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Funcionário</Text>

        <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />

        {/* Campo de seleção de cargo */}
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={cargo}
            onValueChange={(itemValue) => setCargo(itemValue)}
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

        <Button title="Salvar" onPress={handleSalvar} style={styles.saveButton} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.large,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  selectContainer: {
    marginVertical: theme.spacing.small,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  pickerWrapper: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.Input,
    fontSize: 16,
  },
  saveButton: {
    marginTop: theme.spacing.large,
  },
  inputLike: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    borderColor: theme.colors.container3,
    marginVertical: theme.spacing.small,
    color: theme.colors.textInput,
    fontSize: 16,
  },  
});
