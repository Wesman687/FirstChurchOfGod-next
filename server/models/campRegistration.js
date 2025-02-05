'use server'
import mongoose from "mongoose";

// ✅ Define Schema
const RegistrationSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  childAge: { type: Number, required: true },
  childAllergies: { type: String, required: true },

  parentFirstName: { type: String, required: true },
  parentLastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  address: {
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },

  phone: { type: String, required: true },

  permission: { type: Boolean, required: true },
  marketingConsent: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Function to dynamically get the collection for each year
export default function getRegistrationModel(year) {
  return mongoose.models[`Registration_${year}`] ||
    mongoose.model(`Registration_${year}`, RegistrationSchema, `march${year}_registrations`);
}
