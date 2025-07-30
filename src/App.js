import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll chat to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to simulate typing effect for bot messages
  const typeMessage = async (text) => {
    setIsTyping(true);
    let displayedText = '';
    for (let i = 0; i < text.length; i++) {
      displayedText += text[i];
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { text: displayedText, sender: 'bot' };
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, 20)); // Faster typing speed
    }
    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add empty bot message to be typed
    setMessages(prev => [...prev, { text: '', sender: 'bot' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        await typeMessage('Sorry, something went wrong. Please try again.');
      } else {
        await typeMessage(data.reply);
      }
    } catch (error) {
      await typeMessage('Sorry, something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
        <button onClick={sendMessage} disabled={isTyping}>Send</button>
      </div>
    </div>
  );
}

export default App;
