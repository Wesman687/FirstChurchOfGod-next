
import { useState } from "react";
import { sendEmail } from "@/components/programs/SendEmail";
import ErrorModal from "@/components/modals/ErrorModal";
import RingSpinner from "@/components/RingSpinner";
import { validatePhoneNumber, validateEmail } from "@/lib/actions";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    childAlergies: "", // Optional
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    permission: false, // Required
    marketingConsent: false, // Optional
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // ✅ Handle checkboxes correctly
    }));
  };

  // ✅ Validate required fields
  const validateForm = () => {
    let errors = {};

    if (!formData.childName.trim()) errors.childName = "Child's name is required";
    if (!formData.childAge.trim()) errors.childAge = "Child's age is required";
    if (!formData.firstName.trim()) errors.firstName = "Parent's first name is required";
    if (!formData.lastName.trim()) errors.lastName = "Parent's last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.address1.trim()) errors.address1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "Zip Code is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.permission) errors.permission = "You must give permission for your child to attend";

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // ✅ Returns true if there are no errors
  };

  // ✅ Handle form submission
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

    // ✅ Validate form before proceeding
    if (!validateForm()) {
      setLoading(false);
      alert("Please fill in all required fields");
      return;
    }
    try {
      // ✅ Add the correct year dynamically
      const emailResponse = await sendEmail(formData, "CAMP REGISTRATION FROM CHURCH WEBSITE");
      if (emailResponse.status !== "success") throw new Error(emailResponse.message || "❌ Email sending failed");
 
      const year = new Date().getFullYear();
      const dataToSend = { ...formData, year };
      console.log("📨 Sending Form Data:", formData);
      // ✅ Save to database
      const response = await fetch("/api/camp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Registration failed");

      // ✅ Send email notification
      console.log("🎉 Registration Successful!");
      setSubmitted(true);
    } catch (error) {
      setError({ showError: true, title: "Registration Failed", message: error.message });
      console.error("❌ Error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <RingSpinner />
      ) : (
        <div className="form-container">
          <h2 className="form-title">Masters Artist Camp Registration</h2>
          <p className="form-subtitle">March 2, 2025 - May 4, 2025</p>

          {submitted ? (
            <p className="success-message">🎉 Registration Successful!</p>
          ) : (
            <form className="registration-form">
              {/* Child Info */}
              <label>Childs Name *</label>
              <input type="text" name="childName" value={formData.childName} onChange={handleChange} placeholder="Enter details here" />
              {validationErrors.childName && <span className="error">{validationErrors.childName}</span>}

              <label>Age *</label>
              <input type="text" name="childAge" value={formData.childAge} onChange={handleChange} placeholder="Enter details here" />
              {validationErrors.childAge && <span className="error">{validationErrors.childAge}</span>}

              <label>Allergies</label>
              <textarea name="childAlergies" value={formData.childAlergies} onChange={handleChange} placeholder="Enter details here" />

              {/* Parent Name */}
              <label>Parents Name *</label>
              <div className="name-fields">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
              </div>
              {validationErrors.firstName && <span className="error">{validationErrors.firstName}</span>}
              {validationErrors.lastName && <span className="error">{validationErrors.lastName}</span>}

              {/* Email */}
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              {validationErrors.email && <span className="error">{validationErrors.email}</span>}

              {/* Address */}
              <label>Address *</label>
              <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="Address Line 1" />
              <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Address Line 2 (optional)" />
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code" />
               {Object.values(validationErrors).slice(4, 9).map((msg, i) => <span key={i} className="error">{msg}</span>)}

              {/* Phone */}
              <label>Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
              {validationErrors.phone && <span className="error">{validationErrors.phone}</span>}

              {/* Permissions */}
              <label className="checkbox-label">
                <input type="checkbox" name="permission" checked={formData.permission} onChange={handleChange} />
                I give permission for my child to attend and be photographed.
              </label>
              <label className="checkbox-label">
                  <input type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} />
                  I agree to receive marketing materials.
                </label>
              {validationErrors.permission && <span className="error">{validationErrors.permission}</span>}

              <button type="submit" className="submit-button" onClick={handleSubmit}>Submit Registration</button>
            </form>
          )}

          {/* ✅ Error Modal */}
          {error.showError && (
            <ErrorModal title={error.title} message={error.message} onClose={() => setError({ showError: false, title: "", message: "" })} />
          )}
        </div>
      )}
    </>
  );
}
