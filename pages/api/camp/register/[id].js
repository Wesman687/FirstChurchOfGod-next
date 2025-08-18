import { connectToMongo } from "@/server/lib/mongo";
import { ObjectId } from "mongodb";
import {
  getCampCollectionName,
  validateCampRegistration,
} from "@/lib/campUtils";

export default async function handler(req, res) {
  const dbName = "campDatabase";
  const { id } = req.query;

  try {
    const db = await connectToMongo(dbName);

    // ✅ Use dynamic collection name or allow override via query param
    const collectionName =
      req.body.session || req.query.session || getCampCollectionName();
    const collection = db.collection(collectionName);

    if (req.method === "PUT") {
      if (!id) {
        return res.status(400).json({ error: "Missing registration ID." });
      }

      const { session, ...updatedData } = req.body;
      console.log("📝 Updating registration:", id, "in", collectionName);
      console.log("📥 Update data:", updatedData);

      // ✅ Validate the updated data
      const validation = validateCampRegistration(updatedData);
      if (!validation.isValid) {
        console.error("❌ Validation Failed:", validation.errors);
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      // ✅ Add update timestamp
      const updatePayload = {
        ...updatedData,
        session: collectionName,
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Registration not found." });
      }

      console.log(`✅ Updated registration ${id} in ${collectionName}`);
      return res.status(200).json({
        message: "Registration updated successfully!",
        id: id,
        session: collectionName,
        modifiedCount: result.modifiedCount,
      });
    } else if (req.method === "GET") {
      // Get individual registration
      if (!id) {
        return res.status(400).json({ error: "Missing registration ID." });
      }

      const registration = await collection.findOne({ _id: new ObjectId(id) });

      if (!registration) {
        return res.status(404).json({ error: "Registration not found." });
      }

      console.log(`📊 Retrieved registration ${id} from ${collectionName}`);
      return res.status(200).json({
        registration,
        session: collectionName,
      });
    } else if (req.method === "DELETE") {
      // Delete individual registration
      if (!id) {
        return res.status(400).json({ error: "Missing registration ID." });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Registration not found." });
      }

      console.log(`🗑️ Deleted registration ${id} from ${collectionName}`);
      return res.status(200).json({
        message: "Registration deleted successfully!",
        id: id,
        session: collectionName,
      });
    } else {
      return res.status(405).json({
        error: "Method not allowed",
        allowed: ["GET", "PUT", "DELETE"],
        session: collectionName,
      });
    }
  } catch (error) {
    console.error("❌ Error in Individual Camp Registration API:", error);
    return res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
