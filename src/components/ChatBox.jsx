import React from 'react';
import { Box, Typography } from '@mui/material';

const ChatBox = ({ messages }) => {
  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #ddd' }}>
      {messages.map((msg, index) => (
        <Box key={index} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: msg.sender === 'Bot' ? '#e3f2fd' : '#fff' }}>
          <Typography variant="body1" component="p" sx={{ fontSize: '0.9rem' }}>
            <strong>{msg.sender}:</strong> 
            <span dangerouslySetInnerHTML={{ __html: msg.message }} />
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChatBox;
