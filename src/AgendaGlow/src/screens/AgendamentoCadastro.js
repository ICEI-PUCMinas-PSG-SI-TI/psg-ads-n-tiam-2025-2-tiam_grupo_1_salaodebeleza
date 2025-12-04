import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import MultiSelect from "../components/MultiSelect";
import { theme } from "../styles/theme";
import { listenFuncionarios } from "../services/funcionarioService";
import { listenServicos } from "../services/servicoService";
import { listenClientes } from "../services/clienteService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addAgendamento } from '../services/agendamentoService';
import { useNavigation } from '@react-navigation/native';

export default function AgendamentoCadastro() {
  const [cliente, setCliente] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [profissionaisSelecionados, setProfissionaisSelecionados] = useState([]);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);
  const navigation = useNavigation();

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
    const unsubscribeClientes = listenClientes((lista) => {
      setLoading(true);
      setListaClientes(lista);
      setLoading(false);
    });
    return () => {
      unsubscribeFuncionarios();
      unsubscribeServicos();
      unsubscribeClientes();
    };
  }, []);

  async function handleSalvar() {
    const novoAgendamento = {
      cliente,
      servicos: servicosSelecionados.map(s => s.id),
      profissionais: profissionaisSelecionados.map(p => p.id),
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
        setServicosSelecionados([]);
        setProfissionaisSelecionados([]);
        setData("");
        setHorario("");
        setValor("");
        setObservacoes("");
        setTimeout(() => navigation.navigate('Agenda'), 1000);
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
    setSelectedDate(selectedDate);
    setData(formattedDate);
    hideDatePicker();
  };
  const handleTimeConfirm = (selectedTime) => {
    const formattedTime = selectedTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setSelectedTime(selectedTime);
    setHorario(formattedTime);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <Header pageTitle={"CADASTRAR AGENDAMENTO"} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Preencha os campos abaixo</Text>

        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          selectedValue={cliente}
          onValueChange={setCliente}
        >
          <Picker.Item
            color={theme.colors.textInput}
            label="Selecione o Cliente"
            value={null}
          />
          {listaClientes.map((c) => (
            <Picker.Item
              color={theme.colors.textInput}
              key={c.id}
              label={c.nome ?? 'Cliente'}
              value={c.id}
            />
          ))}
        </Picker>

        <MultiSelect
          placeholder="Selecione serviços"
          items={listaServicos}
          selectedItems={servicosSelecionados}
          onSelectItem={(item) => {
            if (!servicosSelecionados.find((s) => s.id === item.id)) {
              setServicosSelecionados([...servicosSelecionados, item]);
            }
          }}
          onRemoveItem={(itemId) => {
            setServicosSelecionados(
              servicosSelecionados.filter((s) => s.id !== itemId)
            );
          }}
          searchableField="nome"
        />

        <MultiSelect
          placeholder="Selecione profissionais"
          items={listaFuncionarios}
          selectedItems={profissionaisSelecionados}
          onSelectItem={(item) => {
            if (!profissionaisSelecionados.find((p) => p.id === item.id)) {
              setProfissionaisSelecionados([
                ...profissionaisSelecionados,
                item,
              ]);
            }
          }}
          onRemoveItem={(itemId) => {
            setProfissionaisSelecionados(
              profissionaisSelecionados.filter((p) => p.id !== itemId)
            );
          }}
          searchableField="nome"
        />

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
          date={selectedDate}
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
          date={selectedTime}
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
  label: {
    fontWeight: "600",
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontSize: 16,
  },
  saveButton: { marginTop: theme.spacing.large },
});
