import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';

const bankruptcyQuestions = ['What are the types of bankruptcy?', 'What are the steps involved in filing for bankruptcy?', 'What debts can be discharged in bankruptcy?'];

const App = () => {
  const [messages, setMessages] = useState([ // Simulate initial bot message
    { user: false, text: 'Hello, what bankruptcy questions do you have?' },
  ]);
  const [userInput, setUserInput] = useState(''); // State for user input
  const textInputRef = useRef(null); // Ref to hold the TextInput element
  const flatListRef = useRef(null); // Ref to hold the FlatList component

  const sendMessage = (text) => {
    if (text.trim()) {
      // Add user message to state immediately
      const newMessages = [...messages, { user: true, text }];
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

  const handleButtonClick = (question) => {
    sendMessage(question); // Call sendMessage with question text
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

  // Scroll to the end whenever the component renders
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []); // Empty dependency array [] ensures scroll on every render

  const clearChat = () => {
    setMessages([]); // Set messages state to an empty array to clear chat
  };

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
      {/* Three Ask a Question Buttons - Arranged horizontally */}
      <View style={styles.buttonContainer}>
        {bankruptcyQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.askButton}
            onPress={() => handleButtonClick(question)}
          >
            <Text style={styles.askButtonText}>Question {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask your legal question..."
          onContentSizeChange={handleContentSizeChange}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(userInput)}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row', // Make the container arrange items horizontally
    justifyContent: 'space-between', // Distribute items evenly along the main axis
    paddingHorizontal: 10, // Add padding to the sides
    marginBottom: 10, // Add margin at the bottom
  },
  askButton: {
    backgroundColor: '#ccc', // Match background color of "Send" button
    paddingHorizontal: 15,
    paddingVertical: 10, // Adjust padding for comfort
    borderRadius: 5, // Add some rounded corners
  },
  customButton: {
    backgroundColor: '#333', // Customize button color
    paddingHorizontal: 15, // Adjust padding for comfort
    paddingVertical: 10, // Adjust padding for comfort
    borderRadius: 5, // Add some rounded corners
  },
  sendButton: {
    backgroundColor: '#7FFF7F', // Customize button color
    paddingHorizontal: 15, // Adjust padding for comfort
    paddingVertical: 10, // Adjust padding for comfort
    borderRadius: 5, // Add some rounded corners

  },
  sendButtonText: {
    color: '#000', // Customize button text color
    fontSize: 16, // Adjust font size
  },
  buttonText: {
    color: '#fff', // Customize button text color
    fontSize: 16, // Adjust font size
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
  clearButton: {
    backgroundColor: '#FF3333', // Match background color of other buttons
    paddingHorizontal: 15, // Adjust padding for comfort
    paddingVertical: 10, // Adjust padding for comfort
    borderRadius: 5, // Add some rounded corners
   
  },
  clearButtonText: {
    color: '#000', // Customize button text color
    fontSize: 16, // Adjust font size
  },
  textInput: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
});

export default App;
