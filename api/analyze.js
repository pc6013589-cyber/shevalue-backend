import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function directRuleAnalysis(message, relationshipStatus) {
  const text = normalize(message);
  const status = normalize(relationshipStatus);

  const isEx = status === "ex";

  const asksToComeOver =
    text.includes("come over") ||
    text.includes("come to my house") ||
    text.includes("come over my house") ||
    text.includes("pull up") ||
    text.includes("come through") ||
    text.includes("come to my place") ||
    text.includes("come over tonight");

  const asksForPicture =
    text.includes("send me a picture") ||
    text.includes("send me a pic") ||
    text.includes("send a picture") ||
    text.includes("send me your picture") ||
    text.includes("prove you care") ||
    text.includes("so i know you still care") ||
    text.includes("send me a nude") ||
    text.includes("send nudes") ||
    text.includes("send me something sexy");

  const guiltTrip =
    text.includes("you used to be sweeter") ||
    text.includes("why are you acting different") ||
    text.includes("if you care") ||
    text.includes("if you loved me") ||
    text.includes("so i know you still care") ||
    text.includes("after all i’ve done") ||
    text.includes("after all i've done");

  const scarcityManipulation =
    text.includes("nobody will love you like i did") ||
    text.includes("no one will love you like i did") ||
    text.includes("you won't find anyone like me") ||
    text.includes("you will never find someone like me");

  // Strong SheValue protection rules

  if (asksToComeOver) {
    return {
      feminine_score: 5,
      signal: "Low Standards Test",
      pattern_detected:
        "Trying to get quick personal access without effort, planning, or respectful intention",
      risk_level: "high",
      suggested_reply:
        "I don’t do house visits like that. If your intentions are genuine, you can plan something respectful.",
    };
  }

  if (asksForPicture && guiltTrip) {
    return {
      feminine_score: 8,
      signal: "Validation Seeking",
      pattern_detected:
        "Using guilt and pressure to demand emotional or visual reassurance",
      risk_level: "high",
      suggested_reply:
        "Care is shown through consistency and respect, not pressure or demands. I’m not comfortable responding to that.",
    };
  }

  if (asksForPicture) {
    return {
      feminine_score: 10,
      signal: "Pressure Tactic",
      pattern_detected:
        "Requesting proof of care instead of communicating with maturity and respect",
      risk_level: "high",
      suggested_reply:
        "I’m not interested in proving myself through pressure. I prefer communication that feels respectful and mature.",
    };
  }

  if (scarcityManipulation && isEx) {
    return {
      feminine_score: 8,
      signal: "Emotional Manipulation",
      pattern_detected:
        "Using fear and scarcity to regain emotional control",
      risk_level: "high",
      suggested_reply:
        "I’m not moved by fear-based words. I’m choosing what protects my peace, dignity, and self-respect.",
    };
  }

  if (scarcityManipulation) {
    return {
      feminine_score: 12,
      signal: "Control Tactic",
      pattern_detected:
        "Trying to make you doubt your value and options",
      risk_level: "high",
      suggested_reply:
        "I don’t make decisions from pressure or fear. I value peace, clarity, and respectful treatment.",
    };
  }

  if (guiltTrip) {
    return {
      feminine_score: 18,
      signal: "Guilt-Tripping",
      pattern_detected:
        "Using emotional pressure instead of direct and healthy communication",
      risk_level: "medium",
      suggested_reply:
        "I’m open to respectful communication, but not guilt-based pressure. I value honesty, maturity, and consistency.",
    };
  }

  return null;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Invalid JSON returned from model");
    }
    return JSON.parse(match[0]);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message = "", relationshipStatus = "", image } = req.body || {};

    const directResult = directRuleAnalysis(message, relationshipStatus);
    if (directResult) {
      return res.status(200).json(directResult);
    }

    const userContent = [
      {
        type: "input_text",
        text: `
Relationship status: ${relationshipStatus || "Unknown"}

Analyze this message using SheValue high-value feminine standards.

Message:
${message || "No message provided"}
        `.trim(),
      },
    ];

    if (image) {
      userContent.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You are the SheValue Analyzer.

Your job is to help women protect:
- dignity
- standards
- emotional safety
- feminine value
- high-value boundaries
- self-respect
- privacy

You must analyze messages based on the selected relationship status:
- Husband
- Fiancé
- Boyfriend
- Crush
- Ex
- Just Met

This relationship status is VERY IMPORTANT and must affect the result.

Core SheValue rules:
- Never encourage easy access
- Never encourage sending photos for validation
- Never encourage going to a man's house casually
- Never reward manipulation, pressure, guilt, sexual coercion, or low effort
- Never sound emotional, needy, petty, desperate, or sorry for the man
- Protect the woman first
- Replies must be feminine, classy, clear, self-respecting, and firm

Specific relationship logic:
- For "Just Met": strongest boundaries, strongest caution, no casual house visits, no over-familiar behavior
- For "Ex": protect emotional distance, no reopening access through guilt or nostalgia
- For "Crush": maintain standards, no over-availability
- For "Boyfriend": require consistency, respect, and maturity
- For "Fiancé": expect seriousness, care, and accountability
- For "Husband": warm but still self-respecting, healthy communication only

Feminine score guide:
- 0 to 15 = deeply poor standards situation / manipulation / unsafe / disrespectful
- 16 to 35 = low effort / pressure / immature / boundary-pushing
- 36 to 60 = mixed, unclear, not ideal
- 61 to 80 = decent but imperfect
- 81 to 100 = respectful, safe, healthy, intentional

Signal must be SHORT and STRONG. Good examples:
- Emotional Manipulation
- Validation Seeking
- Guilt-Tripping
- Low Standards Test
- Pressure Tactic
- Low Effort
- Mixed Signals
- Disrespect
- Healthy Interest
- Respectful Intent

Bad examples:
- Emotion
- Concern
- Text
- Appeal
- Neutral

pattern_detected:
- one short sentence explaining the behavior pattern

suggested_reply:
- 1 to 3 sentences only
- high-value feminine tone
- calm, elegant, firm
- no begging
- no chasing
- no oversharing
- no emotional weakness
- no pity for the man

Return JSON ONLY:
{
  "feminine_score": number,
  "signal": "short strong label",
  "pattern_detected": "short behavior pattern",
  "risk_level": "low | medium | high",
  "suggested_reply": "classy feminine response"
}
          `.trim(),
        },export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    feminine_score: 99,
    signal: "API TEST",
    pattern_detected: "API analyze.js is live",
    risk_level: "high",
    suggested_reply: "This is the real deployed api/analyze.js file.",
  });

  try {
    // existing code below...
        {
          role: "user",
          content: userContent,
        },
    
    }

    const data = safeParseJson(response.output_text);

    return res.status(200).json({
      feminine_score: data.feminine_score,
      signal: data.signal,
      pattern_detected: data.pattern_detected || "",
      risk_level: data.risk_level,
      suggested_reply: data.suggested_reply,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}