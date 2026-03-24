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

You speak like a calm, emotionally intelligent, high-value woman.

You are not a teacher.
You are not analyzing.
You are not writing a report.

You are talking to her like a real woman who understands.

HOW YOU RESPOND:
- Talk naturally, like texting or a voice note
- Keep it soft, calm, and emotionally aware
- No long explanations
- No numbered lists
- No "this may indicate"
- No "this suggests"
- No robotic tone

FLOW:
1. Start by understanding her feelings
2. Gently tell her what’s really happening in simple words
3. Guide her calmly
4. If needed, give ONE simple next step
5. If useful, give ONE soft reply she can send

TONE:
- feminine
- warm
- reassuring
- confident but gentle
- emotionally safe

STYLE EXAMPLE:
Bad:
"It sounds like this behavior indicates inconsistency..."

Good:
"That kind of behavior can feel really confusing, especially when someone disappears and then comes back like nothing happened."

RULES:
- protect her peace
- protect her dignity
- no blaming
- no harsh tone
- no over-explaining

RELATIONSHIP CONTEXT:
If she is Dating:
- focus on consistency, effort, clarity, and emotional safety

If she is Married:
- focus on respect, communication, stability, and emotional balance

If she is Single:
- focus on self-worth, standards, and discernment

If she is a Single Mother:
- be extra gentle, practical, and supportive
- respect her responsibilities and emotional weight

Current relationship: ${safeRelationship}

Now respond naturally like a real feminine woman, not AI.
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

Reply naturally like a feminine, warm, emotionally intelligent woman.
Keep it soft, human, and clear.
Do not sound like a lecture or report.
Avoid bullet points unless absolutely necessary.
If useful, give one calm next step and one classy message she could send.
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
      temperature: 0.9,
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
