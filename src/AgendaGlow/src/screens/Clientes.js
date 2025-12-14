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
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success"); 

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

  const handleExcluir = () => {
    if (!clienteSelecionado?.cid) {
      abrirModalMensagem("ID do cliente não encontrado.");
      return;
    }

    fecharModalView();

    setTimeout(() => setModalConfirmVisible(true), 50);
  };

  const confirmarExclusao = async () => {
    setModalConfirmVisible(false);

    try {
      const result = await deleteCliente(clienteSelecionado.cid);

      if (result.success) {
        setClientes((prev) =>
          prev.filter((c) => c.cid !== clienteSelecionado.cid)
        );
        setClienteSelecionado(null);
        abrirModalMensagem("Cliente excluído com sucesso.", "success");
      } else {
        abrirModalMensagem(result.message || "Falha ao excluir cliente.", "error");
      }
    } catch (error) {
      abrirModalMensagem(
        error.message || "Erro inesperado ao excluir cliente.", "error"
      );
    } finally {
      setExcluindo(false);
    }
  };

    const abrirModalMensagem = (msg, type = "success") => {
      setMessageText(msg);
      setMessageType(type);
      setModalMessageVisible(true);
    };
    const fecharModalMensagem = () => {
      setModalMessageVisible(false);
    };

  const handleEditar = () => {
    if (clienteSelecionado) {
      fecharModalView();
      navigation.navigate("ClienteCadastro", { id: clienteSelecionado.cid });
    }
  };

  return (
    <View style={styles.container}>
      <Header pageTitle={"CLIENTES"}/>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Lista de clientes</Text>
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

      <Modal
        visible={modalConfirmVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={modalStyle.modalOverlay}>
          <View style={modalStyle.modalContainer}>
            <Text style={modalStyle.modalTitle}>Confirmar exclusão</Text>
            <Text style={modalStyle.modalSubtitle}>
              Tem certeza que deseja excluir {clienteSelecionado?.nome}? Essa
              ação é irreversível.
            </Text>

            <View style={{ marginTop: 20, flexDirection: "row", gap: 10 }}>
              <Button
                title="Cancelar"
                onPress={() => setModalConfirmVisible(false)}
                style={{
                  backgroundColor: theme.colors.white,
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  flex: 1,
                }}
                textStyle={{ color: theme.colors.primary, fontWeight: "700" }}
              />

              <Button
                title="Excluir"
                onPress={confirmarExclusao}
                style={{
                  backgroundColor: theme.colors.primary,
                  flex: 1,
                }}
                textStyle={{ color: theme.colors.white, fontWeight: "700" }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalMessageVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalMessageVisible(false)}
      >
        <View style={modalStyle.modalOverlay}>
          <View style={modalStyle.modalContainer}>
            <Text
              style={[
                modalStyle.modalTitle,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              {messageType === "success" ? "Sucesso" : "Atenção"}
            </Text>

            <Text
              style={[
                modalStyle.modalSubtitle,
                {
                  color: theme.colors.textInput,
                  marginTop: 10,
                },
              ]}
            >
              {messageText}
            </Text>

            <Button
              title="OK"
              onPress={fecharModalMensagem}
              style={{
                backgroundColor: theme.colors.primary,
                marginTop: 20,
              }}
              textStyle={{ color: theme.colors.white, fontWeight: "700" }}
            />
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
