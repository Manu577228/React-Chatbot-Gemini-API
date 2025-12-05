import { useState, useEffect, useRef } from "react";
import { Send, Mic, AutoAwesome } from "@mui/icons-material";

const API_KEY = "AIzaSyB6DKywNyzxEqSlFgnRF8Dt60QOODqWsVg";
const BOT_AVATAR =
  "https://i.postimg.cc/SKBNcms1/Bharadwaj-removebg-preview.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const appendMessage = (sender, message) => {
    setMessages((prev) => [
      ...prev,
      { sender, message, timestamp: new Date() },
    ]);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    appendMessage("user", userMessage);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

      setIsTyping(false);
      appendMessage("bot", botText);
    } catch (error) {
      setIsTyping(false);
      appendMessage("bot", "Sorry, I encountered an error. Please try again.");
    }
  };

  const startRecognition = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setUserInput(speechText);
    };

    recognition.onerror = () => {
      alert("Could not recognize speech. Please try again.");
    };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinnerContainer}>
            <div style={styles.spinner}></div>
            <img src={BOT_AVATAR} alt="Bot" style={styles.loadingAvatar} />
          </div>
          <p style={styles.loadingText}>Initializing AI Assistant...</p>
          <p style={styles.loadingSubtext}>Powered by Gemini 2.0</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      {/* Animated Background */}
      <div style={styles.bgAnimation}></div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIconWrapper}>
            <img
              src={BOT_AVATAR}
              alt="Bot Avatar"
              style={styles.headerAvatar}
            />
            <div style={styles.onlineIndicator}></div>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Bharadwaj AI Assistant</h1>
            <p style={styles.headerSubtitle}>
              <span style={styles.statusDot}>●</span> Online • Powered by Gemini
              2.0
            </p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main style={styles.chatMain}>
        {/* Messages Area */}
        <div style={styles.messagesContainer} ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateContent}>
                <div style={styles.emptyStateIconWrapper}>
                  <img
                    src={BOT_AVATAR}
                    alt="Bot"
                    style={styles.emptyStateAvatar}
                  />
                  <div style={styles.glowEffect}></div>
                </div>
                <h2 style={styles.emptyStateTitle}>Welcome! 👋</h2>
                <p style={styles.emptyStateSubtitle}>
                  I'm your AI assistant. How can I help you today?
                </p>
                <div style={styles.suggestionChips}>
                  <div
                    style={styles.chip}
                    onClick={() => setUserInput("Tell me a joke")}
                  >
                    😄 Tell me a joke
                  </div>
                  <div
                    style={styles.chip}
                    onClick={() => setUserInput("Explain quantum computing")}
                  >
                    🔬 Explain quantum computing
                  </div>
                  <div
                    style={styles.chip}
                    onClick={() => setUserInput("Write a poem")}
                  >
                    ✍️ Write a poem
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={index}
                    style={{
                      ...styles.messageRow,
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      animation: "fadeIn 0.4s ease-out",
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageWrapper,
                        flexDirection: isUser ? "row-reverse" : "row",
                      }}
                    >
                      {/* Avatar */}
                      <div style={styles.avatarWrapper}>
                        {isUser ? (
                          <div style={styles.userAvatar}>
                            <span style={styles.avatarText}>U</span>
                          </div>
                        ) : (
                          <img
                            src={BOT_AVATAR}
                            alt="Bot"
                            style={styles.botAvatar}
                          />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(isUser ? styles.userBubble : styles.botBubble),
                        }}
                      >
                        <div style={styles.messageText}>{msg.message}</div>
                        <div
                          style={{
                            ...styles.timestamp,
                            color: isUser
                              ? "rgba(191, 219, 254, 0.8)"
                              : "rgba(216, 180, 254, 0.8)",
                          }}
                        >
                          {msg.timestamp?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div
                  style={{
                    ...styles.messageRow,
                    justifyContent: "flex-start",
                    animation: "fadeIn 0.4s ease-out",
                  }}
                >
                  <div
                    style={{ ...styles.messageWrapper, flexDirection: "row" }}
                  >
                    <div style={styles.avatarWrapper}>
                      <img
                        src={BOT_AVATAR}
                        alt="Bot"
                        style={styles.botAvatar}
                      />
                    </div>
                    <div
                      style={{ ...styles.messageBubble, ...styles.botBubble }}
                    >
                      <div style={styles.typingIndicator}>
                        <div
                          style={{ ...styles.typingDot, animationDelay: "0ms" }}
                        ></div>
                        <div
                          style={{
                            ...styles.typingDot,
                            animationDelay: "150ms",
                          }}
                        ></div>
                        <div
                          style={{
                            ...styles.typingDot,
                            animationDelay: "300ms",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type your message here..."
              style={styles.input}
            />

            <button
              onClick={startRecognition}
              style={styles.micButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(147, 51, 234, 0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(147, 51, 234, 0.15)")
              }
              title="Voice input"
            >
              <Mic style={{ fontSize: 20 }} />
            </button>

            <button
              onClick={sendMessage}
              disabled={!userInput.trim()}
              style={{
                ...styles.sendButton,
                opacity: userInput.trim() ? 1 : 0.5,
                cursor: userInput.trim() ? "pointer" : "not-allowed",
                transform: userInput.trim() ? "scale(1)" : "scale(0.95)",
              }}
              onMouseEnter={(e) => {
                if (userInput.trim()) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(147, 51, 234, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (userInput.trim()) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(147, 51, 234, 0.4)";
                }
              }}
              title="Send message"
            >
              <Send style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Made with <span style={styles.heart}>❤️</span> by
          <a
            href="https://www.youtube.com/@code-with-Bharadwaj"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.brandLink}
            onMouseEnter={(e) => (e.target.style.color = "#ec4899")}
            onMouseLeave={(e) => (e.target.style.color = "#a855f7")}
          >
            Bharadwaj
          </a>
          • © 2024 All Rights Reserved
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }

        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7 0%, #ec4899 100%);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea 0%, #db2777 100%);
        }
      `}</style>
    </div>
  );
};

const styles = {
  loadingContainer: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #581c87 35%, #7e22ce 65%, #0f172a 100%)",
    backgroundSize: "400% 400%",
    animation: "gradient 8s ease infinite",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  loadingContent: {
    textAlign: "center",
    zIndex: 1,
  },
  spinnerContainer: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto",
  },
  spinner: {
    width: "120px",
    height: "120px",
    border: "4px solid rgba(168, 85, 247, 0.2)",
    borderTop: "4px solid #a855f7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    position: "absolute",
    top: 0,
    left: 0,
  },
  loadingAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "3px solid rgba(168, 85, 247, 0.5)",
    animation: "pulse 2s ease-in-out infinite",
  },
  loadingText: {
    marginTop: "30px",
    color: "#fff",
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  loadingSubtext: {
    color: "#d8b4fe",
    fontSize: "14px",
    fontWeight: "400",
  },
  mainContainer: {
    minHeight: "100vh",
    background: "#0a0118",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgAnimation: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
    animation: "gradient 10s ease infinite",
    backgroundSize: "400% 400%",
    pointerEvents: "none",
  },
  header: {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIconWrapper: {
    position: "relative",
  },
  headerAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid rgba(168, 85, 247, 0.6)",
    background: "rgba(0, 0, 0, 0.3)",
    animation: "glow 3s ease-in-out infinite",
    background: "white",
    padding: "3px",
  },
  onlineIndicator: {
    width: "12px",
    height: "12px",
    background: "#10b981",
    borderRadius: "50%",
    position: "absolute",
    bottom: "2px",
    right: "2px",
    border: "2px solid rgba(0, 0, 0, 0.6)",
    animation: "pulse 2s ease-in-out infinite",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #fff 0%, #d8b4fe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "13px",
    color: "#d8b4fe",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  statusDot: {
    color: "#10b981",
    fontSize: "10px",
  },
  chatMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "20px 16px",
    position: "relative",
    zIndex: 1,
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    paddingRight: "8px",
    minHeight: 0,
  },
  emptyState: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  emptyStateContent: {
    textAlign: "center",
    maxWidth: "500px",
  },
  emptyStateIconWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 24px",
  },
  emptyStateAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid rgba(168, 85, 247, 0.4)",
    background: "rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 1,
  },
  glowEffect: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "140px",
    height: "140px",
    background:
      "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "pulse 3s ease-in-out infinite",
  },
  emptyStateTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    marginBottom: "12px",
  },
  emptyStateSubtitle: {
    color: "#d8b4fe",
    fontSize: "16px",
    marginBottom: "28px",
    lineHeight: "1.6",
  },
  suggestionChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  chip: {
    background: "rgba(168, 85, 247, 0.15)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "20px",
    padding: "10px 18px",
    color: "#d8b4fe",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  messageWrapper: {
    display: "flex",
    gap: "14px",
    maxWidth: "75%",
    alignItems: "flex-start",
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(59, 130, 246, 0.3)",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
  },
  botAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid rgba(168, 85, 247, 0.4)",
    background: "rgba(0, 0, 0, 0.3)",
    objectFit: "cover",
    background: "white",
    padding: "3px",
    borderRadius: "50%",
  },
  avatarText: {
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
  },
  messageBubble: {
    borderRadius: "18px",
    padding: "14px 18px",
    wordBreak: "break-word",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  userBubble: {
    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    color: "white",
    borderTopRightRadius: "6px",
  },
  botBubble: {
    background: "rgba(17, 24, 39, 0.8)",
    backdropFilter: "blur(20px)",
    color: "white",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    borderTopLeftRadius: "6px",
  },
  messageText: {
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  timestamp: {
    fontSize: "11px",
    marginTop: "6px",
    fontWeight: "500",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    padding: "4px 0",
  },
  typingDot: {
    width: "10px",
    height: "10px",
    background: "#a855f7",
    borderRadius: "50%",
    animation: "bounce 1.4s ease-in-out infinite",
  },
  inputContainer: {
    background: "rgba(17, 24, 39, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    padding: "10px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    position: "relative",
    zIndex: 2,
  },
  inputWrapper: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    background: "transparent",
    color: "white",
    border: "none",
    outline: "none",
    padding: "14px 18px",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
  },
  micButton: {
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(147, 51, 234, 0.15)",
    color: "#d8b4fe",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    padding: "14px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)",
  },

  /* ⭐ The only new style added */
  brandLink: {
    color: "#a855f7",
    fontWeight: "700",
    marginLeft: "6px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "0.3s ease",
  },

  footer: {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(168, 85, 247, 0.2)",
    padding: "16px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  footerText: {
    fontSize: "13px",
    color: "#d8b4fe",
    margin: 0,
    fontWeight: "400",
  },
  heart: {
    color: "#ec4899",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default App;
