import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanResponse(text = "") {
  return text
    // remove numbered lists
    .replace(/^\s*\d+\.\s*\*\*.*?\*\*:?/gm, "")
    .replace(/^\s*\d+\.\s*/gm, "")

    // remove bullet points
    .replace(/^\s*[-•]\s*/gm, "")

    // remove bold markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")

    // split into smaller feminine chat paragraphs
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.length > 180 ? line.slice(0, 180) : line)
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

You speak like a real woman.

Soft. Calm. Feminine. Warm.

No lists.
No numbering.
No explaining like a teacher.

Just natural conversation.
      `.trim(),
    });

    if (Array.isArray(history) && history.length > 0) {
      const lastMessages = history
        .slice(-6)
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content || "",
        }));

      input.push(...lastMessages);
    }

    input.push({
      role: "user",
      content: `
Relationship: ${safeRelationship}

${message || "Talk to me."}

Reply like a calm feminine woman:
- short
- soft
- human
- no structure
      `,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.9,
    });

    let reply = response.output_text || "";

    // 🔥 FORCE CLEAN STYLE
    reply = cleanResponse(reply);

    return res.status(200).json({
      reply,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
