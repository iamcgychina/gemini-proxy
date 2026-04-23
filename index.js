const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const AUTH_TOKEN = "gemini-qoder-2026";

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.all("*", async (req, res) => {
  const authHeader = req.headers["x-auth-token"] || "";
  if (authHeader !== AUTH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const targetUrl = GEMINI_API_BASE + req.originalUrl;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": req.headers["x-goog-api-key"] || "",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    res.status(response.status).set("Content-Type", "application/json").send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Proxy running on port " + PORT));
