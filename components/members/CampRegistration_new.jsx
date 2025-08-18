import { useEffect, useState } from "react";
import axios from "axios";
import CampModal from "../modals/CampModal";
import RingSpinner from "../RingSpinner";

export default function CampRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const [availableSessions, setAvailableSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableColumns, setTableColumns] = useState([]);

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

            // Dynamically determine table columns based on actual data
            if (registrationsArray.length > 0) {
              generateTableColumns(registrationsArray);
            } else {
              setTableColumns([]);
            }
          } catch (error) {
            console.error("Error fetching registrations:", error);
            setRegistrations([]);
            setTableColumns([]);
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

  const generateTableColumns = (data) => {
    if (data.length === 0) return;

    // Get the first registration to analyze structure
    const sampleReg = data[0];
    const regData = sampleReg.formData || sampleReg;

    // Define column configurations with priority order
    const columnConfigs = [
      {
        key: "childName",
        label: "Child Name",
        priority: 1,
        type: "text",
        width: "150px",
      },
      {
        key: "childAge",
        label: "Age",
        priority: 2,
        type: "text",
        width: "60px",
      },
      {
        key: "firstName",
        label: "Parent First",
        priority: 3,
        type: "text",
        width: "120px",
      },
      {
        key: "lastName",
        label: "Parent Last",
        priority: 4,
        type: "text",
        width: "120px",
      },
      {
        key: "email",
        label: "Email",
        priority: 5,
        type: "email",
        width: "200px",
      },
      {
        key: "phone",
        label: "Phone",
        priority: 6,
        type: "phone",
        width: "120px",
      },
      {
        key: "address1",
        label: "Address",
        priority: 7,
        type: "text",
        width: "200px",
      },
      { key: "city", label: "City", priority: 8, type: "text", width: "120px" },
      {
        key: "state",
        label: "State",
        priority: 9,
        type: "text",
        width: "80px",
      },
      { key: "zip", label: "Zip", priority: 10, type: "text", width: "80px" },
      {
        key: "childAlergies",
        label: "Allergies",
        priority: 11,
        type: "text",
        width: "150px",
      },
      {
        key: "permission",
        label: "Permission",
        priority: 12,
        type: "boolean",
        width: "90px",
      },
      {
        key: "marketingConsent",
        label: "Marketing",
        priority: 13,
        type: "boolean",
        width: "90px",
      },
      {
        key: "worship",
        label: "Worship",
        priority: 14,
        type: "boolean",
        width: "80px",
      },
      {
        key: "bibleStories",
        label: "Bible Stories",
        priority: 15,
        type: "boolean",
        width: "100px",
      },
      {
        key: "lunch",
        label: "Lunch",
        priority: 16,
        type: "boolean",
        width: "70px",
      },
      {
        key: "artCamp",
        label: "Art Camp",
        priority: 17,
        type: "boolean",
        width: "80px",
      },
    ];

    // Filter columns that actually exist in the data and add special columns
    const availableColumns = columnConfigs
      .filter(
        (col) =>
          regData.hasOwnProperty(col.key) && regData[col.key] !== undefined
      )
      .sort((a, b) => a.priority - b.priority);

    // Add special computed columns
    const specialColumns = [
      {
        key: "schedule",
        label: "Schedule",
        type: "schedule",
        width: "150px",
        priority: 20,
      },
      {
        key: "registrationDate",
        label: "Registered",
        type: "date",
        width: "100px",
        priority: 21,
      },
      {
        key: "actions",
        label: "Actions",
        type: "actions",
        width: "100px",
        priority: 22,
      },
    ];

    setTableColumns([...availableColumns, ...specialColumns]);
  };

  const renderCellContent = (registration, column) => {
    const data = registration.formData || registration;

    switch (column.type) {
      case "email":
        return data[column.key] ? (
          <a
            href={`mailto:${data[column.key]}`}
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            {data[column.key]}
          </a>
        ) : (
          ""
        );

      case "phone":
        return data[column.key] ? (
          <a
            href={`tel:${data[column.key]}`}
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            {data[column.key]}
          </a>
        ) : (
          ""
        );

      case "boolean":
        return data[column.key] ? (
          <span style={{ color: "#28a745", fontWeight: "600" }}>✓</span>
        ) : (
          <span style={{ color: "#dc3545" }}>✗</span>
        );

      case "schedule":
        const scheduleItems = [];
        if (data.worship) scheduleItems.push("Worship");
        if (data.bibleStories) scheduleItems.push("Bible");
        if (data.lunch) scheduleItems.push("Lunch");
        if (data.artCamp) scheduleItems.push("Art");
        return scheduleItems.length > 0 ? (
          <span title={scheduleItems.join(", ")} style={{ fontSize: "0.9rem" }}>
            {scheduleItems.join(", ")}
          </span>
        ) : (
          "None"
        );

      case "date":
        const date = data.registrationDate || registration.createdAt;
        return date ? new Date(date).toLocaleDateString() : "";

      case "actions":
        return (
          <button
            className="orange-btn camp-edit"
            onClick={() => handleRegistrationClick(registration)}
            style={{ fontSize: "0.9rem", padding: "6px 12px" }}
          >
            View/Edit
          </button>
        );

      case "text":
      default:
        const value = data[column.key];
        if (column.key === "childName") {
          return <span style={{ fontWeight: "600" }}>{value || ""}</span>;
        }
        return value || "";
    }
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

  // Open Modal
  const handleRegistrationClick = (registration) => {
    setSelectedRegistration(registration);
    setModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRegistration(null);
  };

  // Handle session change
  const handleSessionChange = (sessionValue) => {
    setSelectedSession(sessionValue);
    setSearchTerm(""); // Clear search when switching sessions
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="managemembers-container">
      {/* Session and Search Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        {/* Session Selection */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{ fontWeight: "600", color: "#495057", minWidth: "120px" }}
          >
            Camp Session:
          </label>
          <select
            value={selectedSession}
            onChange={(e) => handleSessionChange(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              backgroundColor: "white",
              minWidth: "250px",
            }}
          >
            <option value="">Select a session...</option>
            {availableSessions.map((session) => (
              <option key={session.value} value={session.value}>
                {getSessionDisplayName(session.value)} (
                {session.registrationCount} registrations)
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{ fontWeight: "600", color: "#495057", minWidth: "120px" }}
          >
            Search:
          </label>
          <input
            type="text"
            placeholder="Search by child name..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              minWidth: "250px",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                padding: "8px 12px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Current Session Info */}
      {selectedSession && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#e8f4fd",
            borderLeft: "4px solid #007bff",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "#004085" }}>
            📅 Viewing: {getSessionDisplayName(selectedSession)}
          </h3>
          <p style={{ margin: 0, color: "#6c757d" }}>
            {loading
              ? "Loading..."
              : `${registrations.length} registration${
                  registrations.length !== 1 ? "s" : ""
                } found`}
            {searchTerm && ` (filtered by "${searchTerm}")`}
          </p>
        </div>
      )}

      {/* Dynamic Table */}
      {loading ? (
        <RingSpinner />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="managemembers-table" style={{ minWidth: "100%" }}>
            <thead>
              <tr className="managemembers-table-thead-row">
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    style={{ minWidth: column.width || "auto" }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6c757d",
                      fontStyle: "italic",
                    }}
                  >
                    {!selectedSession
                      ? "Please select a camp session to view registrations"
                      : searchTerm
                      ? `No registrations found matching "${searchTerm}"`
                      : "No registrations found for this session"}
                  </td>
                </tr>
              ) : (
                registrations.map((registration) => (
                  <tr
                    key={registration._id}
                    className="managemembers-table-tbody-row"
                  >
                    {tableColumns.map((column) => (
                      <td
                        key={column.key}
                        style={{ minWidth: column.width || "auto" }}
                      >
                        {renderCellContent(registration, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <CampModal
          registration={selectedRegistration}
          session={selectedSession}
          sessionDisplay={getSessionDisplayName(selectedSession)}
          onClose={closeModal}
          refresh={fetchRegistrations}
        />
      )}
    </div>
  );
}
