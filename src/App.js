import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll when messages change
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.reply) {
        await typeMessage(data.reply);
      } else {
        await typeMessage("Sorry, something went wrong. Please try again.");
      }
    } catch {
      await typeMessage("Sorry, something went wrong. Please try again.");
    }
  };

  // FIXED typing effect (includes first character)
  const typeMessage = (text) => {
    return new Promise((resolve) => {
      let i = 0;
      setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          lastMessage.text = text.slice(0, i + 1); // ✅ includes first character
          return updated;
        });

        i++;
        scrollToBottom();

        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 25); // typing speed
    });
  };

  return (
    <div className="container">
      <h1 className="title">Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="input-area">
        <input
          ref={inputRef}
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
