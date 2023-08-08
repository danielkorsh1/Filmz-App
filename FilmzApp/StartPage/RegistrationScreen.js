import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { auth, firebase } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {  collection ,doc, setDoc } from 'firebase/firestore';

const RegistrationScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const handleRegistration = () => {
    if (fullName === '' || email === '' || password === '' || age === '') {
      Alert.alert('Registration Failed', 'Please fill in all fields.');
      return;
    }

    if (age < 18) {
      Alert.alert('Registration Failed', 'You must be at least 18 years old to register.');
      setFullName('');
      setEmail('');
      setPassword('');
      setAge('');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Registered successfully!');
      const user = userCredential.user;
      const userData = { fullName, age };
      const usersCollectionRef = collection(firebase, 'theUsersV2');
      const userRef = doc(usersCollectionRef, user.uid);
      setDoc(userRef, userData)
        .then(() => {
          console.log('User data saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving user data:', error);
        });
    })
    .catch((error) => {
      console.error('Registration failed:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Full Name"
        onChangeText={setFullName}
        value={fullName}
        autoCapitalize="words"
      />
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { color: 'white' }]}
        placeholder="Age"
        onChangeText={setAge}
        value={age}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
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
});

export default RegistrationScreen;
