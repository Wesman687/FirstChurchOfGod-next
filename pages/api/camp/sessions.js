import { connectToMongo } from "@/server/lib/mongo";
import { getAvailableCampSessions, parseSessionName } from "@/lib/campUtils";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const dbName = "campDatabase";

  try {
    const db = await connectToMongo(dbName);

    // Get all available sessions
    const availableSessions = getAvailableCampSessions();

    // Check which sessions actually have data
    const sessionsWithData = await Promise.all(
      availableSessions.map(async (session) => {
        try {
          const collection = db.collection(session.value);
          const count = await collection.countDocuments();
          return {
            ...session,
            registrationCount: count,
            hasData: count > 0,
          };
        } catch (error) {
          return {
            ...session,
            registrationCount: 0,
            hasData: false,
            error: error.message,
          };
        }
      })
    );

    return res.status(200).json({
      sessions: sessionsWithData,
      totalSessions: sessionsWithData.length,
      sessionsWithData: sessionsWithData.filter((s) => s.hasData).length,
    });
  } catch (error) {
    console.error("❌ Error fetching camp sessions:", error);
    return res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
