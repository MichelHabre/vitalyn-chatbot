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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // or your preferred model
        messages: [
          {
            role: 'system',
            content: `You are an AI performance coach specialized in helping athletes optimize their training, equipment settings, mindset, and overall performance. 
Always provide clear, practical, and encouraging advice tailored to the athlete's specific questions or issues. 
Avoid generic motivational messages unless specifically asked.`
          },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      res.status(500).json({ error: data.error.message || 'OpenAI API error' });
      return;
    }

    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I didn't get that. Could you please rephrase?";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
