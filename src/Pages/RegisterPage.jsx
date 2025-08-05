import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "+961",
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isHomeHover, setIsHomeHover] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error, please try again later.");
    }
  };

  // Styles
  const pageWrapperStyle = {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    width: "100vw",
    backgroundImage: "url('/Bitcoin.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "stretch",
  };

  const rightPanelStyle = {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "400px",
    height: "100vh",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#333",
  };

  const formStyle = {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  };

  // Shifted left inputs (only fullName, email, password)
  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    margin: "1rem 0 1rem -0.5rem", // shifted left
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  // Phone number section styles (unchanged)
  const selectStyle = {
    width: "35%",
    padding: "0.75rem",
    margin: "1rem 0.5rem 1rem -0.45rem", // unchanged margin
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
    backgroundColor: "#fff",
    color: "#000",
  };

  const phoneInputStyle = {
    width: "65%",
    padding: "0.75rem",
    margin: "1rem -1.1rem 1rem 0rem", // unchanged margin
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    backgroundColor: "#4CAF50",
    margin: "0.5rem 0 0 0.25rem",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    transform: isHovering ? "scale(1.05)" : "scale(1)",
  };

  const homeButtonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1rem",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 0.3s ease, transform 0.3s ease",
    color: isHomeHover ? "#00BFFF" : "#00A0CC",
    transform: isHomeHover ? "scale(1.2)" : "scale(1)",
  };

  const footerStyle = {
    textAlign: "center",
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#555",
    borderTop: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={rightPanelStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Register</h2>

          <input
            style={inputStyle}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <select
              style={selectStyle}
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
            >
              <option value="+961">🇱🇧 +961</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+33">🇫🇷 +33</option>
              {/* Add more country codes here as needed */}
            </select>

            <input
              style={phoneInputStyle}
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Register
          </button>

          <Link
            to="/login"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "#00BFFF",
              textDecoration: "none",
            }}
          >
            Login
          </Link>

          <div
            role="button"
            tabIndex={0}
            style={homeButtonStyle}
            onClick={() => navigate("/")}
            onKeyPress={(e) => {
              if (e.key === "Enter") navigate("/");
            }}
            onMouseEnter={() => setIsHomeHover(true)}
            onMouseLeave={() => setIsHomeHover(false)}
            aria-label="Back to homepage"
            title="Back to Homepage"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32"
              width="32"
              fill={isHomeHover ? "#00BFFF" : "#00A0CC"}
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        </form>

        <footer style={footerStyle}>
          © {new Date().getFullYear()} CryptoCrest. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default RegisterPage;
