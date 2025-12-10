import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
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

  // Carrega dados ao abrir a tela
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

  // Escolher foto
  const handleTrocarFoto = () => {
    Alert.alert("Alterar foto", "Escolha uma opção", [
      { text: "Galeria", onPress: escolherGaleria },
      { text: "Câmera", onPress: abrirCamera },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const escolherGaleria = async () => {
    try {
      const uri = await pickImage();
      if (!uri) return;

      processarUpload(uri);
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

      setFuncionario((prev) => ({ ...prev, fotoUrl: imageUrl }));

      Alert.alert("Sucesso", "Foto atualizada!");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar a foto.");
    }
  };

  // Lógica para alterar meus dados
  const handleMeusDados = async () => {
    if (!user) {
      Alert.alert(
        "Sessão expirada",
        "Sua sessão expirou. Por favor, faça o login novamente.",
        [{ text: "OK", onPress: () => logout() }]
      );
      return;
    }

    setLoadingMeusDados(true);
    const result = await getFuncionarioByUid(user.uid);
    setLoadingMeusDados(false);

    if (result.success) {
      navigation.navigate("FuncionarioEditar", { funcionario: result.data });
    } else {
      Alert.alert(
        "Erro",
        result.message || "Não foi possível buscar seus dados."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header pageTitle={"MEUS DADOS"} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* CARD DO USUÁRIO COM FOTO */}
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
          onPress={logout}
          style={{ width: "100%", width: "100%" }}
          seta="true"
          spaceBetween={true}
        />
      </ScrollView>
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
