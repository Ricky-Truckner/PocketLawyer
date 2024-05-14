import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'; // Import Image here
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';
import moment from 'moment';
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { GoogleGenerativeAI } from "@google/generative-ai";


const bankruptcyQuestions = [
  'What are the categories of bankruptcy?',
  'What are the steps involved in filing for bankruptcy?',
  'What are the consequences of filing for bankruptcy?'
];
const questionTitles = ['Categories', 'Steps Involved', 'Consequences']; // Array to hold button titles
const API_KEY = "AIzaSyA6i9CGSXI0B8yUFAzueR5xBeQdrs-ZfCE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const App = () => {
  const [messages, setMessages] = useState([ // Simulate initial bot message
    { user: false, text: 'Hello, what bankruptcy questions do you have?' },
  ]);
  const [userInput, setUserInput] = useState(''); // State for user input
  const textInputRef = useRef(null); // Ref to hold the TextInput element
  const flatListRef = useRef(null); // Ref to hold the FlatList component

  const formatDate = (date) => {
    return moment(date).format('h:mm A'); // Adjust format as needed 
  };

  const sendMessage = async (text) => {
    if (text.trim()) {
      // Update messages state directly with the new user message
      setMessages((prevMessages) => [...prevMessages, { user: true, text }]);
      setUserInput(''); // Clear input field after sending

      const userMessage = { text, user: true }; // Define userMessage here
      const prompt = userMessage.text;

      // Call sendUserMessage and wait for response using await
      const botMessage = await sendUserMessage(prompt); 
      setMessages([...messages, botMessage]); // Add bot message to state after receiving response
    }
  };

  const sendUserMessage = async (prompt) => {``
    //setLoading(true); // Uncomment if using loading functionality
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botMessage = { text: response.text(), user: false };
    //setLoading(false); // Uncomment if using loading functionality
    return botMessage; // Return the bot message object
  };

  const handleContentSizeChange = (contentWidth) => {
    textInputRef.current.setNativeProps({ style: { width: contentWidth + 20 } }); // Add padding
  };

  const handleButtonClick = (question, index) => {
    sendMessage(bankruptcyQuestions[index]); // Send the actual bankruptcy question
  };
  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, styles[item.user ? 'userBubble' : 'botBubble']]}>
      {item.user ? null : ( // Only render avatar container for bot messages
        <View style={styles.messageHeader}>
          <Image source={require('./assets/claire_avatar.png')} // Replace with your image path
                 style={styles.avatar} />
        </View>
      )}
      <Text style={styles.userName}>{item.user ? 'You' : 'Claire'}</Text>
      {item.user === false && (
        <View style={styles.onlineStatusContainer}>
          <Text style={styles.onlineStatus}>Online</Text>
        </View>
      )}
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{moment(new Date()).format('h:mm A')}</Text>

    </View>
  );

  // Scroll to the end whenever the component renders
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []); 
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
            onPress={() => handleButtonClick(question, index)}
          >
            <Text style={styles.askButtonText}>{questionTitles[index]}</Text>
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
    padding: 10,
  },
  messageContainer: {
    marginBottom:25,
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageHeader: {
    flexDirection: 'row', // Arrange elements horizontally
    alignItems: 'center', // Align vertically in center
    marginBottom: 5, // Add some margin for spacing
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d4d4d4', // Optional background color
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height:30,
    borderRadius: 20, // Make the avatar image circular
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineStatus: {
    bottom: 1,
    right: -3,
    fontSize: 8,
    color: '#333',
  },
  onlineStatusContainer: {
    position: 'absolute', // Position absolutely to place next to username
    top: -8, // Adjust top position as needed
    right: 5, // Align right for bot messages
  },
  timestamp: {
    position: 'absolute', // Absolute positioning
    bottom: -13, // Adjust position from bottom
    right: 0, // Adjust position from right
    fontSize: 10, // Adjust font size
    color: '#999', // Adjust color
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
    backgroundColor: '#f0f0f0', // Adjust for bot message color
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