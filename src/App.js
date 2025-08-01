import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
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
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.reply) {
        typeEffect(data.reply);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, something went wrong. Please try again.", sender: "bot" }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: "Error connecting to AI.", sender: "bot" }]);
    }
  };

  const typeEffect = (text) => {
    let i = 0;
    const typingSpeed = 50;
    let displayText = "";

    const interval = setInterval(() => {
      displayText += text.charAt(i);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.sender === "bot") {
          updated[updated.length - 1].text = displayText;
        } else {
          updated.push({ text: displayText, sender: "bot" });
        }
        return updated;
      });

      i++;
      if (i >= text.length) clearInterval(interval);
    }, typingSpeed);
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Vitalyn is thinking...</div>}
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
