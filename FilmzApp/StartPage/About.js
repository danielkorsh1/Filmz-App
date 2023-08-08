import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth} from "../firebase";
import { useNavigation } from '@react-navigation/native';



const AboutScreen = () => {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.navigate('Main', { screen: 'LoggedInScreen' });
  };
  
  const handleSignOut = () => {
    signOut(auth);
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <MaterialCommunityIcons name="logout" size={24} color="#D44E51" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <View style={[styles.column, styles.box]}>
          <Text style={styles.text}>Ofek Sade</Text>
          <Text style={styles.text}>Email: ofeksade@hotmail.co.il</Text>
          <Text style={styles.text}>Software Practical Engineer</Text>
        </View>
        <View style={[styles.column, styles.box]}>
          <Text style={styles.text}>Daniel Korshonov</Text>
          <Text style={styles.text}>Email: dankor2000@gmail.com</Text>
          <Text style={styles.text}>Software Practical Engineer</Text>
        </View>
      </View>
      <Text style={[styles.description, styles.box]}>
        Welcome to Filmz, an app to organize your favorite movies and shows in collaboration with IMDb. Enjoy your stay!
      </Text>
      <Image source={require('../assets/IMDB_Logo.png')} style={styles.image} />

      <TouchableOpacity style={styles.homeButton} onPress={handleNavigateToHome}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F3F41',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  box: {
    borderWidth: 1,
    backgroundColor: '#999B9C',
    padding: 5,
  },
  text: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    right: 10,
  },
  signOutButtonText: {
    color: '#D44E51',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  homeButton: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#268A58',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginTop: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AboutScreen;
