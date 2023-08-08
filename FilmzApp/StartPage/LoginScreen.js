import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import {auth} from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log('Logged in successfully!'))
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            Alert.alert('Login Failed', 'User not found. Please check your email.');
          } else {
            Alert.alert('Login Failed', 'Invalid email or password.');
          }
          setPassword('');
        });
    } else {
      Alert.alert('Login Failed', 'Please enter your email and password.');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Email"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Password"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F3F41',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
    color: 'white',
  },
  
  input: {
    width: '80%',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#696969',
    fontSize: 16,
  },

  button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#268A58',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#1273DE',
    fontSize: 19,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
