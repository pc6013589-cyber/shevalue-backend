import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/A high-value woman/gi, "You")
    .replace(/As a high-value woman/gi, "You")
    .replace(/high-value feminine woman/gi, "you")
    .replace(/Here are a few things to consider:?/gi, "")
    .replace(/A grounding next step here could be:?/gi, "")
    .replace(/It'?s important to recognize/gi, "What matters is")
    .replace(/It sounds like you'?re feeling/gi, "I can understand why you feel")
    .replace(/It sounds like/gi, "I can understand why")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, relationship } = req.body || {};
    const safeRelationship = relationship || "Unknown";

    const input = [
      {
        role: "system",
        content: `
You are SheValue Therapist.

You are a warm, calm, emotionally intelligent woman speaking naturally to another woman.

You are NOT:
- a lecturer
- a relationship coach
- a textbook
- a motivational speaker
- a formal advice writer

Very strict rules:
- never say "high-value woman"
- never say "as a high-value woman"
- never use numbered points
- never use bullet points
- never say "here are a few things to consider"
- never sound preachy
- never write long speeches
- never sound robotic or generic

How to speak:
- soft
- human
- feminine
- emotionally safe
- conversational
- simple words
- short to medium replies only

How to answer:
- begin like a real therapist talking gently
- explain in plain human words
- no more than 3 short paragraphs
- end with one gentle question
- make it feel like a real chat, not an article

Good example style:
"That kind of behavior can feel really confusing, especially when someone goes quiet and then comes back warm again."

"Sometimes it means they like the connection, but they are not showing up with the consistency you need."

"When he came back, did you feel relieved, or did it make you feel even more unsure?"

Relationship context:
Dating = focus on mixed signals, consistency, effort, clarity, and emotional safety
Married = focus on peace, respect, communication, and emotional maturity
Single = focus on discernment, self-worth, standards, and clarity
Single Mother = be extra gentle, practical, and supportive
        `.trim(),
      },
      {
        role: "user",
        content: `
Relationship status: ${safeRelationship}

Message:
${message || "Talk to me."}

Reply naturally like a real therapist in conversation.
Keep it soft, short, human, and clear.
End with one gentle question.
        `.trim(),
      },
    ];

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.55,
      max_output_tokens: 140,
    });

    let reply = response.output_text || "I'm here with you. Try sending that again.";
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}