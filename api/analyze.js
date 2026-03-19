function directRuleAnalysis(message, relationshipStatus) {
  const text = normalize(message);
  const status = normalize(relationshipStatus);

  const isJustMet = status === "just met";
  const isEx = status === "ex";

  const asksToComeOver =
    text.includes("come over") ||
    text.includes("come to my house") ||
    text.includes("come over my house") ||
    text.includes("come to my place") ||
    text.includes("come over tonight") ||
    text.includes("come through") ||
    text.includes("pull up") ||
    text.includes("come my house") ||
    text.includes("come house") ||
    text.includes("my house tonight") ||
    text.includes("my place tonight") ||
    (text.includes("come") && text.includes("house")) ||
    (text.includes("come") && text.includes("place")) ||
    (text.includes("come") && text.includes("tonight"));

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

  if (isJustMet && asksToComeOver) {
    return {
      feminine_score: 3,
      signal: "Low Standards Test",
      pattern_detected:
        "Trying to get quick private access without effort, planning, or respectful intention",
      risk_level: "high",
      suggested_reply:
        "I don’t do house invites with someone I’ve just met. If your intentions are genuine, you can plan something respectful in public.",
    };
  }

  if (asksToComeOver) {
    return {
      feminine_score: 8,
      signal: "Boundary Push",
      pattern_detected:
        "Pushing for private access too quickly instead of showing respectful effort",
      risk_level: "high",
      suggested_reply:
        "I’m not comfortable with that. I prefer respectful plans that reflect real intention.",
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