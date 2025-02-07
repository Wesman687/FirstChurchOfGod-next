export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      console.log("📨 Incoming request:", req.body); // ✅ Debugging
  
      const response = await fetch("http://209.38.61.69:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Email API Error:", errorData);
        return res.status(response.status).json({ error: errorData });
      }
  
      const data = await response.json();
      console.log("✅ Email sent successfully:", data);
      return res.status(200).json(data);
    } catch (error) {
      console.error("🔥 Internal Server Error:", error);
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
  