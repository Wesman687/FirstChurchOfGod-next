import { useEffect, useState } from "react";
import axios from "axios";
import RingSpinner from "../RingSpinner";

// Custom hook for responsive design
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024
      });
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default function CampRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const [availableSessions, setAvailableSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Use responsive hook
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Initialize sessions on component mount
  useEffect(() => {
    initializeSessions();
  }, []);

  // Fetch registrations when session or search term changes (with debouncing for search)
  useEffect(() => {
    const timer = setTimeout(
      () => {
        const fetchRegistrations = async () => {
          if (!selectedSession) return;

          setLoading(true);
          try {
            const params = { session: selectedSession };
            if (searchTerm.trim()) {
              params.childName = searchTerm.trim();
            }

            const { data } = await axios.get("/api/camp/register", { params });

            // Handle both old and new API response formats
            const registrationData = data.registrations || data;
            const registrationsArray = Array.isArray(registrationData)
              ? registrationData
              : [];

            setRegistrations(registrationsArray);
          } catch (error) {
            console.error("Error fetching registrations:", error);
            setRegistrations([]);
          } finally {
            setLoading(false);
          }
        };

        if (selectedSession) {
          fetchRegistrations();
        }
      },
      searchTerm ? 300 : 0
    ); // Debounce search, but not session changes

    return () => clearTimeout(timer);
  }, [selectedSession, searchTerm]);

  const initializeSessions = async () => {
    try {
      // Get actual database collections that start with "Camp_"
      const { data } = await axios.get("/api/camp/sessions");

      // Filter to only show sessions that actually have data
      const sessionsWithData = data.sessions.filter(
        (s) => s.hasData && s.registrationCount > 0
      );
      setAvailableSessions(sessionsWithData);

      // Set default to the most recent session with data
      if (sessionsWithData.length > 0) {
        const mostRecent = sessionsWithData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )[0];
        setSelectedSession(mostRecent.value);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const getScheduleItems = (data) => {
    const scheduleItems = [];
    if (data.worship)
      scheduleItems.push({ label: "Worship", icon: "🙏", time: "10:00" });
    if (data.bibleStories)
      scheduleItems.push({
        label: "Bible Stories",
        icon: "📖",
        time: "10:30-11:30",
      });
    if (data.lunch)
      scheduleItems.push({ label: "Lunch", icon: "🍽️", time: "11:30" });
    if (data.artCamp)
      scheduleItems.push({ label: "Art Camp", icon: "🎨", time: "12:00+" });
    return scheduleItems;
  };

  const getAgeGroup = (age) => {
    const ageNum = parseInt(age);
    if (ageNum <= 5)
      return { label: "Little Ones", color: "#FF6B9D", icon: "👶" };
    if (ageNum <= 8)
      return { label: "Elementary", color: "#4ECDC4", icon: "🧒" };
    if (ageNum <= 12) return { label: "Middle", color: "#45B7D1", icon: "👦" };
    return { label: "Teen", color: "#96CEB4", icon: "👨‍🎓" };
  };

  const formatRegistrationDate = (registration) => {
    const date =
      registration.formData?.registrationDate ||
      registration.registrationDate ||
      registration.createdAt;
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSessionDisplayName = (sessionValue) => {
    if (!sessionValue) return "No Session";
    // Parse session name like "Camp_August2025" to "August 2025"
    const match = sessionValue.match(/Camp_(.+?)(\d{4})/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return sessionValue;
  };

  // Handle edit mode
  const startEditing = (registration) => {
    const data = registration.formData || registration;
    setEditingCard(registration._id);
    setEditData({
      childName: data.childName || "",
      childAge: data.childAge || "",
      childAlergies: data.childAlergies || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      address1: data.address1 || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      permission: data.permission || false,
      marketingConsent: data.marketingConsent || false,
      worship: data.worship || false,
      bibleStories: data.bibleStories || false,
      lunch: data.lunch || false,
      artCamp: data.artCamp || false,
    });
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditData({});
  };

  const saveChanges = async (registrationId) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/camp/register/${registrationId}`, {
        ...editData,
        session: selectedSession,
      });

      if (response.status === 200) {
        // Refresh the registrations list
        await fetchRegistrations();
        setEditingCard(null);
        setEditData({});
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRegistration = async (registrationId) => {
    if (
      !confirm(
        "Are you sure you want to delete this registration? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/camp/register/${registrationId}`,
        {
          data: { session: selectedSession },
        }
      );

      if (response.status === 200) {
        // Refresh the registrations list
        await fetchRegistrations();
        setEditingCard(null);
        setEditData({});
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderChildCard = (registration) => {
    const data = registration.formData || registration;
    const scheduleItems = getScheduleItems(
      editingCard === registration._id ? editData : data
    );
    const ageGroup = getAgeGroup(
      editingCard === registration._id ? editData.childAge : data.childAge
    );
    const isEditing = editingCard === registration._id;
    const displayData = isEditing ? editData : data;

    return (
      <div
        key={registration._id}
        style={{
          backgroundColor: isEditing ? "#f8f9ff" : "#ffffff",
          borderRadius: isMobile ? "12px" : "16px",
          padding: isMobile ? "16px" : "24px",
          boxShadow: isEditing
            ? "0 6px 30px rgba(102, 126, 234, 0.2)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          border: isEditing ? "2px solid #667eea" : "1px solid #f0f0f0",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Age Group Badge */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "12px" : "20px",
            right: isMobile ? "12px" : "20px",
            backgroundColor: ageGroup.color,
            color: "white",
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderRadius: "20px",
            fontSize: isMobile ? "0.75rem" : "0.85rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1
          }}
        >
          <span style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>{ageGroup.icon}</span>
          {isMobile ? ageGroup.label.split(' ')[0] : ageGroup.label}
        </div>

        {/* Header Section */}
        <div style={{ 
          marginBottom: isMobile ? "16px" : "24px", 
          paddingRight: isMobile ? "80px" : "120px" 
        }}>
          {isEditing ? (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>👦</span>
              <input
                type="text"
                value={displayData.childName}
                onChange={(e) => handleInputChange("childName", e.target.value)}
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  border: "2px solid #667eea",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  background: "white",
                  flex: 1,
                }}
                placeholder="Child's Name"
              />
              <input
                type="number"
                value={displayData.childAge}
                onChange={(e) => handleInputChange("childAge", e.target.value)}
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  border: "2px solid #667eea",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  background: "white",
                  width: "80px",
                }}
                placeholder="Age"
              />
            </div>
          ) : (
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#2c3e50",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "2.2rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                👦
              </span>
              {displayData.childName}
            </h2>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              color: "#7f8c8d",
              fontSize: "1rem",
            }}
          >
            {!isEditing && (
              <>
                <span style={{ fontWeight: "600", color: "#5d6d7e" }}>
                  {displayData.childAge} years old
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>📅</span>
                  Registered: {formatRegistrationDate(registration)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : isTablet 
                ? "1fr 1fr" 
                : "1fr 1fr 1fr",
            gap: isMobile ? "16px" : "24px",
            marginBottom: isMobile ? "16px" : "24px",
          }}
        >
          {/* Parent Info Column */}
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#34495e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "2px solid #ecf0f1",
                paddingBottom: "6px",
              }}
            >
              <span>👨‍👩‍👧‍👦</span>
              Parent Info
            </h3>

            <div style={{ marginBottom: "12px" }}>
              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <input
                    type="text"
                    value={displayData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="First Name"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #667eea",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                    }}
                  />
                  <input
                    type="text"
                    value={displayData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last Name"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #667eea",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                    }}
                  />
                  <input
                    type="email"
                    value={displayData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #667eea",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                    }}
                  />
                  <input
                    type="tel"
                    value={displayData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Phone"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #667eea",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              ) : (
                <>
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1.05rem",
                      fontWeight: "600",
                      color: "#2c3e50",
                    }}
                  >
                    {displayData.firstName} {displayData.lastName}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {displayData.email && (
                      <a
                        href={`mailto:${displayData.email}`}
                        style={{
                          color: "#3498db",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem",
                          padding: "2px 0",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>📧</span>
                        {displayData.email}
                      </a>
                    )}

                    {displayData.phone && (
                      <a
                        href={`tel:${displayData.phone}`}
                        style={{
                          color: "#27ae60",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem",
                          padding: "2px 0",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>📞</span>
                        {displayData.phone}
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Address */}
            <div
              style={{
                fontSize: "0.85rem",
                color: "#5d6d7e",
                lineHeight: "1.4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                <span>🏠</span>
                Address
              </div>
              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    paddingLeft: "20px",
                  }}
                >
                  <input
                    type="text"
                    value={displayData.address1}
                    onChange={(e) =>
                      handleInputChange("address1", e.target.value)
                    }
                    placeholder="Address"
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #667eea",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      value={displayData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="City"
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #667eea",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        flex: 1,
                      }}
                    />
                    <input
                      type="text"
                      value={displayData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="ST"
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #667eea",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        width: "50px",
                      }}
                    />
                    <input
                      type="text"
                      value={displayData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      placeholder="ZIP"
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #667eea",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        width: "70px",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {displayData.address1 && (
                    <div style={{ paddingLeft: "20px" }}>
                      {displayData.address1}
                    </div>
                  )}
                  {(displayData.city ||
                    displayData.state ||
                    displayData.zip) && (
                    <div style={{ paddingLeft: "20px" }}>
                      {displayData.city}
                      {displayData.city && displayData.state ? ", " : ""}
                      {displayData.state} {displayData.zip}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Schedule Column */}
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#34495e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "2px solid #ecf0f1",
                paddingBottom: "6px",
              }}
            >
              <span>📅</span>
              Schedule
            </h3>

            {isEditing ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {[
                  {
                    key: "worship",
                    label: "Worship",
                    icon: "🙏",
                    time: "10:00",
                  },
                  {
                    key: "bibleStories",
                    label: "Bible Stories",
                    icon: "📖",
                    time: "10:30-11:30",
                  },
                  { key: "lunch", label: "Lunch", icon: "🍽️", time: "11:30" },
                  {
                    key: "artCamp",
                    label: "Art Camp",
                    icon: "🎨",
                    time: "12:00+",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: displayData[item.key]
                        ? "#e8f5e8"
                        : "#f8f9fa",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: displayData[item.key]
                        ? "1px solid #28a745"
                        : "1px solid #dee2e6",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={displayData[item.key] || false}
                      onChange={(e) =>
                        handleInputChange(item.key, e.target.checked)
                      }
                      style={{ marginRight: "4px" }}
                    />
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#2c3e50",
                          fontSize: "0.85rem",
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.75rem" }}>
                        {item.time}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : scheduleItems.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {scheduleItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", color: "#2c3e50" }}>
                        {item.label}
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.8rem" }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#adb5bd", fontStyle: "italic", margin: "0" }}>
                No activities selected
              </p>
            )}
          </div>

          {/* Permissions & Actions Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Permissions */}
            <div>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#34495e",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: "2px solid #ecf0f1",
                  paddingBottom: "6px",
                }}
              >
                <span>✅</span>
                Permissions
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { key: "permission", label: "Photography", icon: "📸" },
                  { key: "marketingConsent", label: "Marketing", icon: "📢" },
                ].map((perm) => (
                  <div key={perm.key}>
                    {isEditing ? (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "0.85rem",
                          padding: "4px 8px",
                          backgroundColor: displayData[perm.key]
                            ? "#d5f5e3"
                            : "#fdeaea",
                          borderRadius: "6px",
                          cursor: "pointer",
                          border: displayData[perm.key]
                            ? "1px solid #27ae60"
                            : "1px solid #e74c3c",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={displayData[perm.key] || false}
                          onChange={(e) =>
                            handleInputChange(perm.key, e.target.checked)
                          }
                        />
                        <span>{perm.icon}</span>
                        <span style={{ fontWeight: "500" }}>{perm.label}</span>
                      </label>
                    ) : (
                      displayData.hasOwnProperty(perm.key) && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.85rem",
                            color: displayData[perm.key]
                              ? "#27ae60"
                              : "#e74c3c",
                            padding: "4px 8px",
                            backgroundColor: displayData[perm.key]
                              ? "#d5f5e3"
                              : "#fdeaea",
                            borderRadius: "6px",
                          }}
                        >
                          <span>{perm.icon}</span>
                          <span style={{ fontWeight: "500" }}>
                            {perm.label}:
                          </span>
                          <span style={{ fontWeight: "600" }}>
                            {displayData[perm.key] ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <button
                  onClick={() => saveChanges(registration._id)}
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                    width: "100%",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>
                    {loading ? "⏳" : "💾"}
                  </span>
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => deleteRegistration(registration._id)}
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 3px 10px rgba(231, 76, 60, 0.3)",
                    width: "100%",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(231, 76, 60, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 3px 10px rgba(231, 76, 60, 0.3)";
                    }
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>🗑️</span>
                  Delete
                </button>

                <button
                  onClick={cancelEditing}
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(149, 165, 166, 0.3)",
                    width: "100%",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>❌</span>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing(registration)}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.3)";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>✏️</span>
                Edit Registration
              </button>
            )}
          </div>
        </div>

        {/* Allergies Alert (if any) */}
        {(isEditing || displayData.childAlergies) && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              border: "1px solid #fed7d7",
              borderRadius: "8px",
              padding: "12px 16px",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <strong style={{ color: "#c53030", fontSize: "0.9rem" }}>
                Allergies:
              </strong>
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.childAlergies}
                  onChange={(e) =>
                    handleInputChange("childAlergies", e.target.value)
                  }
                  placeholder="List any allergies or medical conditions..."
                  style={{
                    marginLeft: "8px",
                    padding: "6px 10px",
                    border: "1px solid #c53030",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    width: "300px",
                    backgroundColor: "white",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#742a2a",
                    marginLeft: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  {displayData.childAlergies}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Handle session change
  const handleSessionChange = (sessionValue) => {
    setSelectedSession(sessionValue);
    setSearchTerm(""); // Clear search when switching sessions
    setEditingCard(null); // Cancel any active edits
    setEditData({});
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Refresh function for modal
  const fetchRegistrations = async () => {
    if (!selectedSession) return;

    setLoading(true);
    try {
      const params = { session: selectedSession };
      if (searchTerm.trim()) {
        params.childName = searchTerm.trim();
      }

      const { data } = await axios.get("/api/camp/register", { params });
      const registrationData = data.registrations || data;
      const registrationsArray = Array.isArray(registrationData)
        ? registrationData
        : [];
      setRegistrations(registrationsArray);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "12px" : "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Top Session Card */}
      {selectedSession && (
        <div
          style={{
            marginBottom: isMobile ? "20px" : "30px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: isMobile ? "12px" : "16px",
            padding: isMobile ? "16px" : "24px",
            color: "white",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: isMobile ? "12px" : "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  fontSize: isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "8px" : "12px",
                  flexWrap: "wrap"
                }}
              >
                <span>👥</span>
                Camp Registrations
              </h1>
              <p
                style={{
                  margin: "0",
                  fontSize: isMobile ? "0.95rem" : "1.1rem",
                  opacity: "0.9",
                  fontWeight: "400",
                }}
              >
                {getSessionDisplayName(selectedSession)} •{" "}
                {loading
                  ? "Loading..."
                  : `${registrations.length} camper${
                      registrations.length !== 1 ? "s" : ""
                    }`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Age group breakdown */}
            {!loading && registrations.length > 0 && (
              <div style={{ 
                display: "flex", 
                gap: isMobile ? "8px" : "12px", 
                flexWrap: "wrap",
                justifyContent: isMobile ? "flex-start" : "flex-end",
                width: "100%"
              }}>
                {(() => {
                  const ageGroups = registrations.reduce((acc, reg) => {
                    const data = reg.formData || reg;
                    const ageGroup = getAgeGroup(data.childAge);
                    acc[ageGroup.label] = (acc[ageGroup.label] || 0) + 1;
                    return acc;
                  }, {});

                  return Object.entries(ageGroups).map(([group, count]) => {
                    const groupIcon =
                      group === "Little Ones"
                        ? "👶"
                        : group === "Elementary"
                        ? "🧒"
                        : group === "Middle"
                        ? "👦"
                        : "👨‍🎓";

                    return (
                      <div
                        key={group}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          padding: isMobile ? "6px 12px" : "8px 16px",
                          borderRadius: "24px",
                          fontSize: isMobile ? "0.8rem" : "0.9rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>{groupIcon}</span>
                        {isMobile ? `${group.split(' ')[0]}: ${count}` : `${group}: ${count}`}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session and Search Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "12px" : "16px",
          marginBottom: isMobile ? "16px" : "24px",
          padding: isMobile ? "16px" : "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e9ecef",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Session Selection */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "8px" : "12px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              fontWeight: "600",
              color: "#495057",
              minWidth: isMobile ? "auto" : "100px",
              fontSize: "0.95rem",
            }}
          >
            Session:
          </label>
          <select
            value={selectedSession}
            onChange={(e) => handleSessionChange(e.target.value)}
            style={{
              padding: isMobile ? "12px 14px" : "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              backgroundColor: "white",
              minWidth: isMobile ? "100%" : "280px",
              width: isMobile ? "100%" : "auto",
              fontSize: "0.95rem",
              color: "#495057",
            }}
          >
            <option value="">Select a camp session...</option>
            {availableSessions.map((session) => (
              <option key={session.value} value={session.value}>
                {getSessionDisplayName(session.value)} ({session.registrationCount} registrations)
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "8px" : "12px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              fontWeight: "600",
              color: "#495057",
              minWidth: isMobile ? "auto" : "100px",
              fontSize: "0.95rem",
            }}
          >
            Search:
          </label>
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            flexDirection: isMobile ? "column" : "row"
          }}>
            <input
              type="text"
              placeholder="Search by child name..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                padding: isMobile ? "12px 14px" : "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                minWidth: isMobile ? "100%" : "280px",
                width: isMobile ? "100%" : "auto",
                fontSize: "0.95rem",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  padding: isMobile ? "12px 16px" : "10px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Child Registration Cards */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px 20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <RingSpinner />
        </div>
      ) : registrations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: isMobile ? "40px 16px" : "80px 20px",
            backgroundColor: "#f8f9fa",
            borderRadius: isMobile ? "12px" : "16px",
            border: "2px dashed #dee2e6",
          }}
        >
          <div
            style={{ 
              fontSize: isMobile ? "3rem" : "4rem", 
              marginBottom: isMobile ? "16px" : "20px", 
              opacity: "0.6" 
            }}
          >
            {!selectedSession ? "📋" : searchTerm ? "🔍" : "👥"}
          </div>
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#6c757d",
              fontSize: isMobile ? "1.2rem" : "1.4rem",
              fontWeight: "600",
            }}
          >
            {!selectedSession
              ? "Select a Camp Session"
              : searchTerm
              ? "No Results Found"
              : "No Registrations Yet"}
          </h3>
          <p
            style={{
              margin: "0",
              color: "#adb5bd",
              fontSize: isMobile ? "1rem" : "1.1rem",
              lineHeight: "1.5",
              maxWidth: isMobile ? "300px" : "500px",
              margin: "0 auto",
              padding: isMobile ? "0 8px" : "0"
            }}
          >
            {!selectedSession
              ? "Choose a camp session from the dropdown above to view registrations"
              : searchTerm
              ? `No children found matching "${searchTerm}" in this session`
              : "This session doesn't have any registrations yet"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {registrations.map((registration) => renderChildCard(registration))}
        </div>
      )}
    </div>
  );
}
