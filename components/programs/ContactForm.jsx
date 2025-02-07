import React, { useState } from "react";
import RingSpinner from "../RingSpinner";
import { sendEmail } from "./SendEmail";

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    console.log(formData)
    try {
      console.log("📨 Sending data to API & Email:", formData);

      // ✅ Send email request
      const emailResponse = await sendEmail(formData, "CONTACT FROM CHURCH WEBSITE");
      if (emailResponse.status !== "success") throw new Error(emailResponse.message || "❌ Email sending failed");

      // ✅ Save to MongoDB (API request)
      const dbResponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!dbResponse.ok) throw new Error("❌ Saving to database failed");

      setResponseMessage("✅ Message sent & saved successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("❌ Error:", error.message);
      setResponseMessage(error.message || "❌ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="sc_form_info">
        {loading ? (
          <div className="settings-ring-container">
            <p>Sending...</p>
            <RingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {responseMessage ? (
              <div className="contact-success-container">{responseMessage}</div>
            ) : (
              <>
                <div className="sc_form_item sc_form_field label_over">
                  <label className="required" htmlFor="name">Name</label>
                  <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="sc_form_item sc_form_field label_over">
                  <label className="required" htmlFor="email">E-mail</label>
                  <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="sc_form_item sc_form_field label_over">
                  <label className="required" htmlFor="phone">Phone</label>
                  <input type="text" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="sc_form_item sc_form_message label_over">
                  <label className="required" htmlFor="message">Message</label>
                  <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
                </div>

                <div className="sc_form_item sc_form_button">
                  <button type="submit" className="light-blue-button" disabled={loading}>
                    Send Message
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </>
  );
}

export default ContactForm;
