import { connectToMongo } from "@/server/lib/mongo";
import { ObjectId } from "mongodb";
import {
  getCampCollectionName,
  validateCampRegistration,
} from "@/lib/campUtils";

export default async function handler(req, res) {
    const dbName = "campDatabase";

  try {
    const db = await connectToMongo(dbName);

    // ✅ Use dynamic collection name or allow override via query param
    const collectionName = req.query.session || getCampCollectionName();
    const collection = db.collection(collectionName);

    if (req.method === "POST") {
      const formData = req.body;
      console.log("📥 Received Data:", formData);
      console.log("📁 Using Collection:", collectionName);

      // ✅ Use comprehensive validation
      const validation = validateCampRegistration(formData);
      if (!validation.isValid) {
        console.error("❌ Validation Failed:", validation.errors);
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      // ✅ Add session/period info to the document
      const registrationData = {
        ...formData,
        session: collectionName,
        registrationDate: new Date(),
        createdAt: new Date(),
      };

      const result = await collection.insertOne(registrationData);
      console.log("✅ Registration Success:", result);
      return res.status(201).json({
        message: "Registration successful!",
        id: result.insertedId,
        session: collectionName,
      });
    } else if (req.method === "GET") {
      // ✅ Support filtering by session and other parameters
      const filter = {};
      if (req.query.childName)
        filter.childName = new RegExp(req.query.childName, "i");
      if (req.query.email) filter.email = new RegExp(req.query.email, "i");

      const registrations = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      console.log(
        `📊 Retrieved ${registrations.length} registrations from ${collectionName}`
      );
      return res.status(200).json({
        registrations,
        session: collectionName,
        count: registrations.length,
      });
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Missing ID for deletion." });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Registration not found." });
      }

      console.log(`🗑️ Deleted registration ${id} from ${collectionName}`);
      return res.status(200).json({
        message: "Registration deleted successfully!",
        session: collectionName,
      });
    } else if (req.method === "PUT") {
      const { id, ...updatedData } = req.body;

      // ✅ Add update timestamp
      const updatePayload = {
        ...updatedData,
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatePayload }
      );

      console.log(`📝 Updated registration ${id} in ${collectionName}`);
      return res.status(200).json({
        message: "Updated successfully",
        result,
        session: collectionName,
      });
    } else {
      return res.status(405).json({
        error: "Method not allowed",
        allowed: ["GET", "POST", "PUT", "DELETE"],
        session: collectionName,
      });
    }
  } catch (error) {
    console.error("❌ Error in Camp Registration API:", error);
    return res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
