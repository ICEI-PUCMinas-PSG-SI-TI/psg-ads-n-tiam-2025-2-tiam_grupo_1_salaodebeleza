import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import { theme, modalStyle } from "../styles/theme";
import {
  listenFuncionarios,
  deleteFuncionario,
} from "../services/funcionarioService";
import { Ionicons } from "@expo/vector-icons";

export default function Funcionarios({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalFeedbackVisible, setModalFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  useEffect(() => {
    const unsubscribe = listenFuncionarios((lista) => {
      setFuncionarios(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalView = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setModalViewVisible(false);
  };

  const confirmarExclusao = () => {
    fecharModalView();
    setModalConfirmVisible(true);
  };

  const handleExcluirConfirmado = async () => {
    if (!funcionarioSelecionado) return;

    console.log("Selecionado:", funcionarioSelecionado);

    setModalConfirmVisible(false);
    setLoading(true);

    try {
      const result = await deleteFuncionario(funcionarioSelecionado.uid);

      if (result.success) {
        setFeedbackMessage("Profissional excluído com sucesso!");
        setFuncionarios((prev) =>
          prev.filter((f) => f.uid !== funcionarioSelecionado.uid)
        );
        setFuncionarioSelecionado(null);
        fecharModalView();
      } else {
        setFeedbackMessage(result.message || "Falha ao excluir profissional.");
      }
    } catch (error) {
      setFeedbackMessage(
        error.message || "Erro desconhecido ao excluir profissional."
      );
    } finally {
      setLoading(false);
      setModalFeedbackVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header pageTitle={"EQUIPE"}/>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Profissionais</Text>
        <Button
          title="Adicionar +"
          small
          onPress={() => navigation.navigate("FuncionarioCadastro")}
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
          {funcionarios.length === 0 ? (
            <Text
              style={{ textAlign: "center", color: theme.colors.textInput }}
            >
              Nenhum profissional cadastrado.
            </Text>
          ) : (
            funcionarios.map((f) => (
              <Card
                icon="people-outline"
                key={f.id}
                title={f.nome}
                subtitle={f.cargo}
                onView={() => abrirModalView(f)}
                image={f.fotoUrl}
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
                <Text style={modalStyle.modalTitle}>Detalhes do Funcionário</Text>
                <Text style={modalStyle.modalSubtitle}>
                  Informações rápidas e ações
                </Text>
              </View>

              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {funcionarioSelecionado && (
              <View style={modalStyle.modalInner}>
                <View style={modalStyle.topCard}>
                  <View style={modalStyle.topCardLeft}>
                    <View style={modalStyle.topCardIcon}>
                      <Ionicons
                        name="people-outline"
                        size={18}
                        color={theme.colors.white}
                      />
                    </View>

                    <View style={modalStyle.topCardTextWrap}>
                      <Text style={modalStyle.topCardTitle} numberOfLines={1}>
                        {funcionarioSelecionado.nome}{" "}
                      </Text>
                      <Text
                        style={modalStyle.topCardSubtitle}
                        numberOfLines={1}
                      >
                        {"Criado em "}
                        {funcionarioSelecionado.criadoEm
                          ? new Date(
                              funcionarioSelecionado.criadoEm.seconds * 1000
                            ).toLocaleDateString()
                          : "Data não disponível"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={modalStyle.detailsCard}>
                  <View style={modalStyle.detailRow}>
                    <View style={modalStyle.detailCol}>
                      <Text style={modalStyle.detailLabel}>Nome</Text>
                      <Text style={modalStyle.detailValue}>
                        {funcionarioSelecionado.nome}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>
                        Cargo
                      </Text>
                      <Text style={modalStyle.detailValue}>
                        {funcionarioSelecionado.cargo || "Não cadastrado"}
                      </Text>
                    </View>

                    <View style={modalStyle.detailCol}>
                      <Text style={modalStyle.detailLabel}>Telefone</Text>
                      <Text style={modalStyle.detailValue}>
                        {funcionarioSelecionado.telefone || "Não cadastrado"}
                      </Text>

                      <Text style={[modalStyle.detailLabel, { marginTop: 12 }]}>E-mail</Text>
                      <Text style={modalStyle.detailValue}>
                        {funcionarioSelecionado.email || "Não cadastrado"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={modalStyle.actionsRow}>
                  <Button
                    title="Excluir"
                    onPress={confirmarExclusao}
                    style={[modalStyle.deleteButton, {width: '100%'}]}
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

            <Text style={[modalStyle.modalSubtitle, { marginTop: 10 }]}>
              Tem certeza que deseja excluir {funcionarioSelecionado?.nome}? Essa ação é irreversível.
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
                textStyle={{
                  color: theme.colors.primary,
                  fontWeight: "700",
                }}
              />

              <Button
                title="Excluir"
                onPress={handleExcluirConfirmado}
                style={{
                  backgroundColor: theme.colors.primary,
                  flex: 1,
                }}
                textStyle={{
                  color: theme.colors.white,
                  fontWeight: "700",
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalFeedbackVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalFeedbackVisible(false)}
      >
        <View style={modalStyle.modalOverlay}>
          <View style={modalStyle.modalContainer}>
            <Text
              style={[
                modalStyle.modalTitle,
                { color: theme.colors.primary },
              ]}
            >
              Sucesso
            </Text>

            <Text
              style={[
                modalStyle.modalSubtitle,
                { marginTop: 10,},
              ]}
            >
              {feedbackMessage}
            </Text>

            <Button
              title="OK"
              onPress={() => setModalFeedbackVisible(false)}
              style={{ backgroundColor: theme.colors.primary, marginTop: 20 }}
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: theme.spacing.large,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing.medium,
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
