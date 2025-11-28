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
import { theme, modalStyle } from "../styles/theme";
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
  const [filters, setFilters] = useState({
    date: null,
    profissional: [],
    servico: [],
  });
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
      lista = lista.filter((a) => a.data === filters.date);
    }

    if (filters.servico && filters.servico.length > 0) {
      lista = lista.filter((a) => {
        if (!a.servicos) return false;
        const servicosArray = Array.isArray(a.servicos)
          ? a.servicos
          : [a.servicos];
        return filters.servico.some((selectedId) =>
          servicosArray.includes(selectedId)
        );
      });
    }

    if (filters.profissional && filters.profissional.length > 0) {
      lista = lista.filter((a) => {
        if (!a.profissionais) return false;
        const profissionaisArray = Array.isArray(a.profissionais)
          ? a.profissionais
          : [a.profissionais];
        return filters.profissional.some((selectedId) =>
          profissionaisArray.includes(selectedId)
        );
      });
    }

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
        <FilterDate
          onSelect={(date) => {
            setFilters((prev) => ({ ...prev, date }));
          }}
        ></FilterDate>
        <Filter
          label="Profissionais"
          listItem={funcionarios}
          onSelect={(profissionais) => {
            setFilters((prev) => ({
              ...prev,
              profissional: profissionais || [],
            }));
          }}
        ></Filter>
        <Filter
          label="Serviços"
          listItem={servicos}
          onSelect={(servicos) => {
            setFilters((prev) => ({ ...prev, servico: servicos || [] }));
          }}
        ></Filter>
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
              style={{ textAlign: "center", color: theme.colors.textInput }}
            >
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
                        title={`${getClienteNome(a.cliente)} - ${
                          a.horario || "Sem horário"
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
        <View style={modalStyle.modalOverlay}>
          <View style={modalStyle.modalContainer}>
            <View style={modalStyle.modalHeaderRight}>
              <View>
                <Text style={modalStyle.modalTitle}>
                  Detalhes do Agendamento
                </Text>
                <Text style={modalStyle.modalSubtitle}>
                  Informações rápidas e ações
                </Text>
              </View>

              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {agendamentoSelecionado && (
              <View style={modalStyle.modalInner}>
                {/* resumo curto no topo (cartão claro) */}
                <View style={modalStyle.topCard}>
                  <View style={modalStyle.topCardLeft}>
                    <View style={modalStyle.topCardIcon}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={theme.colors.white}
                      />
                    </View>

                    <View style={modalStyle.topCardTextWrap}>
                      <Text style={modalStyle.topCardTitle} numberOfLines={1}>
                        {getClienteNome(agendamentoSelecionado.cliente)}{" "}
                        {agendamentoSelecionado.horario
                          ? `· ${agendamentoSelecionado.horario}`
                          : ""}
                      </Text>
                      <Text
                        style={modalStyle.topCardSubtitle}
                        numberOfLines={1}
                      >
                        {"Criado em "}
                        {agendamentoSelecionado.criadoEm
                          ? new Date(
                              agendamentoSelecionado.criadoEm.seconds * 1000
                            ).toLocaleDateString()
                          : "Data não disponível"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* cartão branco com detalhes em duas colunas */}
                <View style={modalStyle.detailsCard}>
                  <View style={modalStyle.detailRow}>
                    <View style={modalStyle.detailCol}>
                      <Text style={modalStyle.detailLabel}>Cliente</Text>
                      <Text style={modalStyle.detailValue}>
                        {getClienteNome(agendamentoSelecionado.cliente)}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        Profissional
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {getFuncionarioNome(
                          agendamentoSelecionado.profissionais ||
                            agendamentoSelecionado.profissional
                        )}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        Data
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {agendamentoSelecionado.data}
                      </Text>
                    </View>

                    <View style={modalStyle.detailCol}>
                      <Text style={modalStyle.detailLabel}>Serviço</Text>
                      <Text style={modalStyle.detailValue}>
                        {getServicoNome(
                          agendamentoSelecionado.servicos ||
                            agendamentoSelecionado.servico
                        )}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        Valor
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {agendamentoSelecionado?.valor
                          ? `R$ ${Number(agendamentoSelecionado.valor).toFixed(
                              2
                            )}`
                          : "Não informado"}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        Horário
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {agendamentoSelecionado.horario || "Não informado"}
                      </Text>
                    </View>
                  </View>

                  {agendamentoSelecionado.observacoes ? (
                    <View style={{ marginTop: 12 }}>
                      <Text style={modalStyle.detailLabel}>Observações</Text>
                      <Text style={modalStyle.detailValue}>
                        {agendamentoSelecionado.observacoes}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* botões: editar (outline) e excluir (cheio) */}
                <View style={modalStyle.actionsRow}>
                  <Button
                    title="Editar"
                    onPress={() => {
                      fecharModalView();
                      navigation.navigate("AgendamentoEditar", {
                        agendamento: agendamentoSelecionado,
                      });
                    }}
                    style={modalStyle.editButton}
                    textStyle={modalStyle.editButtonText}
                  />

                  <Button
                    title="Excluir"
                    onPress={handleExcluir}
                    style={modalStyle.deleteButton}
                    textStyle={modalStyle.deleteButtonText}
                  />
                </View>
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
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: theme.spacing.large,
    gap: 7,
    marginRight: theme.spacing.large,
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
    backgroundColor: theme.colors.container4,
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    padding: 18,
    elevation: 12,
  },
  modalHeaderRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.textInput,
    marginTop: 4,
  },
  modalInner: {
    marginTop: 6,
  },
  topCard: {
    borderRadius: 10,
    marginBottom: 12,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topCardIcon: {
    marginBottom: 0,
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: theme.radius.medium,
    borderColor: theme.colors.border,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  topCardTextWrap: {
    flex: 1,
  },
  topCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  topCardSubtitle: {
    fontSize: 13,
    color: theme.colors.textInput,
    marginTop: 6,
  },

  topCardViewButton: {
    backgroundColor: theme.colors.white,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailCol: {
    flex: 1,
    paddingRight: 8,
  },
  detailLabel: {
    fontWeight: "700",
    color: theme.colors.primary,
    fontSize: 13,
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: 15,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  editButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    width: "48%",
    marginTop: 8,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: theme.colors.primary,
    width: "48%",
    marginTop: 8,
  },
  deleteButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});
