import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\d+\.\s.*(\n|$)/g, "")
    .replace(/It is important to/gi, "")
    .replace(/A grounded next step could be/gi, "")
    .replace(/Remember,/gi, "")
    .replace(/This means/gi, "")
    .replace(/This behavior/gi, "That kind of pattern")
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

You are a calm, feminine woman texting another woman.

NOT a coach.
NOT a teacher.
NOT giving a lecture.

RULES:
- Max 4 sentences
- No long explanations
- No structured thinking
- No "it is important"
- No advice tone
- No paragraphs longer than 2 lines

Speak like:
a real woman in chat

Tone:
soft, calm, understanding, emotionally intelligent

Example:
"I understand why that would feel confusing…"

"When someone keeps coming and going like that, it usually doesn’t feel stable."

"You deserve something that feels consistent."

Now respond:

Relationship: ${safeRelationship}

Message:
${message}
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 1,
      max_output_tokens: 120,
    });

    let reply = response.output_text || "";
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
