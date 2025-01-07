import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import * as Google from "expo-auth-session/providers/google";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { makeRedirectUri } from 'expo-auth-session';
export default function Register({route}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Google login setup


const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '2408840794-vh9n8f3h01nn9ovni4rsdbg0m2u1lpph.apps.googleusercontent.com',
    redirectUri:redirectUri
  });

  const handleLogin = () => {
    navigation.navigate('Login');
  };

 // Register function in your component

 const handleRegister = async () => {
  try {
    // Step 1: Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Add additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName: (firstName && lastName) ? `${firstName} ${lastName}` : "No username set", // Check if firstName and lastName are available
      email: user.email,
      phone: phone || "No phone number", // Fallback if phone is not provided
      photoURL: "https://example.com/default-profile.png", // Default image if not set
    });

    // Step 3: Show success message and navigate to login page
    Alert.alert("Başarılı", "Kayıt işlemi başarıyla tamamlandı!");
    navigation.navigate('Login');
  } catch (error) {
    console.log(error); // Log the error to see detailed information

    // Check the specific error code and show appropriate message
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert("Hata", "Bu e-posta adresi zaten kullanımda.");
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert("Hata", "Geçersiz e-posta adresi.");
    } else if (error.code === 'auth/weak-password') {
      Alert.alert("Hata", "Şifre çok zayıf. En az 6 karakter uzunluğunda olmalıdır.");
    } else {
      Alert.alert("Hata", "Kayıt sırasında bir hata oluştu.");
    }
  }
};

  const handleGoogleSignIn = async () => {
    try {
      const { type, params } = await promptAsync();
      if (type === 'success') {
        const { id_token } = params;
        const credential = auth.GoogleAuthProvider.credential(id_token);
        await auth.signInWithCredential(credential);
        Alert.alert("Başarılı", "Google ile giriş başarılı!");
        navigation.navigate('Home');  // Or wherever you want to navigate
      }
    } catch (error) {
      
        console.error("Error during Google sign-in:", error);
        Alert.alert("Hata", `Google ile giriş yapılamadı: ${error.message}`);
      ;
      
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#BF81CA" />
      </TouchableOpacity>

      <Image resizeMode='cover' style={styles.image} source={require("../assets/login4.jpeg")} />
      <View style={styles.loginContainer}>
        <Text style={styles.header}>Join The Fun World</Text>
        <Text style={styles.header2}>Evently</Text>

        <TextInput 
          style={styles.input} 
          placeholder='E-mail' 
          placeholderTextColor="#CACACA"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Password' 
          placeholderTextColor="#CACACA"
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
        <TextInput 
          style={styles.input} 
          placeholder='First Name' 
          placeholderTextColor="#CACACA"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Last Name' 
          placeholderTextColor="#CACACA"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Phone' 
          placeholderTextColor="#CACACA"
          value={phone}
          onChangeText={setPhone}
        />
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Google login button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={!request}>
          <View style={styles.googleButtonContent}>
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </View>
        </TouchableOpacity>
        
      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 30,
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    opacity: 0.9,
  },
  loginContainer: {
    flex: 1,
    height: "70%",
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  header: {
    textAlign: "center",
    top: 40,
    fontSize: 25,
    fontWeight: "400",
  },
  header2: {
    textAlign: "center",
    top: -50,
    fontSize: 42,
    fontWeight: "bold",
    color: "#BF81CA",
  },
  input: {
    borderColor: "#CACACA",
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    width: "100%",
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#000",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#007bff",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});
