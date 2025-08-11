import React, { useState, useEffect } from 'react'
import StreamlineAIBadge from 'streamlineai-badge'

function Footer() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div
      className="footer-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "1rem 0rem",
        margin: "0 auto",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        lineHeight: "1.5rem",
        boxSizing: "border-box",
}}
    >
      <div className="footer-wrapper text-center">
        <span>First Church of God</span>
        <span>2915 St Johns Ave, Palatka, FL 32177</span>
        <span>Sunday 10am-1:30pm</span>
        <span>Wednesday 6:00pm</span>
        <span>Saturday Bible Study 9:30 am</span>
        <span>Christian Art Camp (ages 5-12) Sunday 12-1:30pm</span>
      </div>
      
      {/* Only render StreamlineAI badge on client-side to prevent hydration mismatch */}
      {isClient && (
        <StreamlineAIBadge style="gradient" size="xl" animation="none" textColor="white" />
      )}
                    
    </div>
  );
}

export default Footer