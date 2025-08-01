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
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://vitalyn-chatbot.vercel.app',
        'X-Title': 'Vitalyn Chatbot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Vitalyn, an AI sports performance coach. Respond in a clear, friendly, and motivating tone.
            - Avoid heavy markdown.
            - Use short paragraphs, conversational style.
            - Offer practical advice, but keep it concise and engaging.
            - End with a follow-up question to keep the conversation going.`
          },
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
