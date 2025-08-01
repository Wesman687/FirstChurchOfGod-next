/**
 * ONE-TIME CLEANUP SCRIPT
 * Run this once to clean up all old events except Christian Women Connection
 * 
 * Instructions:
 * 1. Open browser and go to: http://localhost:3004/api/cleanup-events
 * 2. Use POST method (you can use browser dev tools console)
 * 3. Or run this in browser console while on your site:
 * 
 * fetch('/api/cleanup-events', {method: 'POST'})
 *   .then(r => r.json())
 *   .then(console.log)
 * 
 * This will remove ALL events except:
 * - Christian Women Connection events on Monday at 1:00 PM
 */

// You can also run this script manually by visiting the API endpoint
console.log('Run: fetch("/api/cleanup-events", {method: "POST"}).then(r => r.json()).then(console.log)');
