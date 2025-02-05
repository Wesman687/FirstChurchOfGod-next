"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      // ✅ Add the correct year dynamically
      const year = new Date().getFullYear(); // Example: 2025
      const formData = { ...data, year };
  
      const response = await fetch("/api/camp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Registration failed");
  
      console.log(`🎉 Registration for ${year} successful!`);
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };
  

  return (
    <div className="form-container">
      <h2 className="form-title">Master’s Artist Camp Registration</h2>
      <p className="form-subtitle">March 2, 2025 - May 4, 2025</p>

      {submitted ? (
        <p className="success-message">🎉 Registration Successful!</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          {/* Child Info */}
          <label>Childs Name</label>          
          <input {...register("childName", { required: true })} placeholder="Enter details here"></input>
          <label>Age</label>
          <input {...register("childAge", { required: true })} placeholder="Enter details here"></input>
          <label>Allergies</label>
          <textarea {...register("childAlergies", { required: true })} placeholder="Enter details here"></textarea>
          {errors.childDetails && <span className="error">This field is required</span>}

          {/* Parent Name */}
          <label>Parents Name *</label>
          <div className="name-fields">
            <input {...register("firstName", { required: true })} placeholder="First Name" />
            <input {...register("lastName", { required: true })} placeholder="Last Name" />
          </div>
          {errors.firstName && <span className="error">First name is required</span>}
          {errors.lastName && <span className="error">Last name is required</span>}

          {/* Email */}
          <label>Email *</label>
          <input type="email" {...register("email", { required: true })} placeholder="Enter your email" />
          {errors.email && <span className="error">Email is required</span>}

          {/* Address */}
          <label>Address *</label>
          <input type="text" {...register("address1", { required: true })} placeholder="Address Line 1" />
          <input type="text" {...register("address2")} placeholder="Address Line 2 (optional)" />
          <input type="text" {...register("city", { required: true })} placeholder="City" />
          <input type="text" {...register("state", { required: true })} placeholder="State" />
          <input type="text" {...register("zip", { required: true })} placeholder="Zip Code" />
          <input type="text" {...register("country", { required: true })} placeholder="Country" />
          {errors.address1 && <span className="error">Address is required</span>}
          {errors.city && <span className="error">City is required</span>}
          {errors.state && <span className="error">State is required</span>}
          {errors.zip && <span className="error">Zip Code is required</span>}
          {errors.country && <span className="error">Country is required</span>}

          {/* Phone Number */}
          <label>Phone Number *</label>
          <input type="tel" {...register("phone", { required: true })} placeholder="Enter your phone number" />
          {errors.phone && <span className="error">Phone number is required</span>}

          {/* Permissions */}
          <div className="checkbox-wrapper">
          <label className="checkbox-label">
            <input type="checkbox" {...register("permission", { required: true })} />
            I give permission for my child to attend and be photographed.
          </label>
          {errors.permission && <span className="error">You must agree to proceed</span>}

          {/* Marketing Consent */}
          <label className="checkbox-label">
            <input type="checkbox" {...register("marketingConsent")} />
            I agree to receive marketing materials.
          </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">Submit Registration</button>
        </form>
      )}
    </div>
  );
}
