import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import Filter from "../components/Filter";
import FilterDate from "../components/FilterDate";
import { theme } from "../styles/theme";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import { generateRelatoriosPDF } from "../services/relatorioPdfService";

// Serviços
import { listenRelatorios } from "../services/agendamentoService";
import { listenServicos } from "../services/servicoService";
import { listenClientes } from "../services/clienteService";
import { listenFuncionarios } from "../services/funcionarioService";

export default function Relatorios() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    date: null,
    servico: [],
    profissional: [],
  });

  const [servicosList, setServicosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [funcionariosList, setFuncionariosList] = useState([]);
  const [filteredRelatorios, setFilteredRelatorios] = useState([]);

  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  // --- Carregamento Inicial ---
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
      // Guardamos o objeto completo para ter acesso ao 'id' (doc) e 'uid' (auth)
      setFuncionariosList(lista);
    });

    return () => {
      if (unsubA) unsubA();
      if (unsubS) unsubS();
      if (unsubC) unsubC();
      if (unsubF) unsubF();
    };
  }, []);

  // --- Helpers de Busca Robusta ---
  const getFuncionarioNome = (ids) => {
    if (!ids) return "Não informado";
    
    // Garante que é array
    const idsArray = Array.isArray(ids) ? ids : [ids];
    
    return idsArray.map(targetId => {
        // 1. Se o ID já for um objeto com nome, usa-o
        if (typeof targetId === 'object' && targetId.nome) return targetId.nome;
        
        // 2. Busca na lista comparando tanto 'id' como 'uid'
        const f = funcionariosList.find(item => 
            item.id === targetId || item.uid === targetId
        );
        
        return f ? f.nome : "Desconhecido";
    }).join(", ");
  };

  const getClienteNome = (clienteId) => {
    if (!clienteId) return "Não informado";
    if (typeof clienteId === 'object' && clienteId.nome) return clienteId.nome;
    
    const cliente = clientesList.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : (typeof clienteId === 'string' ? clienteId : "Cliente");
  };

  const getServicoNome = (ids) => {
    if (!ids) return "Não informado";
    const idsArray = Array.isArray(ids) ? ids : [ids];
    return idsArray.map(id => {
        if (typeof id === 'object' && id.nome) return id.nome;
        
        const s = servicosList.find(item => item.id === id);
        return s ? s.nome : "Desconhecido";
    }).join(", ");
  };

  // --- Resto da Lógica (Filtros, Datas, Modal) ---
  
  const parseDatePtBr = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };
  
  // Verifica data passada
  const isPast = (dateStr, timeStr) => {
    if (!dateStr) return false;
    const schedDate = parseDatePtBr(dateStr);
    if (!schedDate) return false;
    if (timeStr) {
      const [hh, mm] = timeStr.split(':').map(Number);
      schedDate.setHours(hh || 0, mm || 0);
    } else {
      schedDate.setHours(23, 59, 59);
    }
    return schedDate < new Date();
  };

  // Filtragem
  useEffect(() => {
    let lista = atendimentos;

    // Status "Concluído" ou Data Passada
    lista = lista.filter(a => {
        const status = a.status || 'Pendente';
        const passado = isPast(a.data, a.horario);
        return status === 'Concluido' || status === 'Concluído' || passado;
    });

    if (filters.date) {
      lista = lista.filter(a => a.data === filters.date);
    }

    if (filters.servico && filters.servico.length > 0) {
      lista = lista.filter(a => {
        const s = a.servicos || a.servico || [];
        const items = Array.isArray(s) ? s : [s];
        const itemIds = items.map(i => (typeof i === 'object' && i !== null) ? (i.id || i.sid) : i);
        return filters.servico.some(fid => itemIds.includes(fid));
      });
    }

    if (filters.profissional && filters.profissional.length > 0) {
      lista = lista.filter(a => {
        const p = a.profissionais || a.profissional || [];
        const items = Array.isArray(p) ? p : [p];
        const itemIds = items.map(i => (typeof i === 'object' && i !== null) ? (i.id || i.uid) : i);
        // Compara com ID ou UID
        return filters.profissional.some(fid => itemIds.includes(fid));
      });
    }

    setFilteredRelatorios(lista);
  }, [atendimentos, filters]);

  const formatDateHeader = (dateStr) => {
    const dt = parseDatePtBr(dateStr);
    if (!dt) return dateStr;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dt.setHours(0, 0, 0, 0);
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

  const abrirModalView = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setAgendamentoSelecionado(null);
    setModalViewVisible(false);
  };

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
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Relatórios" />
      <View style={styles.container}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Relatórios</Text>

          <Button
            title="Gerar PDF"
            small
            onPress={() => gerarPDF()}
          />
        </View>

        <View style={styles.extraFilters}>
          <FilterDate onSelect={(d) => setFilters(p => ({ ...p, date: d }))} />
          <Filter
            label="Profissionais"
            listItem={funcionariosList}
            onSelect={(p) => setFilters((prev) => ({ ...prev, profissional: p || [] }))}
          />
          <Filter
            label="Serviços"
            listItem={servicosList}
            onSelect={(s) => setFilters((prev) => ({ ...prev, servico: s || [] }))}
          />
        </View>

        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Text style={{ color: theme.colors.text }}>
            Total Concluídos: {filteredRelatorios.length}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {sortedDates.length === 0 ? (
              <Text style={styles.emptyMessage}>Nenhum relatório encontrado.</Text>
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
                        subtitle={`${getServicoNome(a.servicos)} · ${getFuncionarioNome(a.profissionais || a.profissional)}`}
                        onView={() => abrirModalView(a)}
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
      
      {/* Modal Visualização */}
      <Modal visible={modalViewVisible} animationType="none" transparent={true} onRequestClose={fecharModalView}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRight}>
                <View>
                  <Text style={styles.modalTitle}>Detalhes</Text>
                  <Text style={styles.modalSubtitle}>Registro concluído</Text>
                </View>
                <TouchableOpacity onPress={fecharModalView} style={styles.closeButton}>
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
                                <Text style={styles.detailValue}>
                                    {getServicoNome(agendamentoSelecionado.servicos || agendamentoSelecionado.servico)}
                                </Text>
                                <Text style={[styles.detailLabel, {marginTop: 10}]}>Valor</Text>
                                <Text style={styles.detailValue}>
                                    {agendamentoSelecionado.valor ? `R$ ${agendamentoSelecionado.valor}` : '-'}
                                </Text>
                             </View>
                             <View style={styles.detailCol}>
                                <Text style={styles.detailLabel}>Profissional</Text>
                                <Text style={styles.detailValue}>
                                    {getFuncionarioNome(agendamentoSelecionado.profissionais || agendamentoSelecionado.profissional)}
                                </Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "700", color: theme.colors.text },
  extraFilters: { flexDirection: "row", gap: 8, flexWrap: 'wrap' },
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