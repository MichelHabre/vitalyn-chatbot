import React, { useState } from 'react';
import './styles.css';  // Import the CSS file

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput('');

    // Replace this with real API call later
    const botReply = await fakeBotReply(input);
    setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
  };

  // Fake bot reply for demo
  const fakeBotReply = (message) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("This is a placeholder reply. Replace with OpenAI API call.");
      }, 1000);
    });
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

<div className="container" style={{ border: '5px solid red' }}>
