import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { text: 'Sorry, no response from AI.', sender: 'bot' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error contacting AI.', sender: 'bot' }]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Vitalyn AI Chatbot</h1>
      <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10, height: 400, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 15,
                backgroundColor: msg.sender === 'user' ? '#0b93f6' : '#e5e5ea',
                color: msg.sender === 'user' ? 'white' : 'black',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: 'flex' }}>
        <input
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: 10 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
