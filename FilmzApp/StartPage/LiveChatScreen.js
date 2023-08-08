import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList } from 'react-native';
import { doc, setDoc, getDoc ,serverTimestamp, collection, onSnapshot } from 'firebase/firestore';
import { auth, firebase } from "../firebase";


const LiveChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const userInfo = await getDoc(doc(firebase,'theUsersV2',auth.currentUser.uid));
      if (userInfo.exists()) {
        const userData = userInfo.data();
        setUserName(userData.fullName);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const messagesCollectionRef = collection(firebase, 'messages');

    const unsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => {
        const messageData = doc.data();
        const { id, text, sender } = messageData;
        return {
          id,
          text,
          sender,
        };
      });
      setMessages(updatedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async () => {
    if (message === '') {
      return;
    }

    if (auth.currentUser) {
      const messagesDirect = collection(firebase, 'messages');

      const newMessage = {
        text: message,
        sender: userName,
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(messagesDirect), newMessage);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
    <Text style={styles.senderName}>{item.sender}</Text>
    <View style={styles.messageContent}><Text>{item.text}</Text></View>
    </View>
  );

  return (
    <View style={styles.container}>
     <FlatList
  style={styles.messageList}
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item, index) => `${item.id}-${index}`}
  inverted = {false}
/>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          onChangeText={setMessage}
          value={message}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  messageList: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageContent: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },

senderName: {
  fontWeight: 'bold',
  marginBottom: 4,
},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f4511e',
    borderRadius: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LiveChatScreen;
