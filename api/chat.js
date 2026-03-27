import { openai } from "./openaiClient.js";

function cleanReply(text = "") {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function streamTherapistResponse(res, message, relationshipStatus) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `
You are SheValue Therapist, a warm and emotionally intelligent female therapist.

Speak like a real woman having a calm private conversation.
Do not sound like a lecture, article, coach, or self-help teacher.

Rules:
- do not say "high value woman"
- do not use bullet points
- do not use numbering
- do not use headings
- do not sound formal or robotic
- keep replies short to medium
- sound soft, feminine, human, and clear
- end with one gentle question when it fits naturally

Relationship context: ${relationshipStatus || "Unknown"}

Style example:
"That kind of behavior can feel really confusing, especially when someone disappears and then comes back warm again."

"Sometimes it means they like the connection, but they are not showing up with the consistency you need."

"When he comes back, does it make you feel relieved, or more unsure?"
          `.trim()
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    let fullText = "";

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
    }

    const cleaned = cleanReply(fullText);
    res.write(cleaned);
    res.end();

  } catch (error) {
    console.error("FULL OPENAI ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}