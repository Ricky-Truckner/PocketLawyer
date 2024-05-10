import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'; // Import Image here
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';
import moment from 'moment';
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";


const bankruptcyQuestions = ['What are the types of bankruptcy?', 'What are the steps involved in filing for bankruptcy?', 'What debts can be discharged in bankruptcy?'];

const App = () => {
  const [messages, setMessages] = useState([ // Simulate initial bot message
    { user: false, text: 'Hello, what bankruptcy questions do you have?' },
  ]);
  const [userInput, setUserInput] = useState(''); // State for user input
  const textInputRef = useRef(null); // Ref to hold the TextInput element
  const flatListRef = useRef(null); // Ref to hold the FlatList component
  const API_KEY = "AIzaSyBh4jTT75GDIasd0z2jMOzufCww-GiJz6o";

  const formatDate = (date) => {
    return moment(date).format('h:mm A'); // Adjust format as needed (e.g., 24-hour format)
  };

  
  const sendMessage = (text) => {
    const sendUserMessage = async () => {
      setLoading(true);
      const userMessage = { text: userInput, user: true };
      setMessages([...messages, userMessage]);
    
      // Gemini Integration
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      // **Change here:** Get the actual response text from Gemini
      const text = response.text(); // This now uses the actual response
      setMessages([...messages, { text, user: false }]);
      setLoading(false);
      setUserInput("");
    }

    if (text.trim()) {
      // Add user message to state immediately
      const newMessages = [...messages, { user: true, text }];
      setMessages(newMessages); // Update state with new messages array
      setUserInput(''); // Clear input field after sending

      sendUserMessage(); // Call the function to send the message and get response
    }
  };

  const handleContentSizeChange = (contentWidth) => {
    textInputRef.current.setNativeProps({ style: { width: contentWidth + 20 } }); // Add padding
  };

  const handleButtonClick = (question) => {
    sendMessage(question); // Call sendMessage with question text
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
    backgroundColor: '#eee', // Optional background color
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