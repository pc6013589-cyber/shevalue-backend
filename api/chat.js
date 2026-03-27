import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, relationship } = req.body || {};

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_output_tokens: 120,
      input: [
        {
          role: "system",
          content: `
You are a calm, emotionally intelligent female therapist.

Speak like a real woman talking naturally.
Do NOT sound like advice, lecture, or article.

Rules:
- no "high value woman"
- no bullet points
- no teaching tone
- no structured explanations
- keep it short (2–3 paragraphs max)
- sound soft, human, and real
- ask one gentle question at the end

Example style:
"That kind of behavior can feel really confusing, especially when someone disappears and then comes back like nothing happened."

"You might start wondering what’s really going on, and it can leave you feeling unsettled."

"You deserve something more consistent than that. When he comes back, how does it usually make you feel?"

Relationship context:
Dating → focus on mixed signals, clarity, emotional safety
Married → focus on respect, communication
Single → focus on standards and self-worth
Single Mother → be extra gentle and supportive
          `,
        },
        {
          role: "user",
          content: `
Relationship: ${relationship || "Dating"}

Message:
${message || "Talk to me"}

Reply naturally like a real conversation.
          `,
        },
      ],
    });

    let reply = response.output_text || "I'm here with you.";
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
