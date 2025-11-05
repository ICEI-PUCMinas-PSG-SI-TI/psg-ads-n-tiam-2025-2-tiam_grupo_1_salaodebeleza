import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import Loading from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFuncionarioByEmail, updateFuncionario } from "../services/funcionarioService";
import { getUser } from "../services/loginService";


export default function VincularGoogle() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userAuth = await getUser()
        
        if (userAuth != null) {
          const dataFuncionario = await getFuncionarioByEmail(userAuth.email);
          dataFuncionario.data.email = 'lucas.pfd.2002@gmail.com'
          setUser(dataFuncionario)
          await updateFuncionario(user.uid, user)
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };

    loadUser();
  }, []);

  const showConsole = () => {
    console.log(user)
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Digite seu novo endereço de e-mail</Text>
        <Text style={styles.subtitle}>
          Conecte-se com sua conta Google para atualizar seu e-mail do app. {"\n\n"}
          Isso irá redefinir seu email de login.
        </Text>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <Button
          mode="contained"
          onPress={()=> showConsole()}
          title={"Vincular e-mail"}
          style={styles.button}
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
