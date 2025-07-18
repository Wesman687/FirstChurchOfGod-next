export async function sendEmail(formData, subject) {
  try {
      // ✅ Generalize: Dynamically build message from formData
      let message_body = `<h2>${subject}</h2>`;
      for (const [key, value] of Object.entries(formData)) {
          const formattedKey = key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase()); // CamelCase to Title Case
          message_body += `<p><strong>${formattedKey}:</strong> ${value || 'N/A'}</p>`;
      }

      // ✅ Use 'to_emails' as array, 'content' to match server (or update server to 'message')
      const emailData = {
          to_emails: ["Wesman687@gmail.com", "Susan_Miracle2000@yahoo.com", "the1stchurchofgod@gmail.com"],
          subject: `First Church of God: ${subject}`,
          content: message_body,  // Changed to 'content' to match server Pydantic model
      };

      const response = await fetch("/api/send-email", { // Assuming this is the correct endpoint
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