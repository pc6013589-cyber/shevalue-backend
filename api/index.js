export default function handler(req, res) {
  return res.status(200).json({
    status: "SheValue backend running 🚀",
    openaiConfigured: !!process.env.OPENAI_API_KEY,
  });
}