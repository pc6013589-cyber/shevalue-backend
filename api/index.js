import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const path = req.url || "";

  if (req.method === "GET") {
    return res.status(200).json({
      status: "SheValue backend running 🚀",
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image, relationshipStatus, relationship } = req.body || {};

    if (path.endsWith("/analyze") || path.includes("/analyze")) {
      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: `Return JSON ONLY:
{
  "feminine_score": number,
  "signal": "text",
  "risk_level": "low | medium | high",
  "suggested_reply": "text"
}`,
          },
          {
            role: "user",
            content: message || "Analyze this message",
          },
        ],
      });

      return res.status(200).json(JSON.parse(response.output_text));
    }

    if (path.endsWith("/chat") || path.includes("/chat")) {
      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are SheValue Therapist. Give calm, wise relationship advice.",
          },
          {
            role: "user",
            content: message || "Talk to me",
          },
        ],
      });

      return res.status(200).json({
        reply: response.output_text,
      });
    }

    return res.status(404).json({ error: "Route not found" });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}