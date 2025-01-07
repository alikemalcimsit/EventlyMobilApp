import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { makeRedirectUri } from 'expo-auth-session';

import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons"; // Google ikonu için eklenmiş

export default function Login() {


  const redirectUri = makeRedirectUri();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '2408840794-vh9n8f3h01nn9ovni4rsdbg0m2u1lpph.apps.googleusercontent.com',
    redirectUri:redirectUri
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("Başarılı", "Google ile giriş başarılı!");
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.error("Error during Google sign-in:", error);
          Alert.alert("Hata", `Google ile giriş yapılamadı, ${error.message}`);
        });
        
    }
  }, [response]);

  const handleGoogleSignIn = () => {
    if (!request) {
      Alert.alert("Hata", "Google OAuth istemci başlatılamadı.");
      return;
    }
    promptAsync();
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş başarılı!");
      navigation.navigate("Home");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Hata", "Geçersiz e-posta adresi.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Hata", "Bu e-posta adresine ait bir kullanıcı bulunamadı.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Hata", "Yanlış şifre. Lütfen tekrar deneyin.");
      } else {
        Alert.alert("Hata", "Giriş sırasında bir hata oluştu." ,);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Başarılı",
        "Şifre yenileme bağlantısı e-posta adresinize gönderildi."
      );
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Hata", "Geçersiz e-posta adresi.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Hata", "Bu e-posta adresine ait bir kullanıcı bulunamadı.");
      } else {
        Alert.alert("Hata", "Şifre yenileme sırasında bir hata oluştu.");
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require("../assets/login4.jpeg")}
      />
      <View style={styles.loginContainer}>
      <Text style={styles.header2}>Evently</Text> {/* Evently yazısı üstte */}
        <Text style={styles.header}>Join The Fun World</Text>
       

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#CACACA"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#CACACA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon} />
          <Text style={styles.loginButtonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  image: { width: "100%", height: "60%", resizeMode: "cover", opacity: 0.9 },
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  header: {
    fontSize: 25,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 20,

  },
  header2: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#BF81CA",
    textAlign: "center",
    marginBottom: 0,
    marginTop:10,
  },
  input: {
    borderColor: "#cacaca",
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    width: "100%",
    height: 50,
    color: "#000",
    paddingLeft: 15,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#BF81CA",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#007bff",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",  // Google ikonu ve yazıyı yan yana yerleştirir
  },
  googleIcon: {
    marginRight: 10, // İkon ile metin arasında boşluk bırakır
  },
  registerButton: {
    backgroundColor: "#000",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  forgotPassword: { marginTop: 10, marginBottom: 20 },
  forgotPasswordText: { color: "#BF81CA", fontSize: 14 },
}); 