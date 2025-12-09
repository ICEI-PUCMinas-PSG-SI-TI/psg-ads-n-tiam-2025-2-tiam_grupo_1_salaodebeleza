import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import Filter from "../components/Filter";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { theme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

import { listenRelatorios } from "../services/agendamentoService";
import { listenServicos } from "../services/servicoService";
import { listenClientes } from "../services/clienteService";
import { listenFuncionarios } from "../services/funcionarioService";
import { generateRelatoriosPDF } from "../services/relatorioPdfService";

export default function Relatorios() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    dataInicio: null,
    dataFim: null,
    servico: [],
    profissional: [],
  });

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('dataInicio'); 

  const [servicosList, setServicosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [funcionariosList, setFuncionariosList] = useState([]);
  const [filteredRelatorios, setFilteredRelatorios] = useState([]);

  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  const parseDatePtBr = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const formatDatePtBr = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const abrirDatePicker = (campo) => {
    setPickerMode(campo);
    setShowPicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed') { setShowPicker(false); return; }

    if (selectedDate) {
        const formatted = formatDatePtBr(selectedDate);
        
        const hoje = new Date();
        hoje.setHours(23, 59, 59, 999);

        if (selectedDate > hoje) {
            Alert.alert("Data Inválida", "O relatório não pode filtrar datas futuras.");
            return;
        }

        if (pickerMode === 'dataInicio' && filters.dataFim) {
            const fim = parseDatePtBr(filters.dataFim);
            selectedDate.setHours(0,0,0,0);
            fim.setHours(0,0,0,0);
            if (selectedDate > fim) {
                Alert.alert("Período Inválido", "A data de início não pode ser depois da data de fim.");
                return;
            }
        }

        if (pickerMode === 'dataFim' && filters.dataInicio) {
            const inicio = parseDatePtBr(filters.dataInicio);
            selectedDate.setHours(0,0,0,0);
            inicio.setHours(0,0,0,0);
            if (selectedDate < inicio) {
                Alert.alert("Período Inválido", "A data de fim não pode ser antes da data de início.");
                return;
            }
        }

        setFilters(prev => ({ ...prev, [pickerMode]: formatted }));
    }
    if (Platform.OS !== 'android') setShowPicker(false);
  };

  const limparData = (campo) => {
      setFilters(prev => ({ ...prev, [campo]: null }));
  };

  useEffect(() => {
    setLoading(true);
    const unsubA = listenRelatorios((lista) => {
      setAtendimentos(lista || []);
      setLoading(false);
    });
    const unsubS = listenServicos((lista) => {
      setServicosList((lista || []).map((s) => ({ id: s.id || s.sid, nome: s.nome || s })));
    });
    const unsubC = listenClientes((lista) => {
      setClientesList((lista || []).map((c) => ({ id: c.id || c.cid, nome: c.nome || c })));
    });
    const unsubF = listenFuncionarios((lista) => {
      setFuncionariosList((lista || []).map((f) => ({ id: f.uid || f.id, nome: f.nome || f })));
    });

    return () => {
      if (unsubA) unsubA(); if (unsubS) unsubS(); if (unsubC) unsubC(); if (unsubF) unsubF();
    };
  }, []);

  useEffect(() => {
    let lista = atendimentos;

    lista = lista.filter(a => {
        const status = a.status || 'Pendente';
        const isPast = (d, h) => {
            if (!d) return false;
            const dt = parseDatePtBr(d);
            if (!dt) return false;
            if (h) {
                const [hh, mm] = h.split(':').map(Number);
                dt.setHours(hh||0, mm||0);
            } else { dt.setHours(23,59,59); }
            return dt < new Date();
        };
        return status === 'Concluido' || status === 'Concluído' || isPast(a.data, a.horario);
    });

    if (filters.dataInicio) {
      const dtInicio = parseDatePtBr(filters.dataInicio);
      if (dtInicio) {
          dtInicio.setHours(0, 0, 0, 0);
          lista = lista.filter(a => {
            const dtAgenda = parseDatePtBr(a.data);
            return dtAgenda && dtAgenda >= dtInicio;
          });
      }
    }

    if (filters.dataFim) {
      const dtFim = parseDatePtBr(filters.dataFim);
      if (dtFim) {
          dtFim.setHours(23, 59, 59, 999);
          lista = lista.filter(a => {
            const dtAgenda = parseDatePtBr(a.data);
            return dtAgenda && dtAgenda <= dtFim;
          });
      }
    }

    if (filters.servico.length > 0) {
      lista = lista.filter(a => {
        const s = a.servicos || a.servico || [];
        const items = Array.isArray(s) ? s : [s];
        const itemIds = items.map(i => (typeof i === 'object' && i !== null) ? (i.id || i.sid) : i);
        return filters.servico.some(fid => itemIds.includes(fid));
      });
    }

    if (filters.profissional.length > 0) {
      lista = lista.filter(a => {
        const p = a.profissionais || a.profissional || [];
        const items = Array.isArray(p) ? p : [p];
        const itemIds = items.map(i => (typeof i === 'object' && i !== null) ? (i.id || i.uid) : i);
        return filters.profissional.some(fid => itemIds.includes(fid));
      });
    }

    setFilteredRelatorios(lista);
  }, [atendimentos, filters]);

  const getClienteNome = (clienteId) => {
    if (!clienteId) return "Não informado";
    if (typeof clienteId === 'object') return clienteId.nome || "Cliente";
    const c = clientesList.find((i) => i.id === clienteId);
    return c ? c.nome : clienteId;
  };
  const getFuncionarioNome = (ids) => {
    if (!ids) return "Não informado";
    const arr = Array.isArray(ids) ? ids : [ids];
    return arr.map(targetId => {
        if (typeof targetId === 'object') return targetId.nome;
        const f = funcionariosList.find(i => i.id === targetId || i.uid === targetId);
        return f ? f.nome : "Desconhecido";
    }).join(", ");
  };
  const getServicoNome = (ids) => {
    if (!ids) return "Não informado";
    const arr = Array.isArray(ids) ? ids : [ids];
    return arr.map(id => {
        if (typeof id === 'object') return id.nome;
        const s = servicosList.find(i => i.id === id);
        return s ? s.nome : "Desconhecido";
    }).join(", ");
  };

  const formatDateHeader = (dateStr) => {
    const dt = parseDatePtBr(dateStr);
    if (!dt) return dateStr || "Sem Data";
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    if (dt.getTime() === hoje.getTime()) return `Hoje - ${dateStr}`;
    return dateStr;
  };

  const groups = filteredRelatorios.reduce((acc, a) => {
    const key = a.data || "Sem data";
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(groups).sort((d1, d2) => {
    const dt1 = parseDatePtBr(d1);
    const dt2 = parseDatePtBr(d2);
    if (!dt1 || !dt2) return d1.localeCompare(d2);
    return dt2.getTime() - dt1.getTime();
  });

  const abrirModal = (item) => { setAgendamentoSelecionado(item); setModalViewVisible(true); };
  const fecharModal = () => { setAgendamentoSelecionado(null); setModalViewVisible(false); };

  const gerarPDF = async () => {
    try {
      await generateRelatoriosPDF(
        filteredRelatorios,
        filters,
        {
          getClienteNome,
          getServicoNome,
          getFuncionarioNome
        }
      );
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header pageTitle="RELATÓRIOS" />
      <View style={styles.container}>
        <View style={styles.headerRow}>
             <Text style={styles.title}>Relatórios Concluídos</Text>
             <Button
                title="Gerar PDF"
                small
                onPress={() => gerarPDF()}
                style={styles.pdfButton}
             />
        </View>

        <View style={styles.extraFilters}>
            <View style={styles.dateRow}>
                <Pressable style={styles.dateChip} onPress={() => abrirDatePicker('dataInicio')}>
                    <Text style={styles.dateChipText}>{filters.dataInicio ? `De: ${filters.dataInicio}` : "De"}</Text>
                    {filters.dataInicio && (<TouchableOpacity onPress={() => limparData('dataInicio')} style={{marginRight: 4}}><Ionicons name="close-circle" size={16} color={theme.colors.textInput} /></TouchableOpacity>)}
                    <Ionicons name="calendar" size={16} color={theme.colors.textInput} />
                </Pressable>
                <Pressable style={styles.dateChip} onPress={() => abrirDatePicker('dataFim')}>
                    <Text style={styles.dateChipText}>{filters.dataFim ? `Até: ${filters.dataFim}` : "Até"}</Text>
                    {filters.dataFim && (<TouchableOpacity onPress={() => limparData('dataFim')} style={{marginRight: 4}}><Ionicons name="close-circle" size={16} color={theme.colors.textInput} /></TouchableOpacity>)}
                    <Ionicons name="calendar" size={16} color={theme.colors.textInput} />
                </Pressable>
            </View>

            <View style={styles.listFilters}>
                <Filter label="Profissionais" listItem={funcionariosList} onSelect={(p) => setFilters(prev => ({ ...prev, profissional: p || [] }))} />
                <Filter label="Serviços" listItem={servicosList} onSelect={(s) => setFilters(prev => ({ ...prev, servico: s || [] }))} />
            </View>
        </View>

        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Text style={{ color: theme.colors.text }}>Total: {filteredRelatorios.length}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {sortedDates.length === 0 ? (
              <Text style={styles.emptyMessage}>Nenhum relatório encontrado no período.</Text>
            ) : (
              sortedDates.map((dateKey) => {
                const items = groups[dateKey];
                return (
                  <View key={dateKey}>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>{formatDateHeader(dateKey)}</Text>
                    </View>
                    {items.map((a) => (
                      <Card
                        key={a.uid || a.id}
                        icon="checkmark-circle-outline"
                        title={`${getClienteNome(a.cliente)} - ${a.horario || ""}`}
                        subtitle={`${getServicoNome(a.servicos)} · ${getFuncionarioNome(a.profissionais)}`}
                        onView={() => abrirModal(a)}
                        style={styles.card}
                      />
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
      
      {showPicker && (
        <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onChangeDate}
        />
      )}

      <Modal visible={modalViewVisible} animationType="none" transparent={true} onRequestClose={fecharModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRight}>
                <View>
                  <Text style={styles.modalTitle}>Detalhes</Text>
                  <Text style={styles.modalSubtitle}>Registro concluído</Text>
                </View>
                <TouchableOpacity onPress={fecharModal} style={styles.closeButton}>
                    <Ionicons name="close" size={26} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
            {agendamentoSelecionado && (
                <View style={styles.modalInner}>
                    <View style={styles.topCard}>
                        <View style={styles.topCardLeft}>
                             <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} style={{marginRight: 10}}/>
                             <View style={{flex: 1}}>
                                 <Text style={styles.topCardTitle}>{getClienteNome(agendamentoSelecionado.cliente)}</Text>
                                 <Text style={styles.topCardSubtitle}>{agendamentoSelecionado.data} · {agendamentoSelecionado.horario}</Text>
                             </View>
                        </View>
                    </View>
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                             <View style={styles.detailCol}>
                                <Text style={styles.detailLabel}>Serviço</Text>
                                <Text style={styles.detailValue}>{getServicoNome(agendamentoSelecionado.servicos || agendamentoSelecionado.servico)}</Text>
                                <Text style={[styles.detailLabel, {marginTop: 10}]}>Valor</Text>
                                <Text style={styles.detailValue}>{agendamentoSelecionado.valor ? `R$ ${agendamentoSelecionado.valor}` : '-'}</Text>
                             </View>
                             <View style={styles.detailCol}>
                                <Text style={styles.detailLabel}>Profissional</Text>
                                <Text style={styles.detailValue}>{getFuncionarioNome(agendamentoSelecionado.profissionais || agendamentoSelecionado.profissional)}</Text>
                             </View>
                        </View>
                        {agendamentoSelecionado.observacoes ? (
                            <View style={{marginTop: 15}}>
                                <Text style={styles.detailLabel}>Observações</Text>
                                <Text style={styles.detailValue}>{agendamentoSelecionado.observacoes}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "700", color: theme.colors.text },
  
  extraFilters: { gap: 10 },
  dateRow: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  listFilters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  pdfButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 12 },

  dateChip: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: theme.colors.textInput,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: "white", marginRight: 5,
  },
  dateChipText: { marginRight: 6, color: theme.colors.textInput, fontSize: 12, fontWeight: '600' },

  dateContainer: { paddingVertical: 8 },
  dateText: { fontWeight: "700", color: theme.colors.text },
  card: { marginBottom: 10 },
  emptyMessage: { textAlign: "center", color: theme.colors.textInput, marginTop: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContainer: { backgroundColor: theme.colors.background, borderRadius: 16, width: "100%", maxWidth: 400, padding: 20, elevation: 5 },
  modalHeaderRight: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.text },
  modalSubtitle: { fontSize: 13, color: theme.colors.textInput },
  closeButton: { padding: 4 },
  topCard: { flexDirection: "row", backgroundColor: "white", padding: 12, borderRadius: 12, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: theme.colors.border || '#eee' },
  topCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  topCardTitle: { fontWeight: "700", fontSize: 16, color: theme.colors.text },
  topCardSubtitle: { color: theme.colors.textInput, fontSize: 13, marginTop: 2 },
  detailsCard: { backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border || '#eee' },
  detailRow: { flexDirection: "row" },
  detailCol: { flex: 1, paddingRight: 10 },
  detailLabel: { fontSize: 12, color: theme.colors.textInput, marginBottom: 4, fontWeight: '600' },
  detailValue: { color: theme.colors.text, fontWeight: "500", fontSize: 14 },
});