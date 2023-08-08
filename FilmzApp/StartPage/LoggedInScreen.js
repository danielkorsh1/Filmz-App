import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, Image,Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, firebase } from "../firebase";
import { useNavigation } from '@react-navigation/native';
import { collection,getDocs, query, where} from 'firebase/firestore';


const LoggedInScreen = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://imdb-api.com/API/AdvancedSearch/k_hvkulrvp?title=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setShowSearchInput(false);
  };

  const handleType = async (item) => {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/Title/k_hvkulrvp/${item.id}`);
      const data = await response.json();
      return data.type;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return '';
    }
  };

  const handleSearchIconPress = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setKeyword('');
    }
  };

  const handleAddToFavorites = async (item) => {
    try {
      const itemType = await handleType(item);
      if (itemType) {
        console.log('Transferred type:', itemType);
        const favoriteRef = collection(firebase, `theUsersV2/${auth.currentUser.uid}/favorites`);
        
        // Query the favorites collection to check if the item exists
        const favoritesQuery = query(favoriteRef, where('id', '==', item.id));
        const querySnapshot = await getDocs(favoritesQuery);
        
        if (!querySnapshot.empty) {
          console.log('Item already exists in favorites');
          Alert.alert('You already have this Film in your Favorites');
          return;
        }
        
        navigation.navigate('Main', { screen: 'Favorites', params: { item: item, type: itemType } });
      } else {
        console.log('Failed to fetch item type.');
      }
    } catch (error) {
      console.error('Error adding item to favorites:', error);
    }
  };

  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <MaterialCommunityIcons name="logout" size={24} color="#D44E51" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSearchIconPress} style={styles.searchButton}>
        <MaterialCommunityIcons
          name={showSearchInput ? 'close' : 'magnify'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {showSearchInput && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={keyword}
            placeholderTextColor="#aaaaaa"
            onChangeText={setKeyword}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSearch}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultContainer} key={item.id}>
            <Text style={styles.title}>{item.title}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <TouchableOpacity
              style={styles.addToFavoritesButton}
              onPress={() => handleAddToFavorites(item)}
            >
              <Text style={styles.addToFavoritesButtonText}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3F3F41',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#696969',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#268A58',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#268A58',
    borderWidth: 2,
    borderColor: 'black',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    marginBottom: 16,
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  addToFavoritesButton: {
    marginTop: 8,
    backgroundColor: '#268A58',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToFavoritesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 10,
  },
  signOutButtonText: {
    color: '#D44E51',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoggedInScreen;
