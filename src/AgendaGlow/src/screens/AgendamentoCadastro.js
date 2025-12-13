import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import MultiSelect from "../components/MultiSelect";
import { theme } from "../styles/theme";

import { listenFuncionarios } from "../services/funcionarioService";
import { listenServicos } from "../services/servicoService";
import { listenClientes } from "../services/clienteService";
import { addAgendamento } from "../services/agendamentoService";
import { enviarWhatsappAgendamento } from "../services/whatsappAgendamento";
//import { iniciarLembretesWhatsApp } from "../utils/lembreteAgendamentoUtils";

import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AgendamentoCadastro() {
  const navigation = useNavigation();

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

  // MODAIS
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [modalWhatsappVisible, setModalWhatsappVisible] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");

  const abrirModalSucesso = (msg) => {
    setModalMensagem(msg);
    setModalSucessoVisible(true);
  };

  const abrirModalErro = (msg) => {
    setModalMensagem(msg);
    setModalErroVisible(true);
  };

  useEffect(() => {
    const f1 = listenFuncionarios(setListaFuncionarios);
    const f2 = listenServicos(setListaServicos);
    const f3 = listenClientes(setListaClientes);

    return () => {
      f1();
      f2();
      f3();
    };
  }, []);

  async function handleSalvar() {
    try {
      setLoading(true);

      const novoAgendamento = {
        cliente,
        servicos: servicosSelecionados.map((s) => s.id),
        profissionais: profissionaisSelecionados.map((p) => p.id),
        data,
        horario,
        valor,
        observacoes,
      };

      const result = await addAgendamento(novoAgendamento);

      if (!result?.success) {
        abrirModalErro(result?.message || "Falha ao salvar agendamento.");
        return;
      }

      //await iniciarLembretesWhatsApp(result.id);
      abrirModalSucesso("Agendamento salvo com sucesso!");
    } catch (error) {
      abrirModalErro(error.message || "Erro ao salvar agendamento.");
    } finally {
      setLoading(false);
    }
  }

  // DATE & TIME PICKER
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    setData(date.toLocaleDateString("pt-BR"));
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time) => {
    setSelectedTime(time);
    setHorario(
      time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setTimePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <Header pageTitle="CADASTRAR AGENDAMENTO" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Preencha os campos abaixo</Text>

        <View style={styles.inputPickerContainer}>
          <Picker
            style={styles.inputLike}
            selectedValue={cliente}
            onValueChange={setCliente}
          >
            <Picker.Item label="Selecione o Cliente" value={null} />
            {listaClientes.map((c) => (
              <Picker.Item key={c.id} label={c.nome} value={c.id} />
            ))}
          </Picker>
        </View>

        <MultiSelect
          placeholder="Selecione serviços"
          items={listaServicos}
          selectedItems={servicosSelecionados}
          searchableField="nome"
          onSelectItem={(item) =>
            !servicosSelecionados.find((s) => s.id === item.id) &&
            setServicosSelecionados([...servicosSelecionados, item])
          }
          onRemoveItem={(id) =>
            setServicosSelecionados(
              servicosSelecionados.filter((s) => s.id !== id)
            )
          }
        />

        <MultiSelect
          placeholder="Selecione profissionais"
          items={listaFuncionarios}
          selectedItems={profissionaisSelecionados}
          searchableField="nome"
          onSelectItem={(item) =>
            !profissionaisSelecionados.find((p) => p.id === item.id) &&
            setProfissionaisSelecionados([
              ...profissionaisSelecionados,
              item,
            ])
          }
          onRemoveItem={(id) =>
            setProfissionaisSelecionados(
              profissionaisSelecionados.filter((p) => p.id !== id)
            )
          }
        />

        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <View pointerEvents="none">
            <Input placeholder="Selecione a data" value={data} editable={false} />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={selectedDate}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
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
          onConfirm={handleConfirmTime}
          onCancel={() => setTimePickerVisibility(false)}
        />

        <Input placeholder="Valor serviço" value={valor} onChangeText={setValor} />
        <Input
          placeholder="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
        />

        <Button
          title={loading ? "Salvando..." : "Salvar"}
          onPress={handleSalvar}
          disabled={loading}
          style={styles.saveButton}
        />
      </ScrollView>

      {/* MODAL SUCESSO */}
      <Modal visible={modalSucessoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Button
              title="OK"
              onPress={() => {
                setModalSucessoVisible(false);
                setModalWhatsappVisible(true);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL ERRO */}
      <Modal visible={modalErroVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Button title="OK" onPress={() => setModalErroVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* MODAL WHATSAPP */}
      <Modal visible={modalWhatsappVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Deseja enviar a confirmação no WhatsApp?
            </Text>

            <Button
              title="Enviar WhatsApp"
              onPress={() => {
                const clienteObj = listaClientes.find(
                  (c) => String(c.id) === String(cliente)
                );

                if (!clienteObj) {
                  abrirModalErro("Cliente não encontrado.");
                  return;
                }

                enviarWhatsappAgendamento({
                  nome: clienteObj.nome,
                  telefone: clienteObj.telefone,
                  data,
                  horario,
                  servicos: servicosSelecionados.map((s) => s.nome),
                });

                setModalWhatsappVisible(false);
                navigation.navigate("Agenda");
              }}
            />

            <Button
              title="Cancelar"
              onPress={() => {
                setModalWhatsappVisible(false);
                navigation.navigate("Agenda");
              }}
            />
          </View>
        </View>
      </Modal>
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
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  inputPickerContainer: {
    overflow: "hidden",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.container3,
    marginBottom: theme.spacing.medium,
  },
  inputLike: {
    backgroundColor: theme.colors.container3,
    paddingHorizontal: theme.spacing.medium,
    color: theme.colors.textInput,
    fontSize: 16,
  },
  saveButton: {
    marginTop: theme.spacing.large,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
});
