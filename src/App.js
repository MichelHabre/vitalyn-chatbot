import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.reply) {
        await typeEffect(data.reply);
      } else {
        setMessages(prev => [...prev, { text: "Error: No response from AI.", sender: "bot" }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: "Error contacting AI.", sender: "bot" }]);
    }
  };

  const typeEffect = async (text) => {
    let displayedText = "";
    for (let char of text) {
      displayedText += char;
      await new Promise(resolve => setTimeout(resolve, 20)); // typing speed
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.sender === "bot") {
          updated[updated.length - 1].text = displayedText;
        } else {
          updated.push({ text: displayedText, sender: "bot" });
        }
        return [...updated];
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-black'} transition-all`}>
      <header className="p-4 flex justify-between items-center shadow-md bg-opacity-80">
        <h1 className="text-2xl font-bold">Vitalyn AI</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl shadow text-sm ${msg.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl text-sm">
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 flex bg-opacity-80 shadow-lg">
        <input
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
