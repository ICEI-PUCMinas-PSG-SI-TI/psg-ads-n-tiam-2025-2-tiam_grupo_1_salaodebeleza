import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import Header from "../components/Header";
import Square from "../components/Square";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { theme, modalStyle } from "../styles/theme";
import { listenProximosAgendamentosAdmin, listenProximosAgendamentosPorProfissional, listenAgendamentosPorData } from "../services/agendamentoService";
import { listenClientes } from "../services/clienteService";
import { getFuncionarioByUid, listenFuncionarios } from "../services/funcionarioService";
import { listenServicos } from "../services/servicoService";
import { Ionicons } from "@expo/vector-icons";
// import { getUser } from "../services/loginService"; // not used
import { auth } from "../database/firebase";

export default function Home() {
  const [maisProximos, setMaisProximos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLogado, setUserLogado] = useState(null);
  const [clientesHoje, setClientesHoje] = useState(0);
  const [agendamentosHojeCount, setAgendamentosHojeCount] = useState(0);
  const [receitaHoje, setReceitaHoje] = useState(0);
  const [servicosHojeCount, setServicosHojeCount] = useState(0);

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

  const getClienteNome = (clienteId) => {
    if (!clienteId) return "Não informado";
    const cliente = clientes.find((c) => c.cid === clienteId);
    return cliente ? cliente.nome : clienteId || "Não informado";
  };

  // We'll create the listeners inside the useEffect to ensure auth.currentUser is available
  useEffect(() => {
    const currentUnsub = { agendamentos: () => {} };
    currentUnsub.metrics = () => {};

    const buscarAgendamentosProximos = async () => {
      const logado = auth.currentUser;
      if (!logado) {
        setMaisProximos([]);
        setLoading(false);
        return;
      }

      // init a noop unsubscribe to ensure cleanup works
      let unsubscribeAgendamentos = () => {};
      let funcionarioDoc = null;

      if (logado.email === "admin@gmail.com") {
        unsubscribeAgendamentos = listenProximosAgendamentosAdmin((lista) => {
          setMaisProximos(lista);
          setLoading(false);
        });
      } else {
        try {
          const res = await getFuncionarioByUid(logado.uid);
          funcionarioDoc = res && res.success ? res.data : null;
          if (res.success && res.data && res.data.id) {
            unsubscribeAgendamentos = listenProximosAgendamentosPorProfissional(
              res.data.id,
              logado.email,
              (lista) => {
                setMaisProximos(lista);
                setLoading(false);
              }
            );
          } else {
            setMaisProximos([]);
            setLoading(false);
          }
        } catch (error) {
          console.error('Erro ao buscar funcionário por UID:', error);
          setMaisProximos([]);
          setLoading(false);
        }
      }

      // store unsubscribe on outer variable and use cleanup on unmount
      currentUnsub.agendamentos = unsubscribeAgendamentos;

      // Agora também inscrevemos para métricas do dia (agendamentos de hoje)
      const hojeStr = new Date();
      const dataStr = hojeStr.toLocaleDateString('pt-BR');
      const unsubscribeMetrics = listenAgendamentosPorData(dataStr, (lista) => {
        // lista contém todos os agendamentos de hoje (ativos). Filtrar por usuário quando necessário.
        let items = lista || [];
        if (logado.email !== 'admin@gmail.com') {
          // filtrar por profissional (compatibilidade com campos antigos)
          const profissionalId = (funcionarioDoc && funcionarioDoc.id) ? funcionarioDoc.id : null;
          const email = logado.email;
          items = items.filter((item) => {
            // checks for different storage formats
            if (Array.isArray(item.profissionais) && profissionalId) {
              if (item.profissionais.includes(profissionalId)) return true;
            }
            if (item.profissional && profissionalId) {
              if (item.profissional === profissionalId) return true;
            }
            if (email && item.email && item.email === email) return true;
            return false;
          });
        }

        // calcular métricas
        const clientesUnicos = new Set(items.map((i) => i.cliente)).size;
        const count = items.length;
        const receita = items.reduce((sum, i) => sum + (Number(i.valor) || 0), 0);
        // número total de serviços (somando arrays e campo único)
        const servicosCount = items.reduce((sum, i) => {
          if (Array.isArray(i.servicos)) return sum + i.servicos.length;
          if (i.servico) return sum + 1;
          return sum;
        }, 0);
        setClientesHoje(clientesUnicos);
        setAgendamentosHojeCount(count);
        setReceitaHoje(receita);
        setServicosHojeCount(servicosCount);
      });

      currentUnsub.metrics = unsubscribeMetrics;
    };

    const unsubscribeFuncionarios = listenFuncionarios((lista) => {
      setFuncionarios(lista);
    });

    const unsubscribeClientes = listenClientes((lista) => {
      setClientes(lista);
    });

    const unsubscribeServicos = listenServicos((lista) => {
      setServicos(lista);
    });

    // Run the initial action
    buscarAgendamentosProximos();

    return () => {
      // cleanup listeners
      currentUnsub.agendamentos && currentUnsub.agendamentos();
      currentUnsub.metrics && currentUnsub.metrics();
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

  const navigation = useNavigation();

  // Empty animation: scale and fade a calendar icon
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <Header
            pageTitle="INÍCIO"
            onNotificationPress={() => {}}
            onProfilePress={() => {}}
          />

          {/* Resumo do Dia */}
          <Text style={styles.sectionTitle}>Resumo do dia</Text>

          {/*Exibir algumas metricas para o usuario Logado*/}
          <View style={styles.summaryRow}>
              <Square
                icon="person-outline"
                title="Clientes hoje"
                number={String(clientesHoje)}
                color="#FFE9E0"
              />
            <Square
              icon="albums-outline"
              title="Serviços hoje"
              number={String(servicosHojeCount)}
              color="#FFE9E0"
            />
            <Square
              icon="cash-outline"
              title="Faturamento"
              number={receitaHoje ? `R$ ${receitaHoje.toFixed(2)}` : "R$ 0.00"}
              color="#FFE9E0"
            />
          </View>

          {/* Agenda Rápida */}
          <Text style={styles.sectionTitle}>Agenda Rápida</Text>
          <View style={styles.agendaList}>
            {maisProximos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Animated.View
                  style={[
                    styles.emptyIconWrap,
                    { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={96}
                    color={theme.colors.textInput}
                  />
                </Animated.View>
                <Text style={styles.emptyTitle}>Nenhum agendamento hoje</Text>
                <Text style={styles.emptySubtitle}>
                  Aproveite para verificar serviços ou adicionar novos
                  agendamentos.
                </Text>
              </View>
            ) : (
              maisProximos.map((a) => (
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
              ))
            )}
          </View>

          {/* Atalhos Rápidos */}
          <Text style={styles.sectionTitle}>Atalhos</Text>
          <View style={styles.shortcuts}>
            <Square
              icon="people-outline"
              title="Equipe"
              onPress={() => navigation.navigate("Funcionarios")}
              color="#FFE9E0"
            />
            <Square
              icon="logo-firebase"
              title="Serviços"
              color="#FFE9E0"
              onPress={() => navigation.navigate("Servicos")}
            />
            <Square
              icon="bar-chart-outline"
              title="Relatório"
              color="#FFE9E0"
              onPress={() => navigation.navigate("Relatorios")}
            />
          </View>
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
                    title="Ver Agendamentos"
                    onPress={() => navigation.navigate("Agenda")}
                    style={[, { width: "100%" }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  greeting: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  hello: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.textInput,
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: 20,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  agendaList: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  agendaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.large,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.light,
  },
  agendaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profilePicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.container3,
  },
  clientName: {
    fontWeight: "600",
    color: theme.colors.text,
    fontSize: 15,
  },
  service: {
    fontSize: 13,
    color: theme.colors.textInput,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  staff: {
    fontSize: 13,
    color: theme.colors.textInput,
    textAlign: "right",
  },
  shortcuts: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  emptyIconWrap: {
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    color: theme.colors.textInput,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textInput,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
