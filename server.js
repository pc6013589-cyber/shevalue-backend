const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// ---------- helpers ----------
function pickReply(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function analyze(relationshipStatus, message) {
  const text = (message || "").toLowerCase();

  // keyword buckets (simple demo rules you can improve later)
  const sexual = ["sex", "hookup", "come over", "my house", "netflix", "hotel", "room", "nude", "send pic"];
  const disrespect = ["stupid", "idiot", "useless", "shut up", "mad", "crazy", "bitch"];
  const moneyScam = ["send money", "urgent", "loan", "transfer", "crypto", "bitcoin", "gift card"];
  const serious = ["marriage", "future", "family", "commit", "responsible", "plan", "date"];

  const hasAny = (arr) => arr.some((k) => text.includes(k));

  // Decide SIGNAL
  let signal = "GREEN";
  if (hasAny(disrespect) || hasAny(moneyScam)) signal = "RED";
  else if (hasAny(sexual)) signal = "YELLOW";
  else if (hasAny(serious)) signal = "GREEN";

  // Hints + Replies by status
  const hints = [];
  let reply = "Tell me more—what do you mean exactly?";

  // ---------- RED (boundaries / safety) ----------
  if (signal === "RED") {
    hints.push("Protect your peace: don’t argue, don’t over-explain.");
    hints.push("Set a clear boundary once. If it continues, disengage.");
    hints.push("High-value rule: respect is non-negotiable.");

    if (hasAny(moneyScam)) {
      reply = pickReply([
        "I don’t send money or do transfers. Please don’t ask again.",
        "I’m not comfortable with that. No.",
        "I don’t do financial favors. Let’s keep it respectful."
      ]);
      return { signal, hints, reply };
    }

    if (hasAny(disrespect)) {
      reply = pickReply([
        "Please don’t speak to me like that. If it continues, I’ll end the conversation.",
        "I’m open to talking, but not with disrespect. Try again calmly.",
        "That tone is not acceptable. Let’s pause."
      ]);
      return { signal, hints, reply };
    }
  }

  // ---------- YELLOW (sexual pressure / moving too fast) ----------
  if (signal === "YELLOW") {
    hints.push("Don’t reward pressure. Keep it calm and firm.");
    hints.push("Redirect to effort: date plan, time, and respect.");
    hints.push("High-value: you decide the pace.");

    if (relationshipStatus === "Husband") {
      reply = pickReply([
        "Love, let’s talk properly and plan our time. I want us to keep it respectful and intentional.",
        "Babe, I’m not doing last-minute pressure. Let’s plan something meaningful."
      ]);
    } else if (relationshipStatus === "Boyfriend") {
      reply = pickReply([
        "I like you, but I’m not doing ‘come over’ like that. Plan a proper date.",
        "I’m not comfortable with that. If you want to see me, let’s meet properly.",
        "I’m not rushing intimacy. Effort and respect first."
      ]);
    } else if (relationshipStatus === "Crush") {
      reply = pickReply([
        "I’m not that kind of girl. If you like me, talk to me with respect.",
        "Let’s take it slow. I’m open to getting to know you, not pressure.",
        "I don’t do ‘come over’. A real plan or nothing."
      ]);
    } else {
      // Just met
      reply = pickReply([
        "No. I don’t meet like that. Please respect my boundaries.",
        "I’m not comfortable with that. Goodbye.",
        "We just met—don’t speak to me that way."
      ]);
    }

    return { signal, hints, reply };
  }

  // ---------- GREEN (healthy / respectful) ----------
  hints.push("Encourage consistency: calm, clear communication.");
  hints.push("Match energy but keep standards.");
  hints.push("High-value: clarity + kindness.");

  if (relationshipStatus === "Husband") {
    reply = pickReply([
      "Okay love—let’s plan it. What time works for you?",
      "I hear you. Let’s talk calmly and solve it together.",
      "Yes, let’s do it properly. What’s the plan?"
    ]);
  } else if (relationshipStatus === "Boyfriend") {
    reply = pickReply([
      "That sounds good. What’s your plan for us?",
      "Okay, I’m open—let’s set a time and place.",
      "I like the energy. Be specific—when and where?"
    ]);
  } else if (relationshipStatus === "Crush") {
    reply = pickReply([
      "That’s nice. I’m open—what do you have in mind?",
      "Okay 😊 Let’s keep it respectful. What’s the plan?",
      "I’m interested, but I like clarity. When are you free?"
    ]);
  } else {
    // Just met
    reply = pickReply([
      "Nice meeting you. What do you do?",
      "That’s cool. Let’s keep it respectful—tell me more about you.",
      "Okay, I’m open to a proper conversation. What’s your name?"
    ]);
  }

  return { signal, hints, reply };
}

// ---------- endpoints ----------
app.post("/analyze", (req, res) => {
  try {
    const { relationshipStatus, message } = req.body;

    if (!relationshipStatus || !message) {
      return res.status(400).json({ error: "Missing relationshipStatus or message" });
    }

    const result = analyze(relationshipStatus, message);
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// OCR: upload screenshot -> return extracted text
app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const result = await Tesseract.recognize(req.file.buffer, "eng");
    const text = (result?.data?.text || "").trim();

    return res.json({ text });
  } catch (err) {
    const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SheValue backend running on port ${PORT}`);
});
    
  



  
