import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import { listenFuncionarios } from "../services/funcionarioService";
import { listenServicos } from "../services/servicoService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addAgendamento } from '../services/agendamentoService';

export default function AgendamentoCadastro() {
  const [cliente, setCliente] = useState(null);
  const [servico, setServico] = useState(null);
  const [profissional, setProfissional] = useState(null);
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

  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaClientes, setListaClientes] = useState(mockClientes);
  const [listaServicos, setListaServicos] = useState([]);

  useEffect(() => {
    const unsubscribeFuncionarios = listenFuncionarios((lista) => {
      setLoading(true);
      setListaFuncionarios(lista);
      setLoading(false);
    });
    const unsubscribeServicos = listenServicos((lista) => {
      setLoading(true);
      setListaServicos(lista);
      setLoading(false);
    });
    return () => {
      unsubscribeFuncionarios();
      unsubscribeServicos();
    };
  }, []);

  async function handleSalvar() {
    const novoAgendamento = {
      cliente,
      servico,
      profissional,
      data,
      horario,
      valor,
      observacoes,
    };

    try {
      const result = await addAgendamento(novoAgendamento);
      console.log(result);

      if (result.success) {
        Alert.alert("Sucesso", "Agendamento salvo com sucesso!");
        // limpa os campos
        setCliente(null);
        setServico(null);
        setProfissional(null);
        setData("");
        setHorario("");
        setValor("");
        setObservacoes("");
      } else {
        Alert.alert("Erro", result.message || "Falha ao salvar agendamento.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o agendamento.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formattedDate = selectedDate.toLocaleDateString("pt-BR");
    setData(formattedDate);
    hideDatePicker();
  };
  const handleTimeConfirm = (selectedTime) => {
    const formattedTime = selectedTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setHorario(formattedTime);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuário" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Agendamento</Text>

        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          selectedValue={cliente}
          onValueChange={setCliente}
        >
          {listaClientes.map((c, index) => (
            <Picker.Item
              key={index}
              color={theme.colors.textInput}
              label={c.label}
              value={c.value}
            />
          ))}
        </Picker>

        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          selectedValue={servico}
          onValueChange={setServico}
        >
          <Picker.Item
            color={theme.colors.textInput}
            label="Selecione o Serviço"
            value={null}
          />
          {listaServicos.map((s) => (
            <Picker.Item
              color={theme.colors.textInput}
              key={s.id}
              label={s.nome}
              value={s.id}
            />
          ))}
        </Picker>

        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          selectedValue={profissional}
          onValueChange={setProfissional}
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

        {/* Campo de Data como Input */}
        <TouchableOpacity onPress={showDatePicker} activeOpacity={0.7}>
          <View pointerEvents="none">
            <Input
              placeholder="Selecione a data"
              value={data}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />


        <TouchableOpacity onPress={showTimePicker} activeOpacity={0.7}>
          <View pointerEvents="none">
            <Input
              placeholder="Selecione o horário"
              value={horario}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
        <Input
          placeholder="Valor serviço"
          value={valor}
          onChangeText={setValor}
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
  saveButton: { marginTop: theme.spacing.large },
});
