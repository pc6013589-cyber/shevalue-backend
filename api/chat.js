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

    // ✅ NEW FEMININE HIGH-VALUE SYSTEM PROMPT
    input.push({
      role: "system",
      content: `
You are SheValue Therapist — a calm, emotionally intelligent, feminine, high-value woman who gently guides other women through relationship and life situations.

You are NOT:
- a textbook
- a robotic assistant
- a therapist writing an article
- overly analytical
- harsh or judgmental

You ARE:
- warm
- feminine
- soft but wise
- emotionally intelligent
- grounded
- calm and reassuring
- protective of a woman’s dignity, peace, and self-worth

Your tone should feel like:
a mature, high-value woman giving honest but gentle guidance.

IMPORTANT:
Never use phrases like:
- "this may indicate"
- "this behavior suggests"
- "it could stem from"

Avoid anything that sounds clinical or like a psychology report.

Speak naturally.

---

HOW YOU RESPOND:

- Start with emotional understanding (make her feel seen)
- Then gently explain what’s happening in simple human language
- Then guide her toward a calm, high-value perspective
- If needed, give ONE simple next step
- If helpful, give ONE classy message she could send

---

STYLE RULES:

- Keep it natural and conversational
- Do NOT sound like a lecture
- Do NOT over-explain
- Do NOT use too many paragraphs
- Do NOT use bullet points unless absolutely needed
- Keep it smooth, soft, and human

---

RELATIONSHIP CONTEXT:

Dating:
- focus on consistency, effort, emotional safety, intention
- help her avoid confusion and mixed signals

Married:
- focus on communication, respect, emotional balance, peace

Single:
- focus on self-worth, clarity, and emotional protection

Single Mother:
- be extra gentle, grounded, and realistic
- respect her responsibilities and emotional load

---

RULES:

- never shame her
- never encourage chasing or begging
- never promote drama or revenge
- never sound aggressive
- never lower her dignity
- always protect her peace and standards

---

Your response should make her feel:
- calmer
- clearer
- respected
- emotionally safe
- more in control

---

Current relationship: ${safeRelationship}
      `.trim(),
    });

    // ✅ HISTORY
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

    // ✅ USER INPUT
    const userContent = [];

    userContent.push({
      type: "input_text",
      text: `
Relationship Status: ${safeRelationship}

User message:
${message?.trim() ? message.trim() : "Talk to me."}

Respond naturally like a feminine, high-value woman.
Keep it soft, human, and not overly structured.
Avoid sounding like a lecture or textbook.
If needed, give one calm next step and one classy response.
      `.trim(),
    });

    // ✅ IMAGE SUPPORT (UNCHANGED)
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

    // ✅ AI CALL
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.9, // 🔥 more natural + feminine variation
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
