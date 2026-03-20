export default async function handler(req, res) {
  return res.status(200).json({
    feminine_score: 99,
    signal: "API TEST",
    pattern_detected: "NEW BACKEND ACTIVE",
    risk_level: "high",
    suggested_reply: "This is coming from the updated backend.",
  });
}