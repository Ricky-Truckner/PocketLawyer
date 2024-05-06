import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';

const App = () => {
  const [messages, setMessages] = useState([ // Simulate initial bot message
    { user: false, text: 'Hello, what bankruptcy questions do you have?' },
  ]);
  const [userInput, setUserInput] = useState(''); // State for user input
  const textInputRef = useRef(null); // Ref to hold the TextInput element
  const flatListRef = useRef(null); // Ref to hold the FlatList component

  const sendMessage = () => {
    if (userInput.trim()) {
      // Add user message to state immediately
      const newMessages = [...messages, { user: true, text: userInput }];
      setMessages(newMessages); // Update state with new messages array
      setUserInput(''); // Clear input field after sending

      // Simulate asynchronous Lex response (replace with your Lex integration)
      setTimeout(() => {
        setMessages([...newMessages, { user: false, text: 'Here is some info!' }]);
      }, 1000); // Simulate 1 second delay
    }
  };

  const handleContentSizeChange = (contentWidth) => {
    textInputRef.current.setNativeProps({ style: { width: contentWidth + 20 } }); // Add padding
  };

  const renderMessage = ({ item }) => (
    item.user ? (
      <View style={[styles.messageContainer, styles.userBubble]}>
        <Text style={styles.userName}>You</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    ) : (
      <View style={[styles.messageContainer, styles.botBubble]}>
        <Text style={styles.userName}>Claire</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    )
  );

  useEffect(() => {
    // Scroll to the end of the list whenever messages change
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.text}
        contentContainerStyle={styles.chatContainer}
        inverted={false} // Display messages in reverse order (newest on top)
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask your legal question..."
          onContentSizeChange={handleContentSizeChange}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 20,
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  userBubble: {
    backgroundColor: '#ddd', // Adjust for user message color
    alignSelf: 'flex-start', // Align user messages to left
  },
  botBubble: {
    backgroundColor: '#fff', // Adjust for bot message color
    alignSelf: 'flex-end', // Align bot messages to right
  },
  userName: {
    position: 'absolute', // Position username absolutely
    top: -13, // Adjust top position as needed
    left: 0, // Align left for all messages
    fontWeight: 'semibold',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
});

export default App;
