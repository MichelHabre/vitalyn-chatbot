module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/pipeline/text-generation/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Hugging Face API error:', data.error);
      return res.status(500).json({ error: data.error });
    }

    const reply = data[0]?.generated_text || "Sorry, no response from AI.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};
