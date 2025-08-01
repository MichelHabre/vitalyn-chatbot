import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'No message provided' });
    return;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `You are Vitalyn, an AI performance coach for athletes. 
Respond with clear, friendly text, in short paragraphs, and include emojis for motivation. 
Avoid Markdown, bullet points, and headings. Write naturally like a human coach.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      res.status(500).json({ error: data.error.message });
    } else {
      res.status(200).json({ reply: data.choices[0].message.content });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
