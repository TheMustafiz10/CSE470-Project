
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/VolunteerLogin.css"; 

const VolunteerLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Attempting login for:", trimmedEmail);

      const response = await fetch("http://localhost:5000/api/volunteers/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: trimmedEmail,
        }),
      });

      const data = await response.json();
      
      console.log("🔍 Login response status:", response.status);
      console.log("🔍 Login response data:", data);
      
      if (response.ok) {
        console.log("Login success:", data);
        console.log("🔍 Token received:", data.token);
   
        localStorage.setItem("volunteerToken", data.token);

        const profileResponse = await fetch("http://localhost:5000/api/volunteers/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("🔍 Profile response:", profileData);
          console.log("Profile fetched:", profileData);
          
          const volunteerInfo = {
            id: profileData.volunteer._id || profileData.volunteer.id,
            fullName: profileData.volunteer.fullName,
            email: profileData.volunteer.email,
            phone: profileData.volunteer.phone,
            volunteerType: profileData.volunteer.volunteerType,
            volunteerRoles: profileData.volunteer.volunteerRoles,
            availability: profileData.volunteer.availability,
            address: profileData.volunteer.address,
            additionalInfo: profileData.volunteer.additionalInfo,
            registrationDate: profileData.volunteer.registrationDate,
            isApproved: profileData.volunteer.isApproved || false,
            isActive: profileData.volunteer.isActive || true
          };
          
          localStorage.setItem("volunteerInfo", JSON.stringify(volunteerInfo));
          navigate("/volunteer-dashboard");
        } else {
          const profileError = await profileResponse.json();
          console.warn("Failed to fetch profile:", profileError.message);
          setError("Failed to load profile data. Please try again.");
        }
      } else {
        if (response.status === 400) {
          setError(data.message || "Invalid email.");
        } else if (response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("An error occurred. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Volunteer Login</h2>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/apply-now")}
            disabled={loading}
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default VolunteerLogin;
