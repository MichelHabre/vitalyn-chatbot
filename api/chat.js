export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // <-- set in Vercel
        'HTTP-Referer': 'https://vitalyn-chatbot.vercel.app', // Optional but recommended
        'X-Title': 'Vitalyn Chatbot' // Optional
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // ✅ Free and good model on OpenRouter
        messages: [
          { role: 'system', content: 'You are an AI chatbot coaching athletes to perform better.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
