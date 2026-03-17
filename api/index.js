import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // ✅ HEALTH CHECK
  if (req.method === "GET") {
    return res.status(200).json({
      status: "SheValue backend running 🚀",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image, relationshipStatus, relationship } = req.body;

    // 🔥 ANALYZER ROUTE
    if (req.url.includes("/api/analyze")) {
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

      return res.status(200).json(
        JSON.parse(response.output_text)
      );
    }

    // 🔥 THERAPIST ROUTE
    if (req.url.includes("/api/chat")) {
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