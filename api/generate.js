import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache
const cache = new Map();

export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow any origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      topic,
      type,
      count = 1,
      max_words = 150,
      tone = "neutral",
      style = "informative",
      keywords = []
    } = req.body;

    if (!topic || !type) {
      return res.status(400).json({ error: "Missing 'topic' or 'type'" });
    }

    // Generate a unique cache key based on input
    const cacheKey = JSON.stringify({ topic, type, count, max_words, tone, style, keywords });

    // Check if result is cached
    if (cache.has(cacheKey)) {
      return res.status(200).json({
        success: true,
        cached: true,
        outputs: cache.get(cacheKey)
      });
    }

    const outputs = [];

    for (let i = 0; i < count; i++) {
      let prompt = `Write a ${type} about "${topic}" in under ${max_words} words. `;
      prompt += `Tone: ${tone}. Style: ${style}. `;
      if (keywords.length > 0) {
        prompt += `Include keywords: ${keywords.join(", ")}.`;
      }

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
      });

      outputs.push(response.output_text);
    }

    // Store result in cache
    cache.set(cacheKey, outputs);

    res.status(200).json({
      success: true,
      cached: false,
      outputs
    });

  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
