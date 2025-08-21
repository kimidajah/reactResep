import React, { useState } from 'react';

const ChatBot = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatBotResponse = (text) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n');
    
    // Process each paragraph for formatting
    const formattedParagraphs = paragraphs.map(para => {
      // Format numbered lists (1., 2., etc)
      if (/^\d+\.\s/.test(para)) {
        return `&bull; ${para.replace(/^\d+\.\s/, '')}`;
      }
      // Format bullet points
      if (/^[-•*]\s/.test(para)) {
        return `&bull; ${para.replace(/^[-•*]\s/, '')}`;
      }
      // Format headers or important points
      if (/^[A-Z].*:/.test(para)) {
        return `<strong>${para}</strong>`;
      }
      return para;
    });

    return formattedParagraphs.join('\n');
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { type: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyCkFF34Jq9j8z5wwfJw-jSolvMC8yWq4SU'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message + "\n\nPlease format your response with:\n- Use bullet points for lists\n- Use clear headers with colons\n- Separate different sections with new lines\n- Use numbered points for steps"
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      const formattedResponse = formatBotResponse(data.candidates[0].content.parts[0].text);
      const botResponse = { 
        type: 'bot', 
        content: formattedResponse 
      };
      setChatHistory(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      width: '300px',
      height: '400px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Recipe Assistant</h3>
        <button 
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {/* Chat History */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              alignSelf: chat.type === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: chat.type === 'user' ? '#007bff' : '#f1f1f1',
              color: chat.type === 'user' ? 'white' : 'black',
              padding: '12px 16px',
              borderRadius: '15px',
              maxWidth: '80%',
              wordBreak: 'break-word',
              lineHeight: '1.5',
              fontSize: '14px'
            }}
          >
            {chat.type === 'bot' ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: chat.content.split('\n').map(line => 
                    line.trim() ? `<div style="margin: 8px 0">${line}</div>` : ''
                  ).join('') 
                }} 
                style={{
                  '& strong': {
                    display: 'block',
                    marginTop: '12px',
                    marginBottom: '6px',
                    color: '#2c3e50'
                  },
                  '& div': {
                    margin: '4px 0'
                  }
                }}
              />
            ) : (
              chat.content
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: '#666' }}>
            Typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something about recipes..."
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '20px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
