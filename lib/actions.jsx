export function validatePhoneNumber(phoneNumber) {
    // Regular expression to match exactly 10 digits (no spaces, dashes, or other characters)
    const phoneRegex = /^\d{10}$/;    
    return phoneRegex.test(phoneNumber);
}
export function validateEmail(email) {
    // Regular expression for a valid email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}