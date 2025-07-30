import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Vitalyn, your AI performance coach. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">Vitalyn AI</h1>
        <p className="text-gray-400 mt-2">Your AI Performance Coach</p>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-3xl bg-black bg-opacity-70 rounded-2xl shadow-lg p-6 flex flex-col h-[70vh] border border-green-500">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-md ${
                msg.sender === 'user'
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-green-300 border border-green-500'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="bg-gray-800 text-green-400 px-4 py-3 rounded-2xl text-sm">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="mt-4 flex">
          <input
            className="flex-1 bg-gray-900 text-white p-4 rounded-xl border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-green-500 text-black px-6 py-3 rounded-xl shadow hover:bg-green-400 transition font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
