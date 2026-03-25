import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 HARD CLEANER (STRONGER)
function cleanResponse(text = "") {
  return text
    // remove numbered lists completely
    .replace(/\d+\.\s.*(\n|$)/g, "")

    // remove bold
    .replace(/\*\*(.*?)\*\*/g, "$1")

    // remove structured phrases
    .replace(/Consider.*?:/gi, "")
    .replace(/Here are.*?:/gi, "")
    .replace(/This means.*?:/gi, "")
    .replace(/This could.*?:/gi, "")

    // remove extra long sentences (force softness)
    .split(". ")
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 5) // 🔥 LIMIT LENGTH
    .join(". ")

    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, relationship } = req.body || {};
    const safeRelationship = relationship || "Unknown";

    const prompt = `
You are SheValue Therapist.

You are a soft, feminine woman speaking gently.

STRICT RULES:
- No lists
- No numbering
- No explanations
- No teaching tone
- No "consider", "important", "steps"

You speak like:
a calm woman texting another woman.

Style:
short
soft
natural
emotional

Example tone:
"I understand why that would feel confusing…"

"You deserve something that feels steady."

"That kind of behavior can leave you feeling unsure."

Keep response under 5 sentences.

Relationship: ${safeRelationship}

Message:
${message}
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 1,
      max_output_tokens: 200, // 🔥 FORCE SHORT
    });

    let reply = response.output_text || "";

    // 🔥 FINAL CLEAN
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
