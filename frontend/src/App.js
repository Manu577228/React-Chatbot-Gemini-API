import { useState, useEffect, useRef } from "react";
import { Send, Mic, MoreVertical, Paperclip, Smile, Heart, Trash2 } from "lucide-react";

const BOT_AVATAR = "https://i.postimg.cc/SKBNcms1/Bharadwaj-removebg-preview.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/chat");
        const data = await response.json();
        if (data.messages) {
          const formatted = data.messages.map(msg => ({
            sender: msg.sender,
            message: formatMessage(msg.message),
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formatted);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
        // Keep loading screen visible for minimum 2 seconds
        setTimeout(() => setShowLoading(false), 2000);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatMessage = (text) => {
    // Only do minimal formatting - preserve most of the original structure
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers but keep text
      .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
      .trim();
  };

  const appendMessage = (sender, message) => {
    const formattedMessage = sender === "bot" ? formatMessage(message) : message;
    setMessages((prev) => [
      ...prev,
      { sender, message: formattedMessage, timestamp: new Date() },
    ]);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    appendMessage("user", userMessage);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      appendMessage("bot", data.reply || "No response.");
    } catch {
      appendMessage("bot", "Backend not reachable.");
    } finally {
      setIsTyping(false);
    }
  };

  const startRecognition = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Speech recognition not supported.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (e) => setUserInput(e.results[0][0].transcript);
  };

  const clearChat = async () => {
    if (!confirm("Clear entire conversation history?")) return;
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === "deleted") {
        setMessages([]);
        console.log("Chat history cleared successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Failed to clear chat:", error);
      alert("Failed to clear chat. Check backend connection and console for details.");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
  };

  if (showLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loaderWrapper}>
          <img src={BOT_AVATAR} alt="Loading" style={styles.loaderImage} />
          <div style={styles.loaderRing}></div>
        </div>
        <p style={styles.loadingText}>Initializing Bharadwaj AI...</p>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.backgroundOrb1}></div>
      <div style={styles.backgroundOrb2}></div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarWrapper}>
            <img src={BOT_AVATAR} alt="Bharadwaj" style={styles.headerAvatar} />
            <div style={styles.statusDot}></div>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Bharadwaj AI</h1>
            <p style={styles.headerStatus}>
              <span style={styles.statusDotSmall}></span>
              Online
            </p>
          </div>
        </div>
        <div style={styles.headerButtons}>
          {messages.length > 0 && (
            <button 
              onClick={clearChat} 
              style={styles.clearBtn}
              title="Clear chat history"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
              }}
            >
              <Trash2 size={16} style={{ marginRight: "6px" }} />
              Clear Chat
            </button>
          )}
          <button style={styles.iconBtn}>
            <MoreVertical size={24} color="#c084fc" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>
              <img src={BOT_AVATAR} alt="Bot" style={styles.emptyStateAvatar} />
            </div>
            <div style={styles.emptyStateText}>
              <h2 style={styles.emptyStateTitle}>Welcome to Bharadwaj AI</h2>
              <p style={styles.emptyStateSubtitle}>
                Start a conversation and experience intelligent assistance powered by advanced AI
              </p>
            </div>
            <div style={styles.suggestionsContainer}>
              <button 
                style={styles.suggestionBtn}
                onClick={() => handleSuggestionClick("Tell me a joke")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                }}
              >
                Tell me a joke
              </button>
              <button 
                style={styles.suggestionBtn}
                onClick={() => handleSuggestionClick("How can you help?")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                }}
              >
                How can you help?
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              flexDirection: m.sender === "user" ? "row-reverse" : "row",
            }}
          >
            {m.sender === "bot" && (
              <img src={BOT_AVATAR} alt="Bot" style={styles.botAvatar} />
            )}
            <div
              style={{
                ...styles.messageBubble,
                ...(m.sender === "user" ? styles.userBubble : styles.botBubble),
              }}
              className="message-bubble"
            >
              <p style={styles.messageText}>
                {m.message.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < m.message.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <span style={styles.messageTime}>
                {m.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={styles.messageRow}>
            <img src={BOT_AVATAR} alt="Bot" style={styles.botAvatar} />
            <div style={styles.typingBubble}>
              <div style={styles.typingDots}>
                <div style={{ ...styles.dot, animationDelay: "0s" }}></div>
                <div style={{ ...styles.dot, animationDelay: "0.15s" }}></div>
                <div style={{ ...styles.dot, animationDelay: "0.3s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputSection}>
        <div style={styles.inputContainer}>
          <button style={styles.inputIconBtn}>
            <Paperclip size={20} color="#c084fc" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button style={styles.inputIconBtn}>
            <Smile size={20} color="#c084fc" />
          </button>
          <button onClick={startRecognition} style={styles.inputIconBtn}>
            <Mic size={20} color="#c084fc" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!userInput.trim()}
            style={{
              ...styles.sendBtn,
              opacity: userInput.trim() ? 1 : 0.5,
              cursor: userInput.trim() ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (userInput.trim()) {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(147, 51, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(147, 51, 234, 0.3)";
            }}
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            Made with <Heart size={14} style={styles.heartIcon} fill="#ef4444" color="#ef4444" /> by{" "}
            <a 
              href="https://www.youtube.com/@bharadwaj" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.footerLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#a855f7";
                e.currentTarget.style.borderBottomColor = "#a855f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#c084fc";
                e.currentTarget.style.borderBottomColor = "transparent";
              }}
            >
              Bharadwaj
            </a>
          </span>
        </div>
      </div>

      <style>{keyframesStyles}</style>
    </div>
  );
};

const keyframesStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Custom scrollbar styles */
  .message-bubble::-webkit-scrollbar {
    width: 6px;
  }
  .message-bubble::-webkit-scrollbar-track {
    background: rgba(168, 85, 247, 0.1);
    border-radius: 10px;
  }
  .message-bubble::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.5);
    border-radius: 10px;
  }
  .message-bubble::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.7);
  }
