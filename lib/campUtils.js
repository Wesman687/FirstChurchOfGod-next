// Camp Registration Utilities

/**
 * Generate collection name for camp registrations
 * @param {Date} date - Optional date, defaults to current date
 * @returns {string} Collection name like "Camp_September2025"
 */
export function getCampCollectionName(date = new Date()) {
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  return `Camp_${month}${year}`;
}

/**
 * Get available camp sessions (last 6 months + next 6 months)
 * @returns {Array} Array of session objects with name and display info
 */
export function getAvailableCampSessions() {
  const sessions = [];
  const now = new Date();

  // Generate sessions for last 6 months to next 6 months
  for (let i = -6; i <= 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const collectionName = getCampCollectionName(date);
    const displayName = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    sessions.push({
      value: collectionName,
      label: displayName,
      date: date,
      isCurrent: i === 0,
    });
  }

  return sessions;
}

/**
 * Parse collection name to get readable session info
 * @param {string} collectionName - Collection name like "Camp_September2025"
 * @returns {object} Parsed session info
 */
export function parseSessionName(collectionName) {
  if (!collectionName.startsWith("Camp_")) {
    return { month: "Unknown", year: "Unknown", display: collectionName };
  }

  const sessionPart = collectionName.replace("Camp_", "");
  const match = sessionPart.match(/^([A-Za-z]+)(\d{4})$/);

  if (!match) {
    return { month: "Unknown", year: "Unknown", display: collectionName };
  }

  const [, month, year] = match;
  return {
    month,
    year,
    display: `${month} ${year}`,
    collection: collectionName,
  };
}

/**
 * Validate form data for camp registration
 * @param {object} formData - Registration form data
 * @returns {object} Validation result with isValid and errors
 */
export function validateCampRegistration(formData) {
  const errors = [];

  // Required fields
  const requiredFields = [
    { field: "childName", message: "Child name is required" },
    { field: "childAge", message: "Child age is required" },
    { field: "firstName", message: "Parent first name is required" },
    { field: "lastName", message: "Parent last name is required" },
    { field: "email", message: "Email is required" },
    { field: "phone", message: "Phone number is required" },
    { field: "address1", message: "Address is required" },
    { field: "city", message: "City is required" },
    { field: "state", message: "State is required" },
    { field: "zip", message: "Zip code is required" },
    { field: "permission", message: "Permission is required" },
  ];

  requiredFields.forEach(({ field, message }) => {
    if (
      !formData[field] ||
      (typeof formData[field] === "string" && !formData[field].trim())
    ) {
      errors.push(message);
    }
  });

  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push("Invalid email format");
  }

  // Age validation
  if (
    formData.childAge &&
    (isNaN(formData.childAge) ||
      formData.childAge < 1 ||
      formData.childAge > 18)
  ) {
    errors.push("Child age must be between 1 and 18");
  }

  // At least one schedule selection
  const scheduleOptions = ["worship", "bibleStories", "lunch", "artCamp"];
  const hasSchedule = scheduleOptions.some(
    (option) => formData[option] === true
  );
  if (!hasSchedule) {
    errors.push("At least one schedule option must be selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
