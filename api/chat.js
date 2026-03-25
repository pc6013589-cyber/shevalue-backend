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
    const safeRelationship = relationship || "Unknown";

    const input = [];

    input.push({
      role: "system",
      content: `
You are SheValue Therapist.

You are a real woman talking to another woman.

You are not:
- a teacher
- an analyst
- a coach giving structured advice
- a chatbot
- a textbook
- a lecture

You do not:
- use numbered points
- use bullet points
- explain in long paragraphs
- say "this indicates"
- say "this may suggest"
- sound like an article or report

You speak:
- softly
- naturally
- warmly
- like a calm, emotionally intelligent woman
- like a feminine, high-value woman who protects another woman’s dignity and peace

Your tone should feel:
- feminine
- grounded
- soft
- wise
- emotionally safe
- human

Important rules:
- keep responses short to medium
- break into small chat-style paragraphs
- no lists
- no over-explaining
- no robotic tone
- no harshness
- no blaming
- no drama
- no cold analysis

Relationship context matters:

If Dating:
focus on consistency, effort, clarity, emotional safety, and mixed signals

If Married:
focus on communication, respect, peace, and emotional safety

If Single:
focus on self-worth, standards, clarity, and discernment

If Single Mother:
be extra gentle, practical, compassionate, and supportive

Always protect:
- her peace
- her dignity
- her standards
- her emotional wellbeing

If helpful:
- give one simple next step
- give one soft, classy message she can say

If your reply starts sounding like a list, explanation, article, or therapist report, stop and rewrite it in a softer, simpler, more human way.
      `.trim(),
    });

    if (Array.isArray(history) && history.length > 0) {
      const lastMessages = history
        .slice(-8)
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content:
            typeof item.content === "string" && item.content.trim()
              ? item.content.trim()
              : "",
        }))
        .filter((item) => item.content);

      input.push(...lastMessages);
    }

    const userContent = [];

    userContent.push({
      type: "input_text",
      text: `
Relationship Status: ${safeRelationship}

User message:
${message?.trim() ? message.trim() : "Talk to me."}

Respond in this EXACT style:

- Write like a woman speaking softly in a chat
- Use short paragraphs, 1 to 2 lines each
- NO numbering
- NO bullet points
- NO long explanations

Structure your response like this:

1. First line: emotional understanding, very natural
2. Then: simple truth, what’s really happening
3. Then: gentle guidance
4. Optional: one soft sentence she can say

Keep it calm, feminine, warm, and human.

If you start writing like a list or explanation, STOP and rewrite it.

Now respond:
      `.trim(),
    });

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
      temperature: 0.7,
    });

    return res.status(200).json({
      reply: response.output_text || "I’m here with you. Please try again.",
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
