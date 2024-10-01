import React, { useState } from "react";

const MemberModal = () => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const modalRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - modalRect.left;
    const y = e.clientY - modalRect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600); // Match the animation duration
  };

  return (
    <div
      className="modal"
      onMouseMove={createRipple}
      style={{
        width: "300px",
        height: "300px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h2>Member Details</h2>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        ></span>
      ))}
    </div>
  );
};

export default MemberModal;
