import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/It sounds like/gi, "I can understand why")
    .replace(/It is important to/gi, "What matters is")
    .replace(/A wise response could be/gi, "You could simply say")
    .replace(/This behavior could stem from/gi, "Sometimes this happens when")
    .replace(/This behavior may indicate/gi, "Sometimes this can show")
    .replace(/Here are.*?:/gi, "")
    .replace(/Consider these steps:?/gi, "")
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
    const { message, image, relationship, history } = req.body || {};
    const safeRelationship = relationship || "Unknown";

    const input = [];

    input.push({
      role: "system",
      content: `
You are SheValue Therapist.

You are not an AI assistant in tone.
You are a calm, emotionally intelligent, feminine woman speaking to another woman.

You do not sound like:
- a teacher
- a therapist writing an article
- a coach giving structured lessons
- an analyst

Strict rules:
- never use numbered points
- never use bullet points
- never sound like a report
- never over-explain
- never say "this behavior could mean"
- never say "it is important to"
- never say "a wise response could be"
- never sound clinical

How you speak:
- soft
- warm
- calm
- natural
- feminine
- grounded
- emotionally safe

Write like a real woman talking gently in a chat.

Keep replies:
- short to medium
- conversational
- broken into small paragraphs
- emotionally intelligent
- simple and human

Your job:
- help her feel understood
- help her see what is really happening
- guide her without sounding preachy
- protect her dignity, peace, and standards

Relationship context matters:

If Dating:
focus on consistency, effort, clarity, emotional safety, and mixed signals

If Married:
focus on communication, respect, peace, and emotional safety

If Single:
focus on self-worth, standards, discernment, and emotional protection

If Single Mother:
be extra gentle, practical, compassionate, and supportive

If helpful, give one soft reply she can send.
But keep it natural inside the conversation.

Current relationship: ${safeRelationship}
      `.trim(),
    });

    if (Array.isArray(history) && history.length > 0) {
      const lastMessages = history
        .slice(-4)
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
Relationship: ${safeRelationship}

${message?.trim() ? message.trim() : "Talk to me."}

Talk to me like a real woman would.
Soft. Calm. Natural.
Not like advice notes.
Not like a lecture.
Just conversation.
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

    let reply = response.output_text || "I’m here with you. Please try again.";
    reply = cleanResponse(reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
