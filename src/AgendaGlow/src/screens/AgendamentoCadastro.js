import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import { listenFuncionarios } from "../services/funcionarioService";

export default function AgendamentoCadastro() {
  const [cliente, setCliente] = useState(null);
  const [servico, setServico] = useState(null);
  const [profissional, setProfissional] = useState([null]);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const mockClientes = [
    { label: "Selecione o Cliente", value: null },
    { label: "Maria Silva", value: "maria" },
    { label: "João Oliveira", value: "joao" },
  ];

  const mockServicos = [
    { label: "Selecione o Serviço", value: null },
    { label: "Corte de Cabelo", value: "corte" },
    { label: "Coloração Completa", value: "coloracao" },
    { label: "Hidratação", value: "hidratacao" },
  ];

  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaClientes, setListaClientes] = useState(mockClientes);
  const [listaServicos, setListaServicos] = useState(mockServicos);

  useEffect(() => {
    const unsubscribe = listenFuncionarios((lista) => {
      setLoading(true);
      setListaFuncionarios(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function handleSalvar({cliente, servico, profissional, data, horario, valor, observacoes}){

  }

  return (
    <View style={styles.container}>
      <Header userName="Usuario" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Funcionário</Text>
        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          label="Cliente"
          selectedValue={cliente}
          onValueChange={setCliente}
          required
        >
          {listaClientes.map((c) => (
            <Picker.Item
              color={theme.colors.textInput}
              label={c.label}
              value={c.value}
            />
          ))}
        </Picker>
        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          label="Serviço"
          selectedValue={servico}
          onValueChange={setServico}
          required
        >
          {listaServicos.map((s) => (
            <Picker.Item
              color={theme.colors.textInput}
              label={s.label}
              value={s.value}
            />
          ))}
        </Picker>
        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          label="Profissional"
          selectedValue={profissional}
          onValueChange={setProfissional}
          required
        >
          {listaFuncionarios.map((f) => (
            <Picker.Item
              color={theme.colors.textInput}
              key={f.id}
              label={f.nome}
              value={f.id}
            />
          ))}
        </Picker>
        <Input placeholder="Data" value={data} onChangeText={setData} />
        <Input
          placeholder="horario"
          value={horario}
          onChangeText={setHorario}
        />
        <Input
          placeholder="Valor serviço"
          value={valor}
          onChangeText={setServico}
        />
        <Input
          placeholder="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
        />
        <Button
          title={loading ? "Salvando..." : "Salvar"}
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
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
    color: theme.colors.textSecondary || "#777",
    fontSize: 14,
    marginTop: theme.spacing.medium,
  },
  bold: { fontWeight: "700", color: theme.colors.text },
  saveButton: { marginTop: theme.spacing.large },
});
