export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_EMAIL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("❌ Proxy Error:", error);
      return res.status(500).json({ error: "Failed to reach email API" });
    }
  }
  