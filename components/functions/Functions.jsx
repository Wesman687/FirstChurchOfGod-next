export function generateRandomStringWithDate() {
    const now = new Date();
    const timestamp = now.getTime(); // Get milliseconds since epoch
    const randomPart = Math.random().toString(36).substr(2, 6); // Generate random string
    return `image_${timestamp}_${randomPart}`;
}