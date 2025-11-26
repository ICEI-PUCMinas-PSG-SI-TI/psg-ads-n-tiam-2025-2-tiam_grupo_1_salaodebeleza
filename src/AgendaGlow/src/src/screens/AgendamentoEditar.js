import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MultiSelect from '../components/MultiSelect';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  updateAgendamento,
  deleteAgendamento,
} from '../services/agendamentoService';
import { listenFuncionarios } from '../services/funcionarioService';
import { listenServicos } from '../services/servicoService';
import { listenClientes } from '../services/clienteService';

export default function AgendamentoEditar({ navigation, route }) {
  const agendamento = route?.params?.agendamento || null;

  // If there is no agendamento passed, notify and offer back
  if (!agendamento) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Header userName="Usuário" />
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>
          Nenhum agendamento selecionado para edição.
        </Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  // --- Estados ---
  const [cliente, setCliente] = useState(agendamento.cliente || null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [profissionaisSelecionados, setProfissionaisSelecionados] = useState([]);
  const [data, setData] = useState(agendamento.data || '');
  const [horario, setHorario] = useState(agendamento.horario || '');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [valor, setValor] = useState(agendamento.valor || '');
  const [observacoes, setObservacoes] = useState(agendamento.observacoes || '');
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorSave, setErrorSave] = useState(null);

  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalFeedbackVisible, setModalFeedbackVisible] = useState(false);
  const [modalFeedbackTitle, setModalFeedbackTitle] = useState('');
  const [modalFeedbackMessage, setModalFeedbackMessage] = useState('');
  const [modalFeedbackType, setModalFeedbackType] = useState('success');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showFeedbackModal = (title, message, type = 'success') => {
    setModalFeedbackTitle(title);
    setModalFeedbackMessage(message);
    setModalFeedbackType(type);
    setModalFeedbackVisible(true);
  };

  const closeFeedbackModal = () => {
    setModalFeedbackVisible(false);
    if (modalFeedbackType === 'success') navigation.goBack();
  };

  // helpers
  const parseDatePtBr = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map((p) => parseInt(p, 10));
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
    return new Date(year, month - 1, day);
  };

  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const [hours, minutes] = parts.map((p) => parseInt(p, 10));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  useEffect(() => {
    const unsubF = listenFuncionarios((lista) => setListaFuncionarios(lista));
    const unsubS = listenServicos((lista) => setListaServicos(lista));
    const unsubC = listenClientes((lista) => setListaClientes(lista));

    return () => {
      if (typeof unsubF === 'function') unsubF();
      if (typeof unsubS === 'function') unsubS();
      if (typeof unsubC === 'function') unsubC();
    };
  }, []);

  // depois de carregar listas, sincronizar os itens selecionados a partir dos ids
  useEffect(() => {
    if (listaServicos.length > 0 && agendamento && agendamento.servicos) {
      const selected = agendamento.servicos
        .map((id) => listaServicos.find((s) => s.id === id))
        .filter(Boolean);
      setServicosSelecionados(selected);
    }
    if (listaFuncionarios.length > 0 && agendamento && agendamento.profissionais) {
      const selected = agendamento.profissionais
        .map((id) => listaFuncionarios.find((f) => f.id === id))
        .filter(Boolean);
      setProfissionaisSelecionados(selected);
    }
    // set selectedDate/time if data/hora come from agendamento
    const parsedDate = parseDatePtBr(agendamento.data);
    if (parsedDate) setSelectedDate(parsedDate);
    const parsedTime = parseTime(agendamento.horario);
    if (parsedTime) setSelectedTime(parsedTime);
  }, [listaServicos, listaFuncionarios, agendamento]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirmDate = (d) => {
    const formatted = d.toLocaleDateString('pt-BR');
    setSelectedDate(d);
    setData(formatted);
    hideDatePicker();
  };

  const handleConfirmTime = (t) => {
    const formatted = t.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setSelectedTime(t);
    setHorario(formatted);
    hideTimePicker();
  };

  const handleSalvar = async () => {
    setErrorSave(null);
    if (!cliente) {
      setErrorSave('Selecione o cliente.');
      return;
    }
    if (!servicosSelecionados || servicosSelecionados.length === 0) {
      setErrorSave('Selecione ao menos 1 serviço.');
      return;
    }

    setLoading(true);
    const dadosAtualizados = {
      cliente,
      servicos: servicosSelecionados.map((s) => s.id),
      profissionais: profissionaisSelecionados.map((p) => p.id),
      data,
      horario,
      valor,
      observacoes,
      atualizadoEm: new Date(),
    };

    const result = await updateAgendamento(agendamento.id, dadosAtualizados);
    setLoading(false);
    if (result.success) {
      showFeedbackModal('Sucesso', 'Agendamento atualizado com sucesso!', 'success');
    } else {
      showFeedbackModal('Erro', result.message || 'Falha ao atualizar agendamento.', 'error');
    }
  };

  const handleExcluirConfirmado = async () => {
    setModalConfirmVisible(false);
    setLoadingDelete(true);
    const result = await deleteAgendamento(agendamento.id);
    setLoadingDelete(false);
    if (result.success) {
      showFeedbackModal('Sucesso', 'Agendamento excluído', 'success');
    } else {
      showFeedbackModal('Erro', result.message || 'Falha ao excluir agendamento', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Header userName={"Usuario"} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Agendamento</Text>

        <Picker
          style={styles.inputLike}
          dropdownIconColor={theme.colors.textInput}
          selectedValue={cliente}
          onValueChange={setCliente}
        >
          <Picker.Item color={theme.colors.textInput} label="Selecione o Cliente" value={null} />
          {listaClientes.map((c) => (
            <Picker.Item key={c.id} color={theme.colors.textInput} label={c.nome ?? 'Cliente'} value={c.id} />
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
            setServicosSelecionados(servicosSelecionados.filter((s) => s.id !== itemId));
          }}
          searchableField="nome"
        />

        <MultiSelect
          placeholder="Selecione profissionais"
          items={listaFuncionarios}
          selectedItems={profissionaisSelecionados}
          onSelectItem={(item) => {
            if (!profissionaisSelecionados.find((p) => p.id === item.id)) {
              setProfissionaisSelecionados([...profissionaisSelecionados, item]);
            }
          }}
          onRemoveItem={(itemId) => {
            setProfissionaisSelecionados(profissionaisSelecionados.filter((p) => p.id !== itemId));
          }}
          searchableField="nome"
        />

        {/* Date */}
        <TouchableOpacity onPress={showDatePicker} activeOpacity={0.7}>
          <View pointerEvents="none">
            <Input placeholder="Selecione a data" value={data} editable={false} />
          </View>
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={selectedDate} onConfirm={handleConfirmDate} onCancel={hideDatePicker} />

        {/* Time */}
        <TouchableOpacity onPress={showTimePicker} activeOpacity={0.7}>
          <View pointerEvents="none">
            <Input placeholder="Selecione o horário" value={horario} editable={false} />
          </View>
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" date={selectedTime} onConfirm={handleConfirmTime} onCancel={hideTimePicker} />

        <Input placeholder="Valor serviço" value={valor} onChangeText={setValor} />
        <Input placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />

        {errorSave && <Text style={styles.errorMessage}>{errorSave}</Text>}

        <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={handleSalvar} style={styles.saveButton} disabled={loading} />
        
      </ScrollView>

      {/* --- Modal de confirmação de exclusão --- */}
      <Modal visible={modalConfirmVisible} transparent animationType="fade" onRequestClose={() => setModalConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <TouchableOpacity onPress={() => setModalConfirmVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>Tem certeza de que deseja excluir este agendamento? Esta ação pode ser desfeita em painel de administradores.</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Button title="Cancelar" onPress={() => setModalConfirmVisible(false)} style={{ backgroundColor: theme.colors.cancel }} />
              <Button title={loadingDelete ? 'Excluindo...' : 'Confirmar'} onPress={handleExcluirConfirmado} disabled={loadingDelete} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal feedback */}
      <Modal visible={modalFeedbackVisible} transparent animationType="fade" onRequestClose={closeFeedbackModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalFeedbackTitle}</Text>
              <TouchableOpacity onPress={closeFeedbackModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>{modalFeedbackMessage}</Text>
            <View style={styles.modalButtons}>
              <Button title="OK" onPress={closeFeedbackModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.large },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.medium },
  inputLike: { backgroundColor: theme.colors.container3, borderRadius: theme.radius.medium, paddingHorizontal: theme.spacing.medium, paddingVertical: 10, marginVertical: theme.spacing.small, color: theme.colors.textInput, fontSize: 16, borderWidth: 1, borderColor: theme.colors.container3 },
  errorMessage: { color: theme.colors.primary, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  deleteWarning: { color: theme.colors.textInput, textAlign: 'center', fontSize: 12, marginTop: 6 },
  saveButton: { marginTop: theme.spacing.large },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContainer: { backgroundColor: theme.colors.white, borderRadius: 16, width: '100%', maxWidth: 400, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  modalMessage: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  modalButtons: { alignItems: 'flex-end' },
});
 
