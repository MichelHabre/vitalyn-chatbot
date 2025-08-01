import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import logo from './logo.png';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.reply) {
        await typeMessage(data.reply);
      } else {
        await typeMessage("Sorry, something went wrong. Please try again.");
      }
    } catch {
      setIsTyping(false);
      await typeMessage("Sorry, something went wrong. Please try again.");
    }
  };

  const typeMessage = (text) => {
    return new Promise((resolve) => {
      let i = 0;
      setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = text.slice(0, i + 1);
          return updated;
        });

        i++;
        scrollToBottom();

        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 9);
    });
  };

  return (
    <>
      <header>
  <img src={logo} alt="Vitalyn Logo" />
  <div className="brand">
    <span className="brand-name">Vitalyn.AI</span>
    <span className="tagline">Your Personal Sports Performance Coach</span>
  </div>
    </header>
      <div className="container">
        <h1 className="title">Vitalyn AI Chatbot</h1>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
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
    </>
  );
}

export default App;
