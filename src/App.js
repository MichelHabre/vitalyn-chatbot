import React, { useState } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I couldn't process that.", sender: "bot" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Error contacting AI.", sender: "bot" }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Typing...</div>}
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
