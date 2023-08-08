import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Button, Image } from 'react-native';
import { auth, firebase } from '../firebase';
import { doc, collection, addDoc, getDocs, query, deleteDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FavoriteScreen = ({ route }) => {
  const { item, type } = route?.params ?? {};
  const [filter, setFilter] = useState('All');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  const fetchItems = async () => {
    if (user) {
      const itemsRef = type === 'Movies' ? collection(firebase, 'movies') : collection(firebase, 'tvShows');
      const itemsQuery = query(itemsRef);

      const itemsSnapshot = await getDocs(itemsQuery);
      const items = itemsSnapshot.docs.map((doc) => doc.data());

      setFilteredItems(items);
    }
  };

  const filterItems = async () => {
    if (user) {
      const userDocRef = doc(firebase, 'theUsersV2', auth.currentUser.uid);
      const favoritesCollectionRef = collection(userDocRef, 'favorites');
      const favoritesQuerySnapshot = await getDocs(favoritesCollectionRef);
      const favorites = favoritesQuerySnapshot.docs.map((doc) => doc.data());
  
      if (filter === 'All') {
        setFilteredItems(favorites);
      } else {
        const filteredFavorites = favorites.filter((item) => item.type === filter);
        setFilteredItems(filteredFavorites);
      }
    } else {
      setFilteredItems([]);
    }
  };

  useEffect(() => {
    if (user) {
      filterItems(); // Call the filterItems function to update the filteredItems
    }
  }, [filter]);
  
  const handleDelete = async (item) => {
    try {
      const userDocRef = doc(firebase, 'theUsersV2', auth.currentUser.uid);
      const favoritesCollectionRef = collection(userDocRef, 'favorites');
  
      // Query the favorites collection to find the document with matching item.id
      const favoritesQuery = query(favoritesCollectionRef, where('id', '==', item.id));
      const querySnapshot = await getDocs(favoritesQuery);
  
      if (querySnapshot.empty) {
        console.log('Item not found in favorites');
        return;
      }
  
      // Delete the document with the matching item.id
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
  
      // Update the filtered items by removing the deleted favorite
      setFilteredItems((prevItems) => prevItems.filter((prevItem) => prevItem.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleMoreInfoPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  useEffect(() => {
    if (user && item && type) {
      const addFavoriteItem = async () => {

        const newFavoriteItem = {
          ...item,
          type,
        };

        const userDocRef = doc(firebase, 'theUsersV2', auth.currentUser.uid);
        const favoritesCollectionRef = collection(userDocRef, 'favorites');

        await addDoc(favoritesCollectionRef, newFavoriteItem);

        // Update the filtered items with the newly added favorite
        setFilteredItems((prevItems) => [...prevItems, newFavoriteItem]);
      };

      addFavoriteItem();
    }
  }, [item, type, user]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'All' && styles.activeFilterButton]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterButtonText, filter === 'All' && styles.activeFilterButtonText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Movie' && styles.activeFilterButton]}
          onPress={() => setFilter('Movie')}
        >
          <Text style={[styles.filterButtonText, filter === 'Movie' && styles.activeFilterButtonText]}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'TVSeries' && styles.activeFilterButton]}
          onPress={() => setFilter('TVSeries')}
        >
          <Text style={[styles.filterButtonText, filter === 'TVSeries' && styles.activeFilterButtonText]}>TV Shows</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.moreInfoButton}
                onPress={() => handleMoreInfoPress(item)}
              >
                <MaterialCommunityIcons name="information" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <MaterialCommunityIcons name="delete" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedItem && (
           <>
           <Text style={styles.modalTitle}>{selectedItem.title}</Text>
           <Text style={styles.descriptionSelected}>{selectedItem.description}</Text>
           <Text style={styles.plot}>{selectedItem.plot}</Text>
           <Image source={{ uri: selectedItem.image }} style={styles.image} />
           <View style={styles.starsContainer}>
             <MaterialCommunityIcons name="star" size={20} color="gold" />
             <Text style={styles.rating}>{selectedItem.stars}</Text>
           </View>
          </>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3F3F41',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#268A58',
  },
  filterButtonText: {
    fontSize: 16,
    color: 'white',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#696969',
    borderRadius: 20, 
    padding: 10,

  },
  itemTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 0.3, height: 0.3 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#696969',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreInfoButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  moreInfoButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  descriptionSelected: {
    fontSize: 16,
    color: 'black',
  },
  plot: {
    fontSize: 16,
    color: 'black',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },

});

export default FavoriteScreen;
