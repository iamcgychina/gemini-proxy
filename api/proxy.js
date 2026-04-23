const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const AUTH_TOKEN = "gemini-qoder-2026";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers["x-auth-token"] || "";
  if (authHeader !== AUTH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const targetUrl = GEMINI_API_BASE + req.url;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": req.headers["x-goog-api-key"] || "",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
