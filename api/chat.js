export default async function handler(req, res) {
  return res.status(200).json({
    reply: "🔥 NEW BACKEND IS ACTIVE 🔥",
  });
}
