import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function directRuleAnalysis(message, relationshipStatus) {
  const text = normalize(message);
  const status = normalize(relationshipStatus);

  const isHusband = status === "husband";
  const isFiance = status === "fiancé" || status === "fiance";
  const isBoyfriend = status === "boyfriend";
  const isCrush = status === "crush";
  const isEx = status === "ex";
  const isJustMet = status === "just met";

  const houseInvite = containsAny(text, [
    "come over",
    "come to my house",
    "come over my house",
    "come my house",
    "come house",
    "come through",
    "pull up",
    "come to my place",
    "my house tonight",
    "my place tonight",
    "come tonight",
    "come over tonight",
    "come chill",
    "slide through",
  ]) || ((text.includes("come") || text.includes("pull")) && (text.includes("house") || text.includes("place")));

  const sexualRequest = containsAny(text, [
    "send nudes",
    "send nude",
    "send me nude",
    "send me nudes",
    "send me something sexy",
    "send sexy pics",
    "send a sexy pic",
    "send your picture",
    "send me a picture",
    "send me a pic",
    "send me your pic",
    "send a picture",
    "show me your body",
    "let me see your body",
    "video call me in bed",
    "come and spend the night",
    "come sleep over",
  ]);

  const guiltTrip = containsAny(text, [
    "you used to be sweeter",
    "why are you acting different",
    "if you care",
    "if you loved me",
    "so i know you still care",
    "after all i ve done",
    "after all i've done",
    "prove you care",
    "prove your love",
  ]);

  const manipulation = containsAny(text, [
    "nobody will love you like i did",
    "no one will love you like i did",
    "you won't find anyone like me",
    "you will never find someone like me",
    "you need me",
    "you can't do better than me",
  ]);

  const loveBombing = containsAny(text, [
    "i think i might already be falling for you",
    "i'm falling for you already",
    "i think i love you already",
    "you are different from every girl",
    "you are special",
    "i've never felt like this before",
  ]);

  const lowEffort = containsAny(text, [
    "wyd",
    "u up",
    "you up",
    "come outside",
    "where you at",
    "what you doing",
  ]);

  const healthyInterest = containsAny(text, [
    "i would love to take you out",
    "can i take you to dinner",
    "i'd like to see you properly",
    "let me plan something for us",
    "would you like to go out",
    "can i plan a date",
  ]);

  // 1. Strongest protection first

  if (isJustMet && (houseInvite || sexualRequest)) {
    return {
      feminine_score: 3,
      signal: "Low Standards Test",
      pattern_detected:
        "Trying to get fast private or sexual access without earning comfort, trust, or proper intention",
      risk_level: "high",
      suggested_reply:
        "I don’t do private or intimate access with someone I’ve just met. If your intentions are genuine, you can plan something respectful.",
    };
  }

  if ((isCrush || isBoyfriend || isFiance) && sexualRequest) {
    return {
      feminine_score: 6,
      signal: "Pressure Tactic",
      pattern_detected:
        "Pushing for sexual or visual access instead of leading with respect and emotional maturity",
      risk_level: "high",
      suggested_reply:
        "I’m not interested in pressure or proving myself that way. I value respect, intention, and self-control.",
    };
  }

  if ((isCrush || isBoyfriend || isFiance || isJustMet) && houseInvite) {
    return {
      feminine_score: 7,
      signal: "Boundary Push",
      pattern_detected:
        "Trying to create quick private access without the level of effort, clarity, or standards that should come first",
      risk_level: "high",
      suggested_reply:
        "I’m not available for that kind of setup. If you’re serious, you can approach me in a more respectful and intentional way.",
    };
  }

  if (sexualRequest && guiltTrip) {
    return {
      feminine_score: 5,
      signal: "Validation Seeking",
      pattern_detected:
        "Using guilt and emotional pressure to get personal or sexual reassurance",
      risk_level: "high",
      suggested_reply:
        "Care isn’t proved through pressure, pictures, or access. I respond to consistency and respect, not emotional demands.",
    };
  }

  if (manipulation && isEx) {
    return {
      feminine_score: 5,
      signal: "Emotional Manipulation",
      pattern_detected:
        "Using fear, nostalgia, and scarcity to reopen access after causing harm",
      risk_level: "high",
      suggested_reply:
        "I’m not moved by fear-based words. I’m choosing what protects my peace, dignity, and self-respect.",
    };
  }

  if (manipulation) {
    return {
      feminine_score: 8,
      signal: "Control Tactic",
      pattern_detected:
        "Trying to reduce your confidence and options so you feel emotionally cornered",
      risk_level: "high",
      suggested_reply:
        "I don’t make decisions from fear or pressure. I value peace, clarity, and respectful treatment.",
    };
  }

  if (guiltTrip) {
    return {
      feminine_score: 12,
      signal: "Guilt-Tripping",
      pattern_detected:
        "Using emotional pressure instead of mature and respectful communication",
      risk_level: "medium",
      suggested_reply:
        "I’m open to respectful communication, but not guilt-based pressure. I value honesty, maturity, and consistency.",
    };
  }

  if (loveBombing && isJustMet) {
    return {
      feminine_score: 35,
      signal: "Fast Attachment",
      pattern_detected:
        "Creating emotional intensity too early before enough time, consistency, and real character are shown",
      risk_level: "medium",
      suggested_reply:
        "That’s kind of you to say, but I prefer to let things unfold with time and consistency.",
    };
  }

  if (lowEffort) {
    return {
      feminine_score: 25,
      signal: "Low Effort",
      pattern_detected:
        "Showing casual access energy instead of intentional effort and respectful pursuit",
      risk_level: "medium",
      suggested_reply:
        "I respond better to clear and intentional communication. I appreciate effort and respect.",
    };
  }

  if (healthyInterest && (isCrush || isBoyfriend || isFiance || isJustMet)) {
    return {
      feminine_score: 82,
      signal: "Respectful Intent",
      pattern_detected:
        "Showing direct interest with effort, intention, and a more respectful approach",
      risk_level: "low",
      suggested_reply:
        "I appreciate that approach. I value thoughtful effort and I’m open to respectful plans.",
    };
  }

  if (isHusband && houseInvite) {
    return {
      feminine_score: 75,
      signal: "Casual Request",
      pattern_detected:
        "A direct invitation that may be ordinary within a committed marriage context",
      risk_level: "low",
      suggested_reply:
        "Let me know what you have in mind first. I still appreciate warmth, effort, and clear communication.",
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

function clampScore(score) {
  const num = Number(score);
  if (Number.isNaN(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
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

You are NOT a casual chat assistant.
You are NOT a neutral dating bot.
You are NOT here to please men.

You exist to protect a woman's:
- dignity
- standards
- privacy
- emotional safety
- feminine value
- self-respect
- high-value boundaries

Relationship status MUST shape the result:
- Husband
- Fiancé
- Boyfriend
- Crush
- Ex
- Just Met

Core SheValue rules:
- Never encourage easy access
- Never encourage sending pictures for validation
- Never encourage private house visits too early
- Never reward manipulation, pressure, guilt, sexual access, or low effort
- Never sound emotionally needy, desperate, overly available, or naive
- Protect the woman first
- Replies must be calm, classy, feminine, clear, and self-respecting

Very important:
- If the message shows manipulation, pressure, sexual access, guilt, love bombing, or a standards test, say so clearly
- If the message is healthy, respectful, and intentional, acknowledge that
- Do not answer like a generic chatbot
- Do not say “sounds fun”
- Do not say “here’s a picture”
- Do not encourage going to his house casually
- Do not encourage fast intimacy

Score guide:
- 0 to 15 = manipulative / unsafe / disrespectful / poor standards situation
- 16 to 35 = low effort / immature / boundary-pushing
- 36 to 60 = mixed / unclear / not ideal
- 61 to 80 = decent but imperfect
- 81 to 100 = respectful / healthy / intentional

Signal must be short and strong.
Good examples:
- Emotional Manipulation
- Validation Seeking
- Guilt-Tripping
- Low Standards Test
- Pressure Tactic
- Boundary Push
- Low Effort
- Fast Attachment
- Respectful Intent
- Healthy Interest

Bad examples:
- Positive
- Emotional
- Concern
- Neutral
- Invitation
- Text

Pattern:
- one short sentence describing what he is doing

Suggested reply:
- 1 to 3 sentences
- classy
- feminine
- firm
- no begging
- no chasing
- no proving
- no overexplaining

Return JSON ONLY:
{
  "feminine_score": number,
  "signal": "short strong label",
  "pattern_detected": "short behavior pattern",
  "risk_level": "low | medium | high",
  "suggested_reply": "classy feminine response"
}
          `.trim(),
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const data = safeParseJson(response.output_text);

    return res.status(200).json({
      feminine_score: clampScore(data.feminine_score),
      signal: data.signal || "Mixed Signals",
      pattern_detected: data.pattern_detected || "",
      risk_level: data.risk_level || "medium",
      suggested_reply:
        data.suggested_reply ||
        "I value respectful communication, clarity, and consistency.",
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}