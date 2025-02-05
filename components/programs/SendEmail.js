export async function sendEmail(subject, formData) {
    try {
        NEXT_PUBLIC_EMAIL_API
      const response = await fetch(`${process.env.NEXT_PUBLIC_EMAIL_API}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_emails: ["Wesman687@gmail.com", "Susan_Miracle2000@yahoo.com"],
          subject: subject,
          message: formData.message, // Ensure `message` exists inside formData
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      return { status: "error", message: "Failed to send email" };
    }
  }
  