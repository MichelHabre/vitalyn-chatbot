import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { text: "Sorry, something went wrong. Please try again.", sender: "bot" }]);
      } else {
        await typeMessage(data.reply);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error contacting AI.", sender: "bot" }]);
    } finally {
      setTyping(false);
    }
  };

  const typeMessage = (text) => {
    return new Promise((resolve) => {
      let i = 0;

      // ✅ Add a new empty bot message BEFORE typing
      setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text += text[i]; // Append to the last message (the bot's message)
          return updated;
        });
        i++;
        scrollToBottom(); // Keep scrolling as it types
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 25); // Typing speed
    });
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {typing && <div className="typing-indicator">Typing...</div>}
        <div ref={chatEndRef}></div>
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          autoFocus
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
