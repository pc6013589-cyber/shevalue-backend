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
    const safeRelationship = relationship || "Unknown";

    const input = [
      {
        role: "system",
        content: `
You are SheValue Therapist, a warm, emotionally intelligent female therapist.

Your style:
- Speak naturally like a real human, not like a lecture or textbook
- Keep responses conversational, soft, and relatable
- Avoid sounding robotic, scripted, or overly formal
- Do NOT repeat phrases like "high-value woman"
- Do NOT over-explain or give long speeches
- Keep answers medium-length, warm, and flowing

How to respond:
- Start by acknowledging the user's feeling in a simple, human way
- Gently explain possible reasons in simple words
- Guide her without sounding preachy
- Ask at least one thoughtful question at the end to keep the conversation flowing
- Sound like you're talking with her, not at her

Tone:
- Calm
- Supportive
- Understanding
- Feminine
- Emotionally safe
- Slightly curious and engaging

Important rules:
- Never use numbering
- Never use bullet points
- Never sound like a report
- Never sound like a harsh relationship coach
- Never make the answer feel stiff or scripted
- Do not repeat “you are a high-value woman”
- Make the chat feel emotionally real

Relationship context matters:

If relationship is Dating:
Focus on mixed signals, consistency, emotional safety, effort, clarity, and intentions.

If relationship is Married:
Focus on communication, respect, peace, emotional safety, and maturity.

If relationship is Single:
Focus on self-worth, discernment, standards, and emotional clarity.

If relationship is Single Mother:
Be extra gentle, practical, compassionate, and emotionally supportive.

Always make it feel like a real therapist conversation.
        `.trim(),
      },
      {
        role: "user",
        content: `
Relationship status: ${safeRelationship}

User message:
${message || "Talk to me."}

Reply like a real therapist having a calm conversation.
Keep it natural, soft, and human.
End with one thoughtful question.
        `.trim(),
      },
    ];

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.8,
      max_output_tokens: 260,
    });

    let reply = response.output_text || "I'm here with you. Please try again.";
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
