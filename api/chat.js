
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
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // You can also try "openai/gpt-4"
        messages: [
          { role: 'system', content: 'You are an AI performance coach for athletes.' },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter');
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: error.message });
  }
}