`;

const styles = {
  mainContainer: {
    height: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #581c87 50%, #0f172a 100%)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  backgroundOrb1: {
    position: "absolute",
    width: "384px",
    height: "384px",
    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "-192px",
    left: "-192px",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  backgroundOrb2: {
    position: "absolute",
    width: "384px",
    height: "384px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "-192px",
    right: "-192px",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite 1s",
    pointerEvents: "none",
  },
  header: {
    position: "relative",
    zIndex: 10,
    backdropFilter: "blur(20px)",
    background: "rgba(15, 23, 42, 0.4)",
    borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatarWrapper: {
    position: "relative",
  },
  headerAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    padding: "2px",
    boxShadow: "0 4px 12px rgba(168, 85, 247, 0.5)",
  },
  statusDot: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "14px",
    height: "14px",
    background: "#10b981",
    borderRadius: "50%",
    border: "2px solid #0f172a",
    animation: "pulse 2s ease-in-out infinite",
  },
  headerTitle: {
    color: "white",
    fontWeight: 600,
    fontSize: "18px",
    margin: 0,
    letterSpacing: "0.5px",
  },
  headerStatus: {
    color: "rgba(216, 180, 254, 0.7)",
    fontSize: "14px",
    margin: "4px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  statusDotSmall: {
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    display: "inline-block",
    animation: "pulse 2s ease-in-out infinite",
  },
  headerButtons: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  clearBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "#c084fc",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
    zIndex: 10,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    gap: "24px",
    opacity: 0.6,
  },
  emptyStateIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
  },
  emptyStateAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
  emptyStateText: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  emptyStateTitle: {
    color: "white",
    fontSize: "24px",
    fontWeight: 300,
    margin: 0,
  },
  emptyStateSubtitle: {
    color: "rgba(216, 180, 254, 0.6)",
    maxWidth: "400px",
    margin: 0,
  },
  suggestionsContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  suggestionBtn: {
    padding: "8px 16px",
    background: "rgba(168, 85, 247, 0.1)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "20px",
    color: "#d8b4fe",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  messageRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    animation: "fadeIn 0.3s ease-out",
  },
  botAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    padding: "2px",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: "16px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
  userBubble: {
    background: "linear-gradient(135deg, #9333ea 0%, #a855f7 100%)",
    color: "white",
    borderTopRightRadius: "4px",
    maxHeight: "500px",
    overflowY: "auto",
    overflowX: "hidden",
  },
  botBubble: {
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    color: "#f1f5f9",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    borderTopLeftRadius: "4px",
    maxHeight: "500px",
    overflowY: "auto",
    overflowX: "hidden",
  },
  messageText: {
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  messageTime: {
    fontSize: "12px",
    opacity: 0.6,
    marginTop: "8px",
    display: "block",
  },
  typingBubble: {
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    borderRadius: "16px",
    borderTopLeftRadius: "4px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  typingDots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    background: "#c084fc",
    borderRadius: "50%",
    animation: "bounce 1.4s ease-in-out infinite",
  },
  inputSection: {
    position: "relative",
    zIndex: 10,
    backdropFilter: "blur(20px)",
    background: "rgba(15, 23, 42, 0.4)",
    borderTop: "1px solid rgba(168, 85, 247, 0.2)",
    padding: "16px 24px 8px 24px",
    boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputContainer: {
    maxWidth: "1024px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "8px 16px",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  inputIconBtn: {
    background: "transparent",
    border: "none",
    color: "#c084fc",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    outline: "none",
    fontSize: "15px",
    padding: "8px",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #9333ea 0%, #a855f7 100%)",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    height: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #581c87 50%, #0f172a 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
  },
  loaderWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    zIndex: 2,
    position: "relative",
  },
  loaderRing: {
    position: "absolute",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "3px solid transparent",
    borderTopColor: "#a855f7",
    borderRightColor: "#ec4899",
    animation: "rotate 1.2s linear infinite",
    boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
  },
  loadingText: {
    color: "white",
    fontSize: "20px",
    fontWeight: 300,
    letterSpacing: "1px",
    animation: "pulse 2s ease-in-out infinite",
  },
  footer: {
    textAlign: "center",
    padding: "12px 0 8px 0",
    marginTop: "8px",
  },
  footerText: {
    color: "rgba(216, 180, 254, 0.5)",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  heartIcon: {
    display: "inline-block",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  footerLink: {
    color: "#c084fc",
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.2s",
    borderBottom: "1px solid transparent",
  },
};

export default App;