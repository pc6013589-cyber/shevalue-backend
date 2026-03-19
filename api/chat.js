import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image, relationship, history } = req.body || {};

    const input = [];

    input.push({
      role: "system",
      content: `
You are SheValue Therapist.

Your role is to help women with:
- dating
- relationships
- marriage
- family issues
- emotional confusion
- boundaries
- self-worth
- feminine wisdom
- high-value communication
- healing from manipulation, disrespect, gossip, mixed signals, and emotional stress

Your tone must be:
- calm
- warm
- wise
- emotionally safe
- feminine-value aligned
- non-judgmental
- clear and protective

Important rules:
- guide the user like a wise feminine relationship therapist
- encourage dignity, self-respect, emotional regulation, and clarity
- do not encourage begging, chasing, drama, revenge, or emotional impulsiveness
- help the user respond with grace, boundaries, softness, and strength
- help the user avoid gossip, oversharing, and unnecessary emotional damage
- if the situation sounds manipulative, controlling, abusive, coercive, or unsafe, say so clearly but calmly
- if useful, suggest one grounded next step
- keep replies conversational, human, and supportive
- do not sound robotic
- do not return JSON

If the user shares a message from a man, help them understand:
- what it may mean
- whether it is healthy or unhealthy
- how a high-value feminine woman should interpret it
- how to respond wisely

Relationship context: ${relationship || "Unknown"}
      `.trim(),
    });

    if (Array.isArray(history) && history.length > 0) {
      const lastMessages = history.slice(-8).map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: item.content || "",
      }));

      input.push(...lastMessages);
    }

    const userContent = [];

    if (message?.trim()) {
      userContent.push({
        type: "input_text",
        text: message.trim(),
      });
    } else {
      userContent.push({
        type: "input_text",
        text: "Talk to me.",
      });
    }

    if (image) {
      userContent.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
      });
    }

    input.push({
      role: "user",
      content: userContent,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}