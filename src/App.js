import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { Mic, Send } from "@mui/icons-material";
import ChatBox from "./components/ChatBox";
import { GoogleGenerativeAI } from "@google/generative-ai";
import RingLoader from "react-spinners/RingLoader";
import AnimatedCursor from "react-animated-cursor"; // Import AnimatedCursor

const API_KEY = "AIzaSyDV7AWgfuD1f3kke1aKDrGG-vRWlLr4Zzs"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setChatVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const appendMessage = (sender, message) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    if (!chatVisible) {
      setChatVisible(true);
    }
  };

  const sendMessage = () => {
    if (!userInput.trim()) return;

    appendMessage("User", userInput);
    setUserInput("");
    fetchReply(userInput);
  };

  const fetchReply = async (userInput) => {
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      let text = await response.text();

      text = text.replace(/#\s+/g, "");
      text = text.replace(
        /```javascript([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
      );
      text = text.replace(/(?:\r\n|\r|\n)/g, "<br>");
      text = text.trim();
      text = text.replace(/\*/g, "");

      const uniqueLinks = new Set();
      text = text.replace(
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
        (match) => {
          if (!uniqueLinks.has(match)) {
            uniqueLinks.add(match);
            return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="footer-link">${match}</a>`;
          }
          return '';
        }
      );

      appendMessage("Bot", text);
    } catch (error) {
      appendMessage("Bot", "Sorry, I am having trouble connecting to the server.");
      console.error("Error:", error);
    }
  };

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setUserInput(speechResult);
      sendMessage();
    };
    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };
  };

  return (
    <Container maxWidth="md" className="app-container">
      {/* Animated Cursor */}
      <AnimatedCursor
        innerSize={8}
        outerSize={20}
        color="255, 255, 255"
        outerAlpha={0.4}
        innerScale={0.7}
        outerScale={5}
      />

      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
        >
          <RingLoader color="#00bcd4" loading={loading} size={150} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="h6">
              Chatbot by{" "}
              <a
                href="https://youtube.com/@code-with-Bharadwaj"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ color: "#ff4081" }} // Changed color from "neon red" to a valid hex color
              >
                Bharadwaj
              </a>
            </Typography>
          </Box>

          {chatVisible && (
            <Box className="chat-box-wrapper" sx={{ flexGrow: 1, overflowY: "auto" }}>
              <ChatBox messages={messages} />
            </Box>
          )}

          <Box className="input-controls" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              variant="outlined"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="text-field"
              sx={{ flexGrow: 1, mr: 1 }}
              aria-label="Type a message"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              className="send-button"
              aria-label="Send message"
            >
              <Send />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={startRecognition}
              className="mic-button"
              sx={{ ml: 1 }}
              aria-label="Start voice recognition"
            >
              <Mic />
            </Button>
          </Box>
        </Box>
      )}
      <Box className="footer">
        <marquee>© 2024 All rights reserved. Chatbot by Bharadwaj</marquee>
      </Box>
    </Container>
  );
};

export default App;
