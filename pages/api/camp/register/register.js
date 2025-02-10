'use server'
import connectDB from "@/utils/db";
import getRegistrationModel from "@/models/Registration";
import { NextResponse } from "next/server";

// ✅ Connect to MongoDB
export default async function handler(req, res) {
  console.log('working')
  if (req.method === 'GET') {
      return res.status(200).json({ message: "API is working!" });
  } else {
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}

// // ✅ Handle POST request (Submit Registration)
// export async function POST(req) {
//   console.log("request happening")
//   try {
//     const data = await req.json();

//     // ✅ Extract year from request or use default (2025)
//     const year = data.year || "2025"; 

//     // ✅ Get the correct model for the year
//     const Registration = getRegistrationModel(year);

//     // ✅ Save registration data
//     const newRegistration = new Registration(data);
//     await newRegistration.save();

//     return NextResponse.json({ message: `🎉 Registration for ${year} saved successfully!` }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // ✅ Handle GET request (Retrieve all registrations for a year)
// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const year = url.searchParams.get("year") || "2025"; 

//     const Registration = getRegistrationModel(year);
//     const registrations = await Registration.find();

//     return NextResponse.json(registrations, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
