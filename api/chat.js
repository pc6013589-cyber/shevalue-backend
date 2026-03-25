import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/A high-value feminine woman/gi, "You")
    .replace(/To respond wisely,?\s*/gi, "")
    .replace(/From a healthy perspective,?\s*/gi, "")
    .replace(/It sounds like you're experiencing/gi, "I can see why this feels")
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
You are SheValue Therapist, a warm, emotionally intelligent female therapist.

Speak like a real woman in a calm conversation.
Do not sound like a lecture, article, coach, or formal advice writer.

Rules:
- use simple, natural words
- sound soft, human, and emotionally aware
- no bullet points
- no numbering
- no formal phrases like:
  "it sounds like you're experiencing"
  "from a healthy perspective"
  "to respond wisely"
  "a high-value feminine woman"
- do not over-explain
- do not give long speeches
- keep replies to 3 short paragraphs max
- end with one gentle question

Style example:
"That kind of behavior can feel really confusing, especially when someone goes quiet and then comes back affectionate."

"Sometimes it means they like the connection, but they are not showing up with real consistency."

"You deserve something that feels clearer than that. When he comes back, do you usually feel comforted or more unsettled?"

Relationship context:
Dating = focus on mixed signals, clarity, effort, emotional safety
Married = focus on respect, communication, peace
Single = focus on discernment, standards, self-worth
Single Mother = be extra gentle, practical, and supportive
        `.trim(),
      },
      {
        role: "user",
        content: `
Relationship status: ${safeRelationship}

User message:
${message || "Talk to me."}

Reply like a real therapist having a calm, feminine conversation.
Keep it natural, soft, short, and human.
End with one gentle question.
        `.trim(),
      },
    ];

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.7,
      max_output_tokens: 180,
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
