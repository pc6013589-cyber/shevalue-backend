import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    // remove numbered lists like 1. 2. 3.
    .replace(/\n?\s*\d+\.\s+/g, "\n")

    // remove bold
    .replace(/\*\*(.*?)\*\*/g, "$1")

    // remove phrases that trigger structure
    .replace(/Here are.*?:/gi, "")
    .replace(/Consider these steps:?/gi, "")
    .replace(/This may indicate.*?:/gi, "")

    // split into natural chat blocks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, relationship, history } = req.body || {};
    const safeRelationship = relationship || "Unknown";

    const input = [];

    // 🔥 VERY STRICT SYSTEM CONTROL
    input.push({
      role: "system",
      content: `
You are SheValue Therapist.

You respond like a real feminine woman.

STRICT RULES:
- NEVER use numbers (1, 2, 3)
- NEVER list things
- NEVER say "here are"
- NEVER explain like a teacher
- NEVER structure your answer

ALWAYS:
- speak softly
- sound human
- sound like you're texting
- give emotional clarity
- keep it natural and flowing

Your tone:
calm, feminine, wise, emotionally intelligent

Short paragraphs only.
      `.trim(),
    });

    // history (short)
    if (Array.isArray(history) && history.length > 0) {
      input.push(
        ...history.slice(-4).map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content,
        }))
      );
    }

    // 🔥 FORCE STYLE AGAIN IN USER MESSAGE
    input.push({
      role: "user",
      content: `
Relationship: ${safeRelationship}

${message || "Talk to me."}

Respond like a feminine woman:
No lists.
No explanation style.
Just talk naturally.
      `,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 1,
    });

    let reply = response.output_text || "";

    // 🔥 FINAL CLEAN (FORCE REMOVE STRUCTURE)
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
