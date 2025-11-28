import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import {
  login,
  loginComGoogleToken,
  forgotPassword,
  loginComBiometria,
  isBiometricAvailable,
  saveBiometricCredentials,
  getBiometricCredentials
} from "../services/loginService";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

const CLIENT_ID =
  "223905135120-7juc9frafb7jm75k5ajtm6nf8k6cnjb8.apps.googleusercontent.com";

WebBrowser.maybeCompleteAuthSession();

// helper simples para gerar nonce (pode usar expo-random para mais entropia)
function makeNonce() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  const [biometriaCadastrada, setBiometriaCadastrada] = useState(false);
  const [usandoBiometria, setUsandoBiometria] = useState(false);

  const nonceRef = useRef(makeNonce());

  // Verifica se biometria está disponível, se há credenciais salvas
  // e tenta login automático com biometria ao montar a tela
  useEffect(() => {
    const verificarBiometriaEAutoLogin = async () => {
      try {
        const disponivel = await isBiometricAvailable();
        setBiometriaDisponivel(disponivel);

        if (!disponivel) return;

        // Verifica se há credenciais biométricas salvas
        const credentials = await getBiometricCredentials();
        const cadastrado = !!credentials?.email && !!credentials?.senha;
        setBiometriaCadastrada(cadastrado);

        // Se há credenciais, tenta autenticar automaticamente
        if (cadastrado) {
          setUsandoBiometria(true);
          const result = await loginComBiometria();
          setUsandoBiometria(false);

          if (result.success) {
            setMessage("Login automático por biometria bem-sucedido!");
            // Navegue para a tela principal aqui (ex: navigation.replace('AppMain'))
            // Se você usa React Navigation, injete `navigation` como prop e substitua a linha acima.
          } else {
            // falha no auto-login — manter na tela de login
            console.log('Auto-login biometria falhou:', result.message);
          }
        }
      } catch (err) {
        setUsandoBiometria(false);
        console.error('Erro no auto-login biometria:', err);
      }
    };

    verificarBiometriaEAutoLogin();
  }, []);

  const efetuarLogin = async () => {
    try {
      const user = await login(email, senha);
      
      // Pergunta se deseja habilitar biometria
      if (biometriaDisponivel && email && senha) {
        Alert.alert(
          "Habilitar biometria?",
          "Deseja usar biometria para fazer login mais rápido?",
          [
            {
              text: "Não",
              onPress: () => console.log("Biometria não habilitada"),
            },
            {
              text: "Sim",
              onPress: async () => {
                const resultado = await saveBiometricCredentials(email, senha);
                if (resultado.success) {
                  setMessage("Biometria habilitada com sucesso!");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    }
  };

  const handleLoginBiometria = async () => {
    setUsandoBiometria(true);
    try {
      const result = await loginComBiometria();
      
      if (result.success) {
        setMessage("Login com biometria bem-sucedido!");
        // Navegar para a próxima tela aqui
      } else {
        setMessage(result.message || "Erro ao fazer login com biometria");
      }
    } catch (error) {
      setMessage("Erro ao fazer login com biometria");
      console.error(error);
    } finally {
      setUsandoBiometria(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Insira seu e-mail para redefinir a senha.");
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      console.log("Sucesso", result.message);
    } else {
      console.log("Erro", result.message);
    }
  };

  // ** Login com Google usando provider (corrige problemas com discovery/endpoint) */
  // pedir id_token + access_token e enviar nonce
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri({ useProxy: true }),
    responseType: "id_token token", // id_token + access_token
    usePKCE: false, // implicit flow → PKCE false
    extraParams: {
      nonce: nonceRef.current, // >>> aqui envia o nonce exigido
    },
  });

  useEffect(() => {
    if (!response) return;
    console.log("Google auth raw response:", response);
    if (response.type === "success") {
      const idToken = response.authentication?.idToken || response.params?.id_token;
      const accessToken = response.authentication?.accessToken || response.params?.access_token;
      console.log("idToken:", !!idToken, "accessToken:", !!accessToken);

      if (idToken) {
        loginComGoogleToken(idToken, accessToken)
          .then(user => {
            console.log("Usuário logado no Firebase:", user.email ?? user.uid);
            // navigation.replace('AppMain') // ou sua navegação após login
          })
          .catch(err => {
            console.error("Erro ao logar com Google -> Firebase:", err);
            Alert.alert("Erro ao logar", err.message || String(err));
          });
      } else {
        console.error("Nenhum id_token retornado — verifique CLIENT_ID (use Web client) e redirectUri.");
      }
    }
  }, [response]);
  // ** FIM login Google */

  const [fontsLoaded] = useFonts({
    "Inspiration-Regular": require("../../../assets/fonts/Inspiration-Regular.ttf"),
    Inter: require("../../../assets/fonts/Inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.imagemLogo}
        source={require("../../../assets/logo.png")}
      ></Image>
      <Text style={styles.textLogo}>AgendaGlow</Text>
      <Text style={styles.titulo}>Bem vindo(a) de volta!</Text>
      <Text style={styles.frase}>
        Gerencie seu salão de forma prática e elegante!
      </Text>

      <Text style={styles.message}>{message}</Text>

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
        <Text style={styles.textButton}>Logar</Text>
      </TouchableOpacity>

      { biometriaCadastrada && (
        <TouchableOpacity 
          style={styles.biometriaButton} 
          onPress={handleLoginBiometria}
          disabled={usandoBiometria}
        >
          <Feather name="lock" size={24} color="black" />
          <Text style={styles.textBiometria}>
            {usandoBiometria ? "Autenticando..." : "Login com Biometria"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.espacos}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request}
      >
        <Image
          source={require("../../../assets/google-icon.png")}
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
  espacos: {
    marginBlock: 20,
  },
  message: {
    color: "#e95454ff",
    fontFamily: "Inter",
    fontWeight: 400,
    textAlign: "left",
    width: "100%",
    paddingInline: 10,
    paddingBlock: 4,
  },
  biometriaButton: {
    flexDirection: "row",
    backgroundColor: "#FFF6ED",
    width: "100%",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBlock: 15,
    gap: 10,
  },
  textBiometria: {
    color: "black",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 600,
  },
});
