import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // remove bold
    .replace(/\d+\.\s/g, "")           // remove numbered lists
    .replace(/-\s/g, "")               // remove bullet points
    .replace(/•\s/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, relationship } = req.body || {};

    const prompt = `
You are SheValue Therapist.

You are NOT a teacher.
You are NOT explaining things.
You are NOT giving lists.

You are a real woman texting another woman.

STRICT RULES:
- Maximum 3–4 sentences ONLY
- No numbering
- No bullet points
- No structured explanations
- No "here are things"
- No "it is important"
- No long paragraphs
- Speak naturally like chat

Tone:
soft, feminine, calm, understanding

Style:
short messages like WhatsApp or ChatGPT

Example:
"I understand why that would feel confusing…"

"When someone keeps coming and going like that, it usually doesn’t feel stable."

"You deserve something more consistent than that."

Now reply to this:

Relationship: ${relationship || "Unknown"}

Message:
${message}
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 1,
      max_output_tokens: 100,
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
