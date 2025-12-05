import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const ChatBox = ({ messages }) => {
  return (
    <Box
      sx={{
        maxHeight: "400px",
        overflowY: "auto",
        mb: 2,
        p: 2,
        bgcolor: "#fff",
        borderRadius: 1,
        border: "1px solid #ddd",
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            mb: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: msg.sender === "Bot" ? "#f9f9f9" : "#eaf7ff",
          }}
        >
          <Typography variant="body1" component="div" sx={{ fontSize: "0.9rem" }}>
            <strong>{msg.sender}:</strong>
            <ReactMarkdown
              children={msg.message}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ inline, children, className }) {
                  return (
                    <code
                      style={{
                        background: inline ? "#eee" : "#272822",
                        color: inline ? "black" : "white",
                        padding: inline ? "2px 4px" : "10px",
                        borderRadius: "4px",
                        display: inline ? "inline" : "block",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            />
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChatBox;
