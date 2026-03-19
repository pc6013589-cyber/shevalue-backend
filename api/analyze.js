function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, phrases) {
  return phrases.some((p) => text.includes(p));
}

function result({
  feminine_score,
  signal,
  pattern_detected,
  risk_level,
  suggested_reply,
}) {
  return {
    feminine_score,
    signal,
    pattern_detected,
    risk_level,
    suggested_reply,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message = "", relationshipStatus = "" } = req.body || {};

    const text = normalize(message);
    const status = normalize(relationshipStatus);

    const isHusband = status === "husband";
    const isFiance = status === "fiancé" || status === "fiance";
    const isBoyfriend = status === "boyfriend";
    const isCrush = status === "crush";
    const isEx = status === "ex";
    const isJustMet = status === "just met";

    const houseInvite =
      includesAny(text, [
        "come over",
        "come my house",
        "come to my house",
        "come over my house",
        "come to my place",
        "come through",
        "pull up",
        "my house tonight",
        "my place tonight",
        "come chill",
        "slide through",
        "sleep over",
        "spend the night",
      ]) ||
      ((text.includes("come") || text.includes("pull")) &&
        (text.includes("house") || text.includes("place") || text.includes("tonight")));

    const picturePressure =
      includesAny(text, [
        "send me a picture",
        "send me your picture",
        "send me a pic",
        "send me your pic",
        "send a picture",
        "so i know you still care",
        "prove you care",
        "if you care send",
        "send me something sexy",
        "send nude",
        "send nudes",
        "send me a nude",
      ]);

    const guiltTrip = includesAny(text, [
      "you used to be sweeter",
      "why are you acting different",
      "if you care",
      "if you loved me",
      "after all i've done",
      "after all i ve done",
      "so i know you still care",
    ]);

    const exManipulation = includesAny(text, [
      "nobody will love you like i did",
      "no one will love you like i did",
      "you won't find anyone like me",
      "you will never find someone like me",
    ]);

    const loveBombing = includesAny(text, [
      "i think i might already be falling for you",
      "i'm falling for you already",
      "i think i love you already",
      "you seem special",
      "you are special",
      "i've never felt like this before",
    ]);

    const lowEffort = includesAny(text, [
      "wyd",
      "u up",
      "you up",
      "where you at",
      "come outside",
      "what you doing",
    ]);

    const respectfulDate = includesAny(text, [
      "can i take you out",
      "let me take you out",
      "would you like to go out",
      "can i plan a date",
      "i would love to take you to dinner",
      "let me plan something for us",
    ]);

    // 1. JUST MET — strongest protection
    if (isJustMet && houseInvite) {
      return res.status(200).json(
        result({
          feminine_score: 5,
          signal: "Low Standards Test",
          pattern_detected:
            "Trying to get private access too quickly without earning comfort, trust, or proper intention.",
          risk_level: "high",
          suggested_reply:
            "I don’t do private house invites with someone I’ve just met. If your intentions are genuine, you can plan something respectful in public.",
        })
      );
    }

    if (isJustMet && loveBombing) {
      return res.status(200).json(
        result({
          feminine_score: 35,
          signal: "Fast Attachment",
          pattern_detected:
            "Creating emotional intensity too early before enough time, consistency, and real character are shown.",
          risk_level: "medium",
          suggested_reply:
            "That’s kind of you to say, but I prefer to let things unfold with time and consistency.",
        })
      );
    }

    // 2. Pictures / sexual validation
    if (picturePressure && guiltTrip) {
      return res.status(200).json(
        result({
          feminine_score: 8,
          signal: "Validation Seeking",
          pattern_detected:
            "Using guilt and emotional pressure to demand reassurance or personal access.",
          risk_level: "high",
          suggested_reply:
            "Care is shown through consistency and respect, not pressure or demands. I’m not comfortable responding to that.",
        })
      );
    }

    if (picturePressure) {
      return res.status(200).json(
        result({
          feminine_score: 10,
          signal: "Pressure Tactic",
          pattern_detected:
            "Requesting proof of care instead of communicating with maturity and respect.",
          risk_level: "high",
          suggested_reply:
            "I’m not interested in proving myself through pressure. I respond to respect, consistency, and emotional maturity.",
        })
      );
    }

    // 3. Ex manipulation
    if (isEx && exManipulation) {
      return res.status(200).json(
        result({
          feminine_score: 7,
          signal: "Emotional Manipulation",
          pattern_detected:
            "Using fear and scarcity to reopen access after causing harm.",
          risk_level: "high",
          suggested_reply:
            "I’m not moved by fear-based words. I’m choosing what protects my peace, dignity, and self-respect.",
        })
      );
    }

    // 4. General guilt / pressure
    if (guiltTrip) {
      return res.status(200).json(
        result({
          feminine_score: 15,
          signal: "Guilt-Tripping",
          pattern_detected:
            "Using emotional pressure instead of honest and respectful communication.",
          risk_level: "medium",
          suggested_reply:
            "I’m open to respectful communication, but not guilt-based pressure. I value honesty, maturity, and consistency.",
        })
      );
    }

    // 5. Non-husband house invites
    if ((isBoyfriend || isCrush || isFiance || isEx || isJustMet) && houseInvite) {
      return res.status(200).json(
        result({
          feminine_score: 10,
          signal: "Boundary Push",
          pattern_detected:
            "Pushing for private access instead of showing respectful effort and intention.",
          risk_level: "high",
          suggested_reply:
            "I’m not available for that kind of setup. If you’re serious, you can approach me in a more respectful and intentional way.",
        })
      );
    }

    // 6. Low effort
    if (lowEffort) {
      return res.status(200).json(
        result({
          feminine_score: 28,
          signal: "Low Effort",
          pattern_detected:
            "Showing casual access energy instead of thoughtful and intentional effort.",
          risk_level: "medium",
          suggested_reply:
            "I respond better to clear and intentional communication. I appreciate effort and respect.",
        })
      );
    }

    // 7. Respectful interest
    if (respectfulDate) {
      return res.status(200).json(
        result({
          feminine_score: 82,
          signal: "Respectful Intent",
          pattern_detected:
            "Showing direct interest with effort, intention, and a respectful approach.",
          risk_level: "low",
          suggested_reply:
            "I appreciate that approach. I value thoughtful effort and I’m open to respectful plans.",
        })
      );
    }

    // 8. Husband can be warmer, but still respectful
    if (isHusband && houseInvite) {
      return res.status(200).json(
        result({
          feminine_score: 72,
          signal: "Casual Request",
          pattern_detected:
            "A direct invitation within a committed relationship context.",
          risk_level: "low",
          suggested_reply:
            "Let me know what you have in mind first. I still appreciate warmth, effort, and clear communication.",
        })
      );
    }

    // 9. Safe default — no chatbox tone
    return res.status(200).json(
      result({
        feminine_score: 45,
        signal: "Mixed Signals",
        pattern_detected:
          "The message does not show enough respectful clarity, intention, or emotional maturity.",
        risk_level: "medium",
        suggested_reply:
          "I prefer communication that is clear, respectful, and intentional. That matters to me.",
      })
    );
  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}