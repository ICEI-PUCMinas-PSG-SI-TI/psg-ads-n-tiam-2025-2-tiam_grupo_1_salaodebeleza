import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TextInput } from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import Loading from "../components/Loading";
import { getFuncionarioByEmail, updateFuncionario } from "../services/funcionarioService";
import { getUser } from "../services/loginService";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../database/firebase";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function VincularGoogle() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "223905135120-7juc9frafb7jm75k5ajtm6nf8k6cnjb8.apps.googleusercontent.com",
    prompt: "select_account",
    scopes: ["profile", "email"],
    useProxy: true,
  });

  // --- EFFECT PRINCIPAL ---
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userApp = await getUser();

        if (response?.type === "success") {
          const { authentication } = response;

          // Busca informações do perfil Google
          const userInfoResponse = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: { Authorization: `Bearer ${authentication.accessToken}` },
            }
          );

          const userInfo = await userInfoResponse.json();
          setUser(userInfo);
          console.log("Usuário logado via Google:", userInfo);

          // Atualiza no Firestore
          const dataFuncionario = await getFuncionarioByEmail(userApp.email);
          if (dataFuncionario?.data) {
            dataFuncionario.data.email = userInfo.email;
            await updateFuncionario(
              dataFuncionario.data.uid,
              dataFuncionario.data
            );
            console.log("E-mail atualizado no Firestore!");
          }

          // Atualiza no Firebase Authentication
          const currentUser = auth.currentUser;
          if (!currentUser) {
            Alert.alert("Erro", "Nenhum usuário autenticado.");
            return;
          }

          try {
            const credential = EmailAuthProvider.credential(
              currentUser.email,
              senhaAtual
            );
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, userInfo.email);
            Alert.alert("Sucesso", "E-mail atualizado com sucesso!");
          } catch (error) {
            console.error("Erro ao atualizar e-mail no Auth:", error);
            Alert.alert("Erro", error.message);
          }
        }
      } catch (error) {
        console.error("Erro geral:", error);
      }
    };

    getUserData();
  }, [response]); // <-- fecha aqui corretamente

  // --- BOTÃO ---
  const atualizarEmailFuncionario = async () => {
    setLoading(true);
    await promptAsync({ useProxy: true, showInRecents: true });
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Conecte com seu e-mail do Google</Text>
        <Text style={styles.subtitle}>
          Vincule sua conta Google e atualize seu e-mail do app. {"\n\n"}
          Isso irá redefinir seu e-mail de login.
        </Text>

        <TextInput
          placeholder="Senha atual"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "100%" }}
        />
      </View>

      {loading ? (
        <Loading />
      ) : (
        <Button
          mode="contained"
          onPress={atualizarEmailFuncionario}
          title="Vincular e-mail"
          style={styles.button}
          disabled={!request}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textInput,
    marginBottom: 32,
    textAlign: "left",
  },
  button: {
    borderRadius: 12,
    width: "100%",
  },
});
