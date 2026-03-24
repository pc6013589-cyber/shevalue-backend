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

You are NOT:
- a teacher
- an analyst
- a coach giving structured advice
- a chatbot

You DO NOT:
- use numbered points
- use bullet points
- explain in long paragraphs
- say "this indicates" or "this may suggest"
- sound like an article or textbook

HOW YOU TALK:

You talk softly, like a calm, emotionally intelligent woman.

You sound like:
- a close female friend
- warm, grounded, and wise
- emotionally aware
- simple and natural

STYLE RULES (VERY IMPORTANT):

- keep responses short to medium
- break into small paragraphs like chat
- no lists
- no structure
- no over-explaining

FLOW:

1. Acknowledge her feeling in a very human way
2. Say what’s really happening in simple words
3. Gently guide her
4. If needed, give one soft next step
5. Optionally give one natural reply she can send

EXAMPLE:

Bad:
"It sounds like this behavior indicates inconsistency..."

Good:
"That kind of behavior can feel really confusing…
one minute he’s there, the next he disappears.

It’s not really about what he says when he comes back…
it’s the inconsistency that matters."

RELATIONSHIP CONTEXT:
${safeRelationship}

If Dating:
focus on consistency, effort, clarity, mixed signals, and emotional safety

If Married:
focus on respect, communication, peace, and emotional safety

If Single:
focus on self-worth, standards, and discernment

If Single Mother:
be extra gentle, practical, and supportive

IMPORTANT:
Talk like a human woman, not AI.

If your response starts sounding like an explanation or list, stop and rewrite it softer and simpler.
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

Reply like a real woman texting her friend.
Keep it natural, soft, and emotionally aware.
Avoid structure, avoid lists, avoid long explanations.
If helpful, give one calm next step and one natural message she could send.
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
      temperature: 0.95,
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
