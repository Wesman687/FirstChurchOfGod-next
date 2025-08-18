import { useState } from "react";
import { sendEmail } from "@/components/programs/SendEmail";
import ErrorModal from "@/components/modals/ErrorModal";
import RingSpinner from "@/components/RingSpinner";
import { validatePhoneNumber, validateEmail } from "@/lib/actions";

// ✅ Generate beautiful HTML email from form data
const generateCampRegistrationEmail = (formData) => {
  // Field labels for better display
  const fieldLabels = {
    childName: "Child's Name",
    childAge: "Child's Age",
    childAlergies: "Child's Allergies",
    firstName: "Parent's First Name",
    lastName: "Parent's Last Name",
    email: "Email Address",
    address1: "Address Line 1",
    address2: "Address Line 2",
    city: "City",
    state: "State",
    zip: "Zip Code",
    country: "Country",
    phone: "Phone Number",
    permission: "Photography Permission",
    marketingConsent: "Marketing Consent",
    worship: "10:00 Worship",
    bibleStories: "10:30-11:30 Bible Stories & Activities",
    lunch: "11:30 Lunch",
    artCamp: "12:00-1:30 Art Camp",
  };

  // Generate table rows for all form fields
  const tableRows = Object.entries(formData)
    .filter(([key, value]) => value !== "" && value !== false) // Only show filled fields and true checkboxes
    .map(([key, value]) => {
      const label =
        fieldLabels[key] ||
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      let displayValue;

      // Format different value types
      if (typeof value === "boolean") {
        displayValue = value ? "✅ Yes" : "❌ No";
      } else if (key === "email") {
        displayValue = `<a href="mailto:${value}" style="color:#4a90e2;text-decoration:none;">${value}</a>`;
      } else if (key === "phone") {
        displayValue = `<a href="tel:${value}" style="color:#4a90e2;text-decoration:none;">${value}</a>`;
      } else {
        displayValue = value || "N/A";
      }

      return `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:12px 16px;font-weight:600;color:#555;background:#f8f9fa;width:200px;">${label}</td>
          <td style="padding:12px 16px;color:#333;">${displayValue}</td>
        </tr>
      `;
    })
    .join("");

  // Generate schedule summary
  const selectedSchedule = [];
  if (formData.worship) selectedSchedule.push("10:00 Worship");
  if (formData.bibleStories)
    selectedSchedule.push("10:30-11:30 Bible Stories & Activities");
  if (formData.lunch) selectedSchedule.push("11:30 Lunch");
  if (formData.artCamp) selectedSchedule.push("12:00-1:30 Art Camp");

  const scheduleHtml =
    selectedSchedule.length > 0
      ? `
    <div style="margin:20px 0;padding:15px;background:#e8f5e8;border-left:4px solid #28a745;border-radius:4px;">
      <h4 style="margin:0 0 10px 0;color:#155724;">Selected Schedule:</h4>
      <ul style="margin:0;padding-left:20px;">
        ${selectedSchedule
          .map((time) => `<li style="color:#155724;margin:5px 0;">${time}</li>`)
          .join("")}
      </ul>
    </div>
  `
      : "";

  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:linear-gradient(135deg,#4a90e2,#357abd);color:white;padding:25px;text-align:center;">
        <h1 style="margin:0;font-size:24px;font-weight:300;">🎨 Camp Registration</h1>
        <p style="margin:5px 0 0 0;opacity:0.9;">First Church of God - Christian Art Classes</p>
      </div>
      
      <div style="padding:30px 25px;">
        <div style="background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;">
            ${tableRows}
          </table>
        </div>

        ${scheduleHtml}

        <div style="margin-top:25px;padding:15px;background:#f8f9fa;border-radius:6px;text-align:center;">
          <p style="margin:0;color:#666;font-size:14px;">
            📅 Registration Date: ${new Date().toLocaleDateString()}<br>
            ⏰ Registration Time: ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;">
          This registration was submitted through the First Church of God website
        </p>
      </div>
    </div>
  `;
};

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
    // Schedule checkboxes
    worship: false,
    bibleStories: false,
    lunch: false,
    artCamp: false,
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

    if (!formData.childName.trim())
      errors.childName = "Child's name is required";
    if (!formData.childAge.trim()) errors.childAge = "Child's age is required";
    if (!formData.firstName.trim())
      errors.firstName = "Parent's first name is required";
    if (!formData.lastName.trim())
      errors.lastName = "Parent's last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.address1.trim()) errors.address1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "Zip Code is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.permission)
      errors.permission = "You must give permission for your child to attend";

    // Validate that at least one schedule option is selected
    if (
      !formData.worship &&
      !formData.bibleStories &&
      !formData.lunch &&
      !formData.artCamp
    )
      errors.schedule =
        "Please select at least one time slot your child will attend";

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // ✅ Returns true if there are no errors
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(formData.phone)) {
      setError({
        showError: true,
        title: "Invalid Phone Number",
        message: "Please enter a valid 10 digit phone number",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      setError({
        showError: true,
        title: "Invalid Email",
        message: "Please enter a valid email address",
      });
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
      // ✅ Generate beautiful HTML email content
      const htmlContent = generateCampRegistrationEmail(formData);

      // ✅ Send email with HTML content
      const emailResponse = await sendEmail(
        {
          ...formData,
          htmlContent,
          isHtml: true,
        },
        "CAMP REGISTRATION FROM CHURCH WEBSITE"
      );
      if (emailResponse.status !== "success")
        throw new Error(emailResponse.message || "❌ Email sending failed");

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
      setError({
        showError: true,
        title: "Registration Failed",
        message: error.message,
      });
      console.error("❌ Error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <RingSpinner />
      ) : (
        <div
          className="form-container"
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
            maxWidth: "min(900px, 95vw)",
            width: "100%",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              borderBottom: "2px solid #4a90e2",
              paddingBottom: "20px",
            }}
          >
            <h2
              className="form-title"
              style={{
                fontSize: "2rem",
                color: "#2c3e50",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Christian Art Camp Registration
            </h2>
            <p
              className="form-subtitle"
              style={{
                fontSize: "1.1rem",
                color: "#7f8c8d",
                fontStyle: "italic",
              }}
            >
              September 21, 2025 - December 2025
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "12px",
                color: "#155724",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                🎉 Registration Successful!
              </h3>
              <p>
                Thank you for registering! We&apos;ll contact you soon with more
                details.
              </p>
            </div>
          ) : (
            <form
              className="registration-form"
              style={{
                display: "grid",
                gap: "25px",
              }}
            >
              {/* Two Column Layout for Child & Parent Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  gap: "25px",
                  alignItems: "start",
                }}
              >
                {/* Child Info Section */}
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "25px",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      color: "#495057",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      borderBottom: "2px solid #dee2e6",
                      paddingBottom: "10px",
                    }}
                  >
                    Child Information
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      Child&apos;s Name *
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      placeholder="Enter child's full name"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: validationErrors.childName
                          ? "2px solid #e74c3c"
                          : "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        transition: "border-color 0.3s ease",
                        backgroundColor: "white",
                      }}
                    />
                    {validationErrors.childName && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {validationErrors.childName}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      Age *
                    </label>
                    <input
                      type="number"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleChange}
                      placeholder="Child's age"
                      min="5"
                      max="12"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: validationErrors.childAge
                          ? "2px solid #e74c3c"
                          : "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        transition: "border-color 0.3s ease",
                        backgroundColor: "white",
                      }}
                    />
                    {validationErrors.childAge && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {validationErrors.childAge}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      Allergies or Special Needs
                    </label>
                    <textarea
                      name="childAlergies"
                      value={formData.childAlergies}
                      onChange={handleChange}
                      placeholder="Please list any allergies, medical conditions, or special needs we should know about"
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        resize: "vertical",
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </div>

                {/* Parent Info Section */}
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "25px",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      color: "#495057",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      borderBottom: "2px solid #dee2e6",
                      paddingBottom: "10px",
                    }}
                  >
                    Parent/Guardian Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "#495057",
                          fontSize: "1rem",
                        }}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: validationErrors.firstName
                            ? "2px solid #e74c3c"
                            : "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                        }}
                      />
                      {validationErrors.firstName && (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontSize: "0.9rem",
                            marginTop: "5px",
                            display: "block",
                          }}
                        >
                          {validationErrors.firstName}
                        </span>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "#495057",
                          fontSize: "1rem",
                        }}
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: validationErrors.lastName
                            ? "2px solid #e74c3c"
                            : "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                        }}
                      />
                      {validationErrors.lastName && (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontSize: "0.9rem",
                            marginTop: "5px",
                            display: "block",
                          }}
                        >
                          {validationErrors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "#495057",
                          fontSize: "1rem",
                        }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: validationErrors.email
                            ? "2px solid #e74c3c"
                            : "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                        }}
                      />
                      {validationErrors.email && (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontSize: "0.9rem",
                            marginTop: "5px",
                            display: "block",
                          }}
                        >
                          {validationErrors.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "#495057",
                          fontSize: "1rem",
                        }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: validationErrors.phone
                            ? "2px solid #e74c3c"
                            : "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                        }}
                      />
                      {validationErrors.phone && (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontSize: "0.9rem",
                            marginTop: "5px",
                            display: "block",
                          }}
                        >
                          {validationErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close two-column wrapper */}
              </div>

              {/* Address Section */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #e9ecef",
                }}
              >
                <h3
                  style={{
                    color: "#495057",
                    marginBottom: "20px",
                    fontSize: "1.3rem",
                    borderBottom: "2px solid #dee2e6",
                    paddingBottom: "10px",
                  }}
                >
                  Address Information
                </h3>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#495057",
                      fontSize: "1rem",
                    }}
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: validationErrors.address1
                        ? "2px solid #e74c3c"
                        : "2px solid #e9ecef",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  />
                  {validationErrors.address1 && (
                    <span
                      style={{
                        color: "#e74c3c",
                        fontSize: "0.9rem",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      {validationErrors.address1}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#495057",
                      fontSize: "1rem",
                    }}
                  >
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="Apt 4B, Suite 200, etc."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Palatka"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: validationErrors.city
                          ? "2px solid #e74c3c"
                          : "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        backgroundColor: "white",
                      }}
                    />
                    {validationErrors.city && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {validationErrors.city}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="FL"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: validationErrors.state
                          ? "2px solid #e74c3c"
                          : "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        backgroundColor: "white",
                      }}
                    />
                    {validationErrors.state && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {validationErrors.state}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1rem",
                      }}
                    >
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="32177"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: validationErrors.zip
                          ? "2px solid #e74c3c"
                          : "2px solid #e9ecef",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        backgroundColor: "white",
                      }}
                    />
                    {validationErrors.zip && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {validationErrors.zip}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div
                style={{
                  backgroundColor: "#e8f5e8",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #c3e6cb",
                }}
              >
                <h3
                  style={{
                    color: "#155724",
                    marginBottom: "20px",
                    fontSize: "1.3rem",
                    borderBottom: "2px solid #c3e6cb",
                    paddingBottom: "10px",
                  }}
                >
                  What times will your child be attending? *
                </h3>
                <p
                  style={{
                    marginBottom: "15px",
                    color: "#155724",
                    fontStyle: "italic",
                  }}
                >
                  Check all that apply
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#155724",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="worship"
                      checked={formData.worship}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#28a745",
                      }}
                    />
                    <span>10:00 Worship</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#155724",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="bibleStories"
                      checked={formData.bibleStories}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#28a745",
                      }}
                    />
                    <span>
                      10:30 - 11:30 Bible stories, music and activities
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#155724",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="lunch"
                      checked={formData.lunch}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#28a745",
                      }}
                    />
                    <span>11:30 Lunch</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#155724",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="artCamp"
                      checked={formData.artCamp}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#28a745",
                      }}
                    />
                    <span>12:00-1:30 Art Camp</span>
                  </label>
                </div>

                {validationErrors.schedule && (
                  <span
                    style={{
                      color: "#e74c3c",
                      fontSize: "0.9rem",
                      marginTop: "10px",
                      display: "block",
                    }}
                  >
                    {validationErrors.schedule}
                  </span>
                )}
              </div>

              {/* Permissions Section */}
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #ffeaa7",
                }}
              >
                <h3
                  style={{
                    color: "#856404",
                    marginBottom: "20px",
                    fontSize: "1.3rem",
                    borderBottom: "2px solid #ffeaa7",
                    paddingBottom: "10px",
                  }}
                >
                  Permissions & Consent
                </h3>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="permission"
                      checked={formData.permission}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "3px",
                        accentColor: "#ffc107",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#856404" }}>
                      <strong>Required:</strong> I give permission for my child
                      to attend Christian Art Classes and to be
                      photographed/videoed for church promotional materials.
                    </span>
                  </label>
                  {validationErrors.permission && (
                    <span
                      style={{
                        color: "#e74c3c",
                        fontSize: "0.9rem",
                        marginTop: "5px",
                        display: "block",
                        marginLeft: "32px",
                      }}
                    >
                      {validationErrors.permission}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "3px",
                        accentColor: "#ffc107",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#856404" }}>
                      <strong>Optional:</strong> I would like to receive updates
                      about church events and programs via email.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#4a90e2",
                  color: "white",
                  padding: "16px 32px",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#357abd")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
              >
                Submit Registration
              </button>
            </form>
          )}

          {/* ✅ Error Modal */}
          {error.showError && (
            <ErrorModal
              title={error.title}
              message={error.message}
              onClose={() =>
                setError({ showError: false, title: "", message: "" })
              }
            />
          )}
        </div>
      )}
    </>
  );
}
