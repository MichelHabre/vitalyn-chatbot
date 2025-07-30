import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      if (data.reply) {
        await typeMessage(data.reply);
      } else {
        await typeMessage("Sorry, I couldn't process that.");
      }
    } catch (error) {
      console.error(error);
      await typeMessage("Error contacting AI.");
    }

    setIsTyping(false);
  };

  // Typing effect, faster now (15ms per char)
  const typeMessage = (fullText) => {
    return new Promise((resolve) => {
      let index = 0;
      const newMessage = { text: '', sender: 'bot' };
      setMessages(prev => [...prev, newMessage]);

      typingRef.current = setInterval(() => {
        if (index < fullText.length) {
          newMessage.text += fullText.charAt(index);
          setMessages(prev => {
            const msgs = [...prev];
            msgs[msgs.length - 1] = { ...newMessage };
            return msgs;
          });
          index++;
        } else {
          clearInterval(typingRef.current);
          resolve();
        }
      }, 15); // faster typing speed
    });
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isTyping && sendMessage()}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button onClick={sendMessage} disabled={isTyping}>Send</button>
      </div>
    </div>
  );
}

export default App;
