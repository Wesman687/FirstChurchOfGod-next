import Layout from "@/components/Layout";
import React, { useState } from "react";
import art_camp from "@/images/art_banner.jpg";
import art_camp2 from "@/images/art_camp2.jpg";
import Image from "next/image";
import RegistrationForm from "./registrationForm";
import Link from "next/link";
import CampModal from "@/components/modals/CampModal";
import { useSelector } from "react-redux";

function Index() {
  const user = useSelector((state) => state.user);
  return (
    <Layout>
      <div className="camp-container">
        <div className="camp-banner">
          <Image
            src={art_camp}
            alt="background image"
            className="camp-bg-image"
          />
        </div>
      </div>
      <div className="cwc-container" style={{ padding: "40px 20px" }}>
        <div
          className="camp-wrapper"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div
            className="camp-intro-wrapper"
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "15px",
                color: "#2c3e50",
              }}
            >
              Beginning September 21, 2025
            </h1>
            <h2
              style={{
                color: "#e74c3c",
                fontSize: "2rem",
                marginBottom: "15px",
              }}
            >
              Christian Art Classes
            </h2>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "#34495e",
              }}
            >
              Sundays (1st grade - 5th grade) 12:00 - 1:30 pm
            </h3>
            <h4
              style={{
                fontSize: "1.3rem",
                color: "#27ae60",
                fontWeight: "bold",
              }}
            >
              $5 weekly donation is appreciated.
            </h4>
          </div>

          {/* Admin Controls */}
          {user?.isAdmin && (
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <Link
                href="/camp/registar"
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2980b9")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
              >
                📋 Manage Forms
              </Link>
            </div>
          )}

          <div
            className="camp-paragraph"
            style={{
              textAlign: "center",
              marginBottom: "40px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            <h5 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>
              Classes are led by Professional Artist and Educator, Susan Miracle
              along with a team of volunteers and is hosted by
            </h5>
            <h5 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>
              The First Church of God. 2915 St. Johns Ave., Palatka.
            </h5>
            <h5 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>
              Class size is limited, so please reserve early.
            </h5>
            <h5
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "#2c3e50",
              }}
            >
              386-546-0143
            </h5>
          </div>
        </div>

        <h5
          className="cwc-body-text"
          style={{ textAlign: "center", margin: "40px 0", fontSize: "1.5rem" }}
        >
          2024 Winning Artist
        </h5>

        <div
          className="cwc-mission-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <Image
            src={art_camp2}
            className="art-camp-image"
            alt="Art Camp Winners"
          />
          <div>
            <RegistrationForm />
          </div>
        </div>
      </div>

    </Layout>
  );
}

export default Index;
