import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import {
  listenAgendamentos,
  deleteAgendamento,
} from "../services/agendamentoService";
import { listenFuncionarios } from "../services/funcionarioService";
import { listenServicos } from "../services/servicoService";
import { listenClientes } from "../services/clienteService";
import { Ionicons } from "@expo/vector-icons";
import Filter from "../components/Filter";
import FilterDate from "../components/FilterDate";

export default function Agenda() {
  const navigation = useNavigation();
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [filters, setFilters] = useState({ date: null, profissional: null, servico: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);

  // Função para formatar data no formato pt-BR
  const formatarDataHoje = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString("pt-BR");
  };

  const getFuncionarioNome = (ids) => {
    if (!ids) return "Não informado";
    if (Array.isArray(ids)) {
      return ids
        .map((id) => {
          const f = funcionarios.find((f) => f.id === id);
          return f ? f.nome : "Desconhecido";
        })
        .join(", ");
    }
    const funcionario = funcionarios.find((f) => f.id === ids);
    return funcionario ? funcionario.nome : "Não informado";
  };

  const getServicoNome = (ids) => {
    if (!ids) return "Não informado";
    if (Array.isArray(ids)) {
      return ids
        .map((id) => {
          const s = servicos.find((s) => s.id === id);
          return s ? s.nome : "Desconhecido";
        })
        .join(", ");
    }
    const servico = servicos.find((s) => s.id === ids);
    return servico ? servico.nome : "Não informado";
  };

  // Converte string 'dd/mm/yyyy' para objeto Date (local)
  const parseDatePtBr = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map((p) => parseInt(p, 10));
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
      return null;
    return new Date(year, month - 1, day);
  };

  // Função para obter nome do cliente (mock por enquanto)
  const getClienteNome = (clienteId) => {
    if (!clienteId) return "Não informado";
    const cliente = clientes.find((c) => c.cid === clienteId);
    return cliente ? cliente.nome : clienteId || "Não informado";
  };

  // Formata cabeçalho de data: mostra 'Hoje - dd/mm/yyyy' quando aplicável
  const formatDateHeader = (dateStr) => {
    if (!dateStr) return "Sem data";
    const dt = parseDatePtBr(dateStr);
    if (!dt) return dateStr;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dt.setHours(0, 0, 0, 0);
    if (dt.getTime() === hoje.getTime()) {
      return `Hoje - ${dateStr}`;
    }
    return dateStr;
  };

  useEffect(() => {
    const unsubscribeAgendamentos = listenAgendamentos((lista) => {
      setAgendamentos(lista);
      // Filtrar agendamentos a partir do dia atual (hoje em diante)
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const agendamentosFuturos = lista.filter((a) => {
        const dt = parseDatePtBr(a.data);
        if (!dt) return false; // ignora registros sem data válida
        dt.setHours(0, 0, 0, 0);
        return dt.getTime() >= hoje.getTime();
      });
      setAgendamentosDoDia(agendamentosFuturos);
      setLoading(false);
    });

    const unsubscribeFuncionarios = listenFuncionarios((lista) => {
      setFuncionarios(lista);
    });

    const unsubscribeClientes = listenClientes((lista) => {
      setClientes(lista);
    });

    const unsubscribeServicos = listenServicos((lista) => {
      setServicos(lista);
    });

    return () => {
      unsubscribeAgendamentos();
      unsubscribeFuncionarios();
      unsubscribeServicos();
      unsubscribeClientes();
    };
  }, []);

  const abrirModalView = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setAgendamentoSelecionado(null);
    setModalViewVisible(false);
  };

  // Função para excluir agendamento com confirmação
  const handleExcluir = async () => {
    if (!agendamentoSelecionado) return;

    Alert.alert(
      "Excluir agendamento",
      `Tem certeza que deseja excluir este agendamento?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const result = await deleteAgendamento(agendamentoSelecionado.id);

              if (result.success) {
                Alert.alert("Sucesso", "Agendamento excluído com sucesso!");
                setAgendamentosDoDia((prev) =>
                  prev.filter((a) => a.id !== agendamentoSelecionado.id)
                );
                fecharModalView();
              } else {
                Alert.alert(
                  "Erro",
                  result.message || "Falha ao excluir agendamento."
                );
              }
            } catch (error) {
              Alert.alert("Erro", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
  let lista = agendamentosDoDia;

  if (filters.date) {
    lista = lista.filter(a => a.data === filters.date);
  }

  if (filters.servico) {
    lista = lista.filter(a =>
      a.servicos?.includes(filters.servico)
    );
  }

  if (filters.profissional) {
    lista = lista.filter(a =>
      a.profissionais?.includes(filters.profissional)
    );
  }
  console.log(lista)
  setFilteredAgendamentos(lista);

}, [agendamentosDoDia, filters]);


  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Agenda</Text>
        <Button
          title="Adicionar +"
          small
          onPress={() => navigation.navigate("AgendamentoCadastro")}
        />
      </View>
      <View style={styles.containerFiltros}>
        <FilterDate onSelect={(date) => {
          setFilters((prev) => ({ ...prev, date }));
        }}></FilterDate>
        <Filter label="Profissionais" listItem={funcionarios} onSelect={(prof) => {
          setFilters((prev) => ({ ...prev, profissional: prof}))
        }}></Filter>
        <Filter label="Serviços" listItem={servicos} onSelect={(servico) => {
          setFilters((prev) => ({ ...prev, servico: servico}))
        }}></Filter>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredAgendamentos.length === 0 ? (
            <Text
              style={{ textAlign: "center", color: theme.colors.textInput }}>
              Nenhum agendamento para hoje.
            </Text>
          ) : (
            (() => {
              // Agrupa por data (a.data) e ordena as datas e os agendamentos por horário
              const groups = filteredAgendamentos.reduce((acc, a) => {
                const key = a.data || "Sem data";
                if (!acc[key]) acc[key] = [];
                acc[key].push(a);
                return acc;
              }, {});

              const sortedDates = Object.keys(groups).sort((d1, d2) => {
                const dt1 = parseDatePtBr(d1);
                const dt2 = parseDatePtBr(d2);
                if (!dt1 || !dt2) return d1.localeCompare(d2);
                return dt1.getTime() - dt2.getTime();
              });

              return sortedDates.map((dateKey) => {
                const items = groups[dateKey].slice();
                // ordenar por horário quando disponível ('HH:MM')
                items.sort((x, y) => {
                  const t1 = x.horario || "";
                  const t2 = y.horario || "";
                  if (!t1 && !t2) return 0;
                  if (!t1) return 1;
                  if (!t2) return -1;
                  return t1.localeCompare(t2);
                });

                return (
                  <View key={dateKey}>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>
                        {formatDateHeader(dateKey)}
                      </Text>
                    </View>
                    {items.map((a) => (
                      <Card
                        key={a.id}
                        icon="calendar-outline"
                        title={`${getClienteNome(a.cliente)} - ${a.horario || "Sem horário"
                          }`}
                        subtitle={`${getServicoNome(
                          a.servicos
                        )} · ${getFuncionarioNome(a.profissionais)}`}
                        onView={() => abrirModalView(a)}
                      />
                    ))}
                  </View>
                );
              });
            })()
          )}
        </ScrollView>
      )}

      {/* MODAL DE VISUALIZAÇÃO */}
      <Modal
        visible={modalViewVisible}
        animationType="none"
        transparent={true}
        onRequestClose={fecharModalView}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>
              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {agendamentoSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}>
                  <Text style={styles.label}>Cliente:</Text>{" "}
                  {getClienteNome(agendamentoSelecionado.cliente)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Serviço:</Text>{" "}
                  {getServicoNome(agendamentoSelecionado.servico)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Profissional:</Text>{" "}
                  {getFuncionarioNome(agendamentoSelecionado.profissional)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Data:</Text>{" "}
                  {agendamentoSelecionado.data}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Horário:</Text>{" "}
                  {agendamentoSelecionado.horario || "Não informado"}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Valor:</Text>{" "}
                  {agendamentoSelecionado.valor
                    ? `R$ ${agendamentoSelecionado.valor}`
                    : "Não informado"}
                </Text>
                {agendamentoSelecionado.observacoes && (
                  <Text style={styles.info}>
                    <Text style={styles.label}>Observações:</Text>{" "}
                    {agendamentoSelecionado.observacoes}
                  </Text>
                )}

                {/* Botão de excluir dentro do modal */}
                <Button
                  title="Excluir Agendamento"
                  onPress={handleExcluir}
                  style={{
                    backgroundColor: theme.colors.primary || "#FF4C4C",
                    marginTop: 20,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, gap: 10 },
  containerFiltros: {
    flexDirection: 'row',
    flexWrap: "nowrap",
    paddingLeft: theme.spacing.large,
    gap: 0,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
  },
  title: { fontSize: 20, fontWeight: "700", color: theme.colors.text },
  dateContainer: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.small,
    alignItems: "flex-start",
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textInput,
    fontWeight: "500",
    textAlign: "left",
  },
  listContainer: { paddingHorizontal: theme.spacing.large, paddingBottom: 100 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  modalContent: { marginTop: 10 },
  info: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  label: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
});
