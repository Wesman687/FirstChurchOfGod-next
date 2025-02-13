import React, { useState } from "react";
import RingSpinner from "../RingSpinner";
import { sendEmail } from "./SendEmail";
import { validatePhoneNumber, validateEmail } from "@/lib/actions";
import ErrorModal from "../modals/ErrorModal";
function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState({ showError: false, title: "", message: "" });
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
    if (!validatePhoneNumber(formData.phone)){
      setError({ showError: true, title: "Invalid Phone Number", message: "Please enter a valid 10 digit phone number" });
      return;
    }
    if (!validateEmail(formData.email)){
      setError({ showError: true, title: "Invalid Email", message: "Please enter a valid email address" });
      return;
    }
    setLoading(true);
    setResponseMessage("");
    try {

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
                  <button type="submit" className="orange-btn" disabled={loading}>
                    Send Message
                  </button>
                </div>
              </>
            )}
          </form>
        )}
        {error.showError && (
          <ErrorModal title={error.title} message={error.message} onClose={() => setError({ showError: false, title: "", message: "" })} />
        )}
      </div>
    </>
  );
}

export default ContactForm;
