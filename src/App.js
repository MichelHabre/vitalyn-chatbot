import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input after sending message
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  // Function to simulate typing effect for bot
  const typeBotReply = async (fullText) => {
    setIsTyping(true);
    let displayedText = '';
    for (let i = 0; i < fullText.length; i++) {
      displayedText += fullText[i];
      setMessages(prev => {
        const msgs = [...prev];
        // Replace last bot message or add if not exists
        if (msgs[msgs.length - 1]?.sender === 'bot') {
          msgs[msgs.length - 1].text = displayedText;
        } else {
          msgs.push({ text: displayedText, sender: 'bot' });
        }
        return msgs;
      });
      await new Promise(r => setTimeout(r, 25)); // Typing speed: 25ms per char (faster)
    }
    setIsTyping(false);
  };

  // Call OpenAI API to get bot reply
  const getBotReply = async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      if (data.error) return "Sorry, something went wrong. Please try again.";
      return data.reply;
    } catch {
      return "Sorry, couldn't connect to AI. Check your connection.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botReply = await getBotReply(userMessage.text);
    await typeBotReply(botReply);
  };

  return (
    <div className="container">
      <h1>Vitalyn AI Chatbot</h1>
      <div className="chat-window" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isTyping}
          autoComplete="off"
        />
        <button onClick={sendMessage} disabled={isTyping}>Send</button>
      </div>
    </div>
  );
}

export default App;
