import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isHomeHover, setIsHomeHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called, sending login POST");
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

         console.log("Response received:", response);
         console.log("Token:", response.data.token);


      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials.");
    }
  };

  // Styles
  const pageWrapperStyle = {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    width: "100vw",
    backgroundImage: "url('/Candlestick.jpg')",
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
    justifyContent: "space-between", //  pushes footer to the bottom
    color: "#333",
  };

  const formStyle = {
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1, //  takes remaining space above footer
  };

  const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  margin: "1rem 0 1rem -0.75rem", 
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1rem",
};

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    backgroundColor: "#4CAF50",
    margin: "0.5rem 0.1rem",
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
        {/* Login Form */}
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Login
          </button>

          <Link
            to="/register"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "#1877f2",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
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

        {/* ✅ Footer only inside the form panel */}
        <footer style={footerStyle}>
          © {new Date().getFullYear()} CryptoCrest. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
