import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import {
  getFuncionarioByUid,
  updateFotoFuncionario,
} from "../services/funcionarioService";
import { logout } from "../services/loginService";
import { useImage } from "../hooks/useImage";

export default function Mais() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [loadingMeusDados, setLoadingMeusDados] = useState(false);
  const [funcionario, setFuncionario] = useState(null);
  const { uploadImage, pickImage, takeImage } = useImage();

  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalConfirmData, setModalConfirmData] = useState({
    title: "",
    message: "",
    onConfirm: null,
    customButtons: null,
  });

  useEffect(() => {
    if (!user) return;
    const loadFuncionario = async () => {
      const result = await getFuncionarioByUid(user.uid);
      if (result.success) {
        setFuncionario(result.data);
      }
    };
    loadFuncionario();
  }, [user]);

  const handleTrocarFoto = () => { 
    Alert.alert("Alterar foto", "Escolha uma opção", 
      [ { text: "Galeria", onPress: escolherGaleria }, 
        { text: "Câmera", onPress: abrirCamera }, 
        { text: "Cancelar", style: "cancel" }, 
      ]
    ); 
  }; 
  
  const escolherGaleria = async () => {
    try {
      const uri = await pickImage();
      if (!uri) return; processarUpload(uri);
    } catch (e) { 
      Alert.alert("Erro", e.message); 
    } 
  }; 
  
  const abrirCamera = async () => {
    try {
      const uri = await takeImage();
      if (!uri) return;
      processarUpload(uri); 
    } catch (e) {
      Alert.alert("Erro", e.message); 
    } 
  }; 
  
  const processarUpload = async (uri) => {
    try {
      Alert.alert("Aguarde", "Enviando foto..."); 
      const imageUrl = await uploadImage(uri); 
      await updateFotoFuncionario(user.uid, imageUrl); 
      setFuncionario((prev) => ({ ...prev, fotoUrl: imageUrl })
      ); 
      Alert.alert("Sucesso", "Foto atualizada!"); 
    } catch (error) {
      console.log(error); 
      Alert.alert("Erro", "Não foi possível enviar a foto."); 
    } 
  };
  
  const handleMeusDados = async () => {
    if (!user) {
      setModalConfirmData({
        title: "Sessão expirada",
        message: "Por favor, faça login novamente.",
        onConfirm: logout,
        customButtons: null,
      });
      setModalConfirmVisible(true);
      return;
    }

    setLoadingMeusDados(true);
    const result = await getFuncionarioByUid(user.uid);
    setLoadingMeusDados(false);

    if (result.success) {
      navigation.navigate("FuncionarioEditar", { funcionario: result.data });
    } else {
      setModalMessage(result.message || "Não foi possível buscar seus dados.");
      setModalMessageVisible(true);
    }
  };

  const handleLogoutConfirm = () => {
    setModalConfirmData({
      title: "Sair da conta",
      message: "Tem certeza que deseja sair?",
      onConfirm: logout,
      customButtons: null,
    });
    setModalConfirmVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header pageTitle={"MEUS DADOS"} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {funcionario && (
          <View style={styles.userCard}>
            <TouchableOpacity onPress={handleTrocarFoto}>
              <Image
                source={{
                  uri:
                    funcionario.fotoUrl ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            <Text style={styles.userName}>{funcionario.nome}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Mais opções</Text>

        <Button
          icon="briefcase-outline"
          title=" Serviços"
          onPress={() => navigation.navigate("Servicos")}
          style={{
            width: "100%",
          }}
          seta="true"
          spaceBetween={true}
        />
        <Button
          icon="bar-chart-outline"
          title=" Relatórios"
          onPress={() => navigation.navigate("Relatorios")}
          style={{
            width: "100%",
          }}
          seta="true"
          spaceBetween={true}
        />
        <Button
          icon="people-outline"
          title=" Equipe"
          onPress={() => navigation.navigate("Funcionarios")}
          style={{ width: "100%" }}
          seta="true"
          spaceBetween={true}
        />
        <Button
          icon="person-outline"
          title={loadingMeusDados ? "Carregando..." : " Alterar meus dados"}
          onPress={handleMeusDados}
          style={{ width: "100%" }}
          disabled={loadingMeusDados}
          seta="true"
          spaceBetween={true}
        />
        <Button
          icon="logo-google"
          title=" Vincular conta Google"
          onPress={() => navigation.navigate("VincularGoogle")}
          style={{ width: "100%", width: "100%" }}
          seta="true"
          spaceBetween={true}
        />
        <Button
          icon="log-out-outline"
          title=" Sair"
          onPress={handleLogoutConfirm}
          style={{ width: "100%", width: "100%" }}
          seta="true"
          spaceBetween={true}
        />
      </ScrollView>

      <Modal
        visible={modalMessageVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalMessageVisible(false)}
      >
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalContainer}>
            <Text
              style={[
                modalStyle.modalTitle,
                { color: theme.colors.primary }
              ]}
            >
              Aviso
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
              {modalMessage}
            </Text>

            <Button
              title="OK"
              onPress={() => setModalMessageVisible(false)}
              style={{
                backgroundColor: theme.colors.primary,
                marginTop: 20,
              }}
              textStyle={{
                color: theme.colors.white,
                fontWeight: "700",
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalConfirmVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalContainer}>
            <Text style={modalStyle.modalTitle}>{modalConfirmData.title}</Text>

            <Text style={modalStyle.modalSubtitle}>
              {modalConfirmData.message}
            </Text>

            <View style={{ marginTop: 20, flexDirection: "row", gap: 10 }}>
              {modalConfirmData.customButtons ? (
                modalConfirmData.customButtons.map((btn, idx) => (
                  <Button
                    key={idx}
                    title={btn.label}
                    onPress={() => {
                      setModalConfirmVisible(false);
                      btn.action();
                    }}
                    style={{
                      backgroundColor: theme.colors.primary,
                      flex: 1,
                    }}
                    textStyle={{
                      color: theme.colors.white,
                      fontWeight: "700",
                    }}
                  />
                ))
              ) : (
                <>
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
                    title="Confirmar"
                    onPress={() => {
                      setModalConfirmVisible(false);
                      modalConfirmData.onConfirm?.();
                    }}
                    style={{
                      backgroundColor: theme.colors.primary,
                      flex: 1,
                    }}
                    textStyle={{
                      color: theme.colors.white,
                      fontWeight: "700",
                    }}
                  />
                </>
              )}
            </View>
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
    alignItems: "center",
    paddingBottom: 100,
  },

  userCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: "#eee",
    resizeMode: "cover",
    backgroundColor: theme.colors.background,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary || "#555",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    alignSelf: "flex-start",
    marginBottom: theme.spacing.medium,
  },
});

const modalStyle= StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary || "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
  },
});