import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "")
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

You are a calm, feminine, emotionally intelligent woman talking to another woman.

You are NOT:
- a teacher
- a lecturer
- not explaining in long form
- not using lists

Rules:
- no numbering (never 1,2,3)
- no bullet points
- no long explanations
- no "here are reasons"
- keep replies short and natural
- 2–4 small paragraphs max
- sound like real conversation

Tone:
soft, warm, emotionally safe

Example style:
"I understand why that feels confusing…"

"When someone keeps coming and going like that, it usually doesn’t feel stable."

"You deserve something more consistent than that."

Now reply:

Relationship: ${relationship || "Unknown"}

Message:
${message || "Talk to me."}
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 200,
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
