import React, { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/KPR-Logo.jpg";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
// import React, { useState } from "react";




const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  return (
    <>
      <div className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="KPR-Logo" />
        </div>

        <ul className="nav-menu">
          <li>
            <FaPhone style={{ marginRight: "8px" }} />
            +880-1234567890
          </li>
          <li>
            <MdEmail style={{ marginRight: "8px" }} />
            info@friendlyhelp.org
          </li>
        </ul>

        <Link to="/donation">
          <button className="donation-button">
            <FaHandHoldingHeart style={{ marginRight: "5px" }} />
            Donate
          </button>
        </Link>
      </div>





      {/* 2nd Navbar */}
      {/* <div className="secondary-navbar">
        <ul className="secondary-menu">
          <li>Home</li>

          <li className="dropdown">
            About Us
            <ul className="dropdown-menu">
              <li>Who We Are</li>
              <li>Mission & Vision</li>
              <li>Reports</li>
            </ul>
          </li>

          <li className="dropdown">
            Services
            <ul className="dropdown-menu">
              <li>Helpline Service</li>
              <li>Trainings and Workshops</li>
              <li>Corporate Wellness Programme</li>
            </ul>
          </li>

          <li className="dropdown">
            Contact
            <ul className="dropdown-menu">
              <li>Telephone</li>
              <li>Mobile</li>
              <li>Email</li>
            </ul>
          </li>

          <li className="dropdown">
            Volunteering
            <ul className="dropdown-menu">
              <li>Helpline Volunteer</li>
              <li>Non-Helpline Volunteer</li>
              <li>Spread the Word</li>
            </ul>
          </li>

          <li className="dropdown">
            Publications
            <ul className="dropdown-menu">
              <li>Blog</li>
              <li>Research</li>
            </ul>
          </li>

          <li className="dropdown">
            More
            <ul className="dropdown-menu">
              <li>Resources</li>
              <li>FAQ</li>
            </ul>
          </li>
        </ul>
      </div> */}



      
      <div className="secondary-navbar">
      <ul className="secondary-menu">
        <li
          className={menu === "Home" ? "active" : ""}
          onClick={() => setMenu("Home")}
        >
          Home
        </li>

        <li
          className={`dropdown ${menu === "About Us" ? "active" : ""}`}
          onClick={() => setMenu("About Us")}
        >
          About Us
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Who We Are")}>Who We Are</li>
            <li onClick={() => setMenu("Mission & Vision")}>Mission & Vision</li>
            <li onClick={() => setMenu("Reports")}>Reports</li>
          </ul>
        </li>

        <li
          className={`dropdown ${menu === "Services" ? "active" : ""}`}
          onClick={() => setMenu("Services")}
        >
          Services
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Helpline Service")}>Helpline Service</li>
            <li onClick={() => setMenu("Trainings and Workshops")}>Trainings and Workshops</li>
            <li onClick={() => setMenu("Corporate Wellness Programme")}>Corporate Wellness Programme</li>
          </ul>
        </li>

        <li
          className={`dropdown ${menu === "Contact" ? "active" : ""}`}
          onClick={() => setMenu("Contact")}
        >
          Contact
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Telephone")}>Telephone</li>
            <li onClick={() => setMenu("Mobile")}>Mobile</li>
            <li onClick={() => setMenu("Email")}>Email</li>
          </ul>
        </li>

        <li
          className={`dropdown ${menu === "Volunteering" ? "active" : ""}`}
          onClick={() => setMenu("Volunteering")}
        >
          Volunteering
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Helpline Volunteer")}>Helpline Volunteer</li>
            <li onClick={() => setMenu("Non-Helpline Volunteer")}>Non-Helpline Volunteer</li>
            <li onClick={() => setMenu("Spread the Word")}>Spread the Word</li>
          </ul>
        </li>

        <li
          className={`dropdown ${menu === "Publications" ? "active" : ""}`}
          onClick={() => setMenu("Publications")}
        >
          Publications
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Blog")}>Blog</li>
            <li onClick={() => setMenu("Research")}>Research</li>
          </ul>
        </li>

        <li
          className={`dropdown ${menu === "More" ? "active" : ""}`}
          onClick={() => setMenu("More")}
        >
          More
          <ul className="dropdown-menu">
            <li onClick={() => setMenu("Resources")}>Resources</li>
            <li onClick={() => setMenu("FAQ")}>FAQ</li>
          </ul>
        </li>
      </ul>
    </div>
    </>
  );
};

export default Navbar;


