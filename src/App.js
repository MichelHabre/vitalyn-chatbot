import React, { useState, useRef, useEffect } from 'react';
import './styles.css';  // Make sure you have styles.css in src/

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
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
    } catch (error) {
      await typeMessage("Sorry, something went wrong. Please try again.");
    }
  };

  // Typing animation fix
  const typeMessage = (text) => {
    return new Promise((resolve) => {
      let i = 0;
      setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

      setTimeout(() => {
        const interval = setInterval(() => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].text += text.charAt(i);
            return updated;
          });

          i++;
          scrollToBottom();

          if (i >= text.length) {
            clearInterval(interval);
            resolve();
          }
        }, 20); // typing speed
      }, 50); // delay before typing starts
    });
  };

  return (
    <div className="container">
      <h1 className="title">Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
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
