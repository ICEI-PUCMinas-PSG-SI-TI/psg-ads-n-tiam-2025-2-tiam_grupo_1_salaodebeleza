import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { login } from "../services/loginService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const efetuarLogin = async () => {
    try {
      const user = await login(email, senha);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [fontsLoaded] = useFonts({
    "Inspiration-Regular": require("../../assets/fonts/Inspiration-Regular.ttf"),
    Inter: require("../../assets/fonts/Inter.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.imagemLogo}
        source={require("../../assets/logo.png")}
      ></Image>
      <Text style={styles.textLogo}>AgendaGlow</Text>
      <Text style={styles.titulo}>Bem vindo(a) de volta!</Text>
      <Text style={styles.frase}>
        Gerencie seu salão de forma prática e elegante!
      </Text>

      <View style={styles.inputCima}>
        <Feather
          name="mail"
          size={20}
          color={"#50322F"}
          style={styles.icon}
        ></Feather>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.colorTextInput}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputBaixo}>
        <Feather
          name="lock"
          size={20}
          color={"#50322F"}
          style={styles.icon}
        ></Feather>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          style={styles.colorTextInput}
          placeholder="Senha"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={efetuarLogin}>
        <Text style={styles.textButton}>Salvar</Text>
      </TouchableOpacity>

      <Text>Esqueci minha senha</Text>
      <Text style={styles.textNegrito}>Criar Conta</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../assets/google-icon.png")}
          style={styles.googleIcon}
        ></Image>
      </TouchableOpacity>
      <Text style={styles.textNegrito}>Logar com o Google</Text>
      <Text style={styles.direitos}>@2025. Todos os direitos reservados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE8DB",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  textLogo: {
    fontFamily: "Inspiration-Regular",
    fontSize: 45,
    marginBottom: 10,
    color: "#50322F",
  },
  imagemLogo: {
    width: 80,
    height: 80,
  },
  titulo: {
    color: "#50322F",
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  frase: {
    color: "#50322F",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    textAlign: "center",
    marginInline: 20,
    marginBlock: 20,
  },
  inputCima: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6ED",
    paddingInline: 15,
    paddingBlock: 5,
    borderWidth: 1, // espessura da borda
    borderColor: "#C36859", // cor da borda
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 1,
    width: "100%",
  },
  inputBaixo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6ED",
    paddingInline: 15,
    paddingBlock: 5,
    borderWidth: 1, // espessura da borda
    borderColor: "#C36859", // cor da borda
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    width: "100%",
  },
  colorTextInput: {
    color: "#50322F",
    fontFamily: "Inter",
    fontWeight: 600,
    marginInline: 10,
    width: "100%",
  },
  button: {
    color: "#76d7d",
    backgroundColor: "#C38379",
    width: "100%",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    marginBlock: 20,
  },
  textButton: {
    color: "#fff",
    fontFamily: "Inter",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 400,
  },
  textNegrito: {
    color: "#333333",
    fontFamily: "Inter",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    marginBlock: 20,
  },
  googleButton: {
    alignItems: "center",
    backgroundColor: "#FFF6ED",
    borderRadius: 100,
  },
  googleIcon: {
    width: 20,
    height: 20,
    margin: 15,
  },
  direitos: {
    position: "absolute",
    color: "#333333",
    fontFamily: "Inter",
    fontWeight: 400,
    bottom: 30,
  },
});
