import React, { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

const MessageInput = ({ onSendMessage, onStartRecognition }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSendMessage(input);
    setInput('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        sx={{ mr: 1 }}
      />
      <IconButton color="primary" onClick={handleSend} sx={{ mr: 1 }}>
        <SendIcon />
      </IconButton>
      <IconButton color="primary" onClick={onStartRecognition}>
        <MicIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
