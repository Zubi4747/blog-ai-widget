const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, type } = req.body;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a blogging assistant that generates SEO-friendly, AdSense-safe content." },
        { role: "user", content: `Generate a ${type} response for: ${topic}` }
      ],
      max_tokens: 400,
    });

    res.status(200).json({
      output: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
};
