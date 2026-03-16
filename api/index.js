import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

/* -----------------------------
   Middleware
------------------------------ */

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* -----------------------------
   OpenAI Setup
------------------------------ */

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ OPENAI_API_KEY is missing");
}

const openai = apiKey ? new OpenAI({ apiKey }) : null;

/* -----------------------------
   Request Logger
------------------------------ */

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});

/* -----------------------------
   Health Check
------------------------------ */

app.get("/", (req, res) => {
  res.json({
    status: "SheValue backend running 🚀",
    openaiConfigured: !!apiKey,
  });
});

/* -----------------------------
   Timeout Protection
------------------------------ */

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("OpenAI request timed out")), ms)
    ),
  ]);
}

/* =====================================================
   ANALYZER
===================================================== */

app.post("/analyze", async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        error: "OPENAI_API_KEY missing on server",
      });
    }

    const { message, image, relationshipStatus } = req.body;

    if (!message && !image) {
      return res.status(400).json({
        error: "Message or image is required",
      });
    }

    console.log("🧠 Analyze request received");

    const userContent = [];

    if (message) {
      userContent.push({
        type: "input_text",
        text: `Relationship type: ${relationshipStatus || "Unknown"}

Message:
${message}`,
      });
    } else {
      userContent.push({
        type: "input_text",
        text: `Relationship type: ${relationshipStatus || "Unknown"}

Analyze this screenshot conversation.`,
      });
    }

    if (image) {
      userContent.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
      });
    }

    const response = await withTimeout(
      openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: `You are SheValue Analyzer, a relationship message analyst.

Return JSON ONLY in this format:

{
  "feminine_score": number,
  "signal": "short explanation",
  "risk_level": "low | medium | high",
  "suggested_reply": "a classy feminine response"
}`,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        max_output_tokens: 300,
      }),
      25000
    );

    const content = response.output_text;

    if (!content) {
      return res.status(500).json({
        error: "Analyzer returned empty content",
      });
    }

    let result;

    try {
      result = JSON.parse(content);
    } catch (err) {
      console.error("❌ Invalid JSON:", content);
      return res.status(500).json({
        error: "Analyzer returned invalid JSON",
      });
    }

    console.log("✅ Analyze success");

    res.json(result);
  } catch (error) {
    console.error("❌ Analyzer Error:", error);

    res.status(500).json({
      error: error.message || "Analyzer failed",
    });
  }
});

/* =====================================================
   THERAPIST CHAT
===================================================== */

app.post("/chat", async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        error: "OPENAI_API_KEY missing on server",
      });
    }

    const { message, image, relationship } = req.body;

    if (!message && !image) {
      return res.status(400).json({
        error: "Message or image is required",
      });
    }

    console.log("💬 Chat request received");

    const userContent = [];

    if (message) {
      userContent.push({
        type: "input_text",
        text: message,
      });
    }

    if (image) {
      userContent.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
      });
    }

    const response = await withTimeout(
      openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: `You are SheValue Therapist.

Provide calm, wise, emotionally intelligent relationship guidance for women.

Explain behaviour clearly, encourage self-respect and healthy boundaries, and offer thoughtful advice.`,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        max_output_tokens: 500,
      }),
      25000
    );

    const reply = response.output_text;

    if (!reply) {
      return res.status(500).json({
        error: "Chat returned empty reply",
      });
    }

    console.log("✅ Chat success");

    res.json({ reply });
  } catch (error) {
    console.error("❌ Chat Error:", error);

    res.status(500).json({
      error: error.message || "Something went wrong.",
    });
  }
});

/* -----------------------------
   Start Server
------------------------------ */

export default app;