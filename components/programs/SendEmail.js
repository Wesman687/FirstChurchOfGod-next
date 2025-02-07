export async function sendEmail(formData, subject) {
    try {
        // ✅ Extract only the fields needed for the email
        const emailData = {
          to_emails: ["Wesman687@gmail.com", "Susan_Miracle2000@yahoo.com", "the1stchurchofgod@gmail.com"],
          subject: subject,
          message: `
            <h2>New Camp Registration</h2>
            <p><strong>Child's Name:</strong> ${formData.childName}</p>
            <p><strong>Age:</strong> ${formData.childAge}</p>
            <p><strong>Parent:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Address:</strong> ${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}</p>
            <p><strong>Allergies:</strong> ${formData.childAlergies || "None"}</p>
            <p><strong>Permission Given:</strong> ${formData.permission ? "Yes" : "No"}</p>
          `,
        };
    
        const response = await fetch("/api/send-email", { // 🔥 Use Next.js API route
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
          });
      
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("❌ Error sending email:", error);
      return { status: "error", message: "Failed to send email" };
    }
  }
  