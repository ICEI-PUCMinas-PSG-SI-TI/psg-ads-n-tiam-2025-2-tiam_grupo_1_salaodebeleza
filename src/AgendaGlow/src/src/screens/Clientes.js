import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import {theme, modalStyle} from "../styles/theme";
import { listenClientes, deleteCliente } from "../services/clienteService";

export default function Clientes() {
  const navigation = useNavigation();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Modais genéricos (mensagem e confirmação)
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalMensagemVisible, setModalMensagemVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const abrirModalMensagem = (msg) => {
    setModalMensagem(msg);
    setModalMensagemVisible(true);
  };
  const fecharModalMensagem = () => setModalMensagemVisible(false);

  useEffect(() => {
    const unsubscribe = listenClientes((lista) => {
      setClientes(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalView = (cliente) => {
    setClienteSelecionado(cliente);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setModalViewVisible(false);
  };

  const handleExcluir = async () => {
    if (!clienteSelecionado?.cid) {
      abrirModalMensagem("ID do cliente não encontrado.");
      return;
    }

    fecharModalView();

    setTimeout(() => {
      setModalConfirmVisible(true);
    }, 100);
  };

  const confirmarExclusao = async () => {
    setModalConfirmVisible(false);
    setExcluindo(true);

    try {
      const result = await deleteCliente(clienteSelecionado.cid);

      if (result.success) {
        setClientes((prev) =>
          prev.filter((c) => c.cid !== clienteSelecionado.cid)
        );
        setClienteSelecionado(null);
        abrirModalMensagem("Cliente excluído com sucesso.");
      } else {
        abrirModalMensagem(result.message || "Falha ao excluir cliente.");
      }
    } catch (error) {
      abrirModalMensagem(
        error.message || "Erro inesperado ao excluir cliente."
      );
    } finally {
      setExcluindo(false);
    }
  };

  const handleEditar = () => {
    if (clienteSelecionado) {
      fecharModalView();
      navigation.navigate("ClienteCadastro", { id: clienteSelecionado.cid });
    }
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuário" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>
        <Button
          title="Adicionar +"
          small
          onPress={() => navigation.navigate("ClienteCadastro")}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {clientes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
            </View>
          ) : (
            clientes.map((c) => (
              <Card
                key={c.id}
                title={c.nome}
                subtitle={c.telefone || c.email || ""}
                onView={() => abrirModalView(c)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DE DETALHES */}
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
                <Text style={modalStyle.modalTitle}>Detalhes do Cliente</Text>
                <Text style={modalStyle.modalSubtitle}>
                  Informações rápidas e ações
                </Text>
              </View>

              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {clienteSelecionado && (
              <View style={modalStyle.modalInner}>
                {/* resumo curto no topo (cartão claro) */}
                <View style={modalStyle.topCard}>
                  <View style={modalStyle.topCardLeft}>
                    <View style={modalStyle.topCardIcon}>
                      <Ionicons
                        name="person-circle-outline"
                        size={18}
                        color={theme.colors.white}
                      />
                    </View>

                    <View style={modalStyle.topCardTextWrap}>
                      <Text style={modalStyle.topCardTitle} numberOfLines={1}>
                        {clienteSelecionado.nome}{" "}
                      </Text>
                      <Text
                        style={modalStyle.topCardSubtitle}
                        numberOfLines={1}
                      >
                        {"Criado em "}
                        {clienteSelecionado.criadoEm
                          ? new Date(
                              clienteSelecionado.criadoEm.seconds * 1000
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
                        {clienteSelecionado.nome}
                      </Text>


                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        E-mail
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {clienteSelecionado.email || "Não cadastrado"}
                      </Text>
                    </View>

                    <View style={modalStyle.detailCol}>
                      <Text style={modalStyle.detailLabel}>
                        Telefone
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {clienteSelecionado.telefone || "Não cadastrado"}
                      </Text>
                    </View>
                  </View>

                  {clienteSelecionado.observacoes ? (
                    <View style={{ marginTop: 12 }}>
                      <Text style={modalStyle.detailLabel}>Observações</Text>
                      <Text style={modalStyle.detailValue}>
                        {clienteSelecionado.observacoes}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* botões: editar (outline) e excluir (cheio) */}
                <View style={modalStyle.actionsRow}>
                  <Button
                    title="Editar"
                    onPress={handleEditar}
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

      {/* --- MODAL DE CONFIRMAÇÃO */}
      <Modal
        visible={modalConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Tem certeza que deseja excluir {clienteSelecionado?.nome}? Essa
              ação é irreversível.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalConfirmVisible(false)}
                style={{ marginRight: 8, backgroundColor: theme.colors.cancel }}
              />
              <Button title="Confirmar" onPress={confirmarExclusao} />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE MENSAGEM */}
      <Modal visible={modalMensagemVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Button title="OK" onPress={fecharModalMensagem} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  title: { fontSize: 20, fontWeight: "700", color: theme.colors.text },
  listContainer: { paddingHorizontal: theme.spacing.large, paddingBottom: 100 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textInput,
    fontSize: 16,
  }
});
