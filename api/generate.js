import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, type } = req.body;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Write a ${type} about ${topic}`,
    });

    res.status(200).json({ output: response.output_text });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
