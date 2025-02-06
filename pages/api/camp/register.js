import { connectToMongo } from "@/server/lib/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const db = await connectToMongo();
        const collection = db.collection("march2025");

        if (req.method === "POST") {
            const formData = req.body;
            console.log("📥 Received Data:", formData);

            if (!formData.childName || !formData.email || !formData.phone) {
                console.error("❌ Validation Failed:", formData);
                return res.status(400).json({ error: "Missing required fields." });
            }

            const result = await collection.insertOne(formData);
            console.log("✅ Registration Success:", result);
            return res.status(201).json({ message: "Registration successful!", id: result.insertedId });

        } else if (req.method === "GET") {
            const registrations = await collection.find().toArray();
            return res.status(200).json(registrations);

        } else if (req.method === "DELETE") {
            const { id } = req.body; // 🛑 Expecting `id` in request body
            if (!id) {
                return res.status(400).json({ error: "Missing ID for deletion." });
            }

            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Registration not found." });
            }

            return res.status(200).json({ message: "Registration deleted successfully!" });

        } else if (req.method === "PUT") {
            const { id, ...updatedData } = req.body;
            const result = await collection.updateOne(
                { _id: id },
                { $set: updatedData }
            );
            return res.status(200).json({ message: "Updated successfully", result });
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("❌ Error in API:", error);
        return res.status(500).json({ error: error.message });
    }
}
