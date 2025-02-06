
import { connectToMongo } from "@/server/lib/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        // ✅ Connect to MongoDB
        const db = await connectToMongo();
        const emailsCollection = db.collection("emails");

        // ✅ GET: Fetch all messages
        if (req.method === "GET") {
            const messages = await emailsCollection.find().sort({ createdAt: -1 }).toArray();
            return res.status(200).json(messages);
        }

        // ✅ POST: Save a new message
        if (req.method === "POST") {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ message: "All fields are required!" });
            }

            const result = await emailsCollection.insertOne({
                name,
                email,
                message,
                createdAt: new Date(),
            });

            if (!result.acknowledged) {
                throw new Error("Failed to save the message.");
            }

            return res.status(201).json({ message: "Message sent successfully!" });
        }

        // ✅ DELETE: Remove a message by ID
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: "Message ID is required for deletion!" });
            }

            const result = await emailsCollection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Message not found!" });
            }

            return res.status(200).json({ message: "Message deleted successfully!" });
        }

        // ✅ If method is not supported
        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        console.error("❌ API Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
