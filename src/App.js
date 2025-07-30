import React, { useState, useEffect, useRef } from 'react';
import './style.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to animate typing effect
  const typeMessage = (fullText) => {
    return new Promise(resolve => {
      let i = 0;
      setIsTyping(true);
      let typed = '';
      const interval = setInterval(() => {
        typed += fullText.charAt(i);
        setMessages(prev => [...prev.slice(0, -1), { text: typed, sender: 'bot' }]);
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);
          resolve();
        }
      }, 25); // faster typing speed
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { text: input.trim(), sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add placeholder bot message for typing effect
    setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

    // Here replace with actual API call
    const botReply = await fakeBotReply(userMessage.text);

    await typeMessage(botReply);
  };

  // Fake bot reply for demo - replace with real API integration
  const fakeBotReply = (message) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Keep pushing your limits! Stay focused and hydrated. 💪");
      }, 1000);
    });
  };

  return (
    <div className="container">
      <h1 className="title">Vitalyn AI Coach</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Vitalyn is typing...</div>}
      </div>
      <div className="input-area">
        <input
          autoFocus
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Vitalyn for performance tips..."
          disabled={isTyping}
        />
        <button onClick={sendMessage} disabled={isTyping}>Send</button>
      </div>
    </div>
  );
}

export default App;
