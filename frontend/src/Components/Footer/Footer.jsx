
import React from "react";
import "./Footer.css";
import logo from "../Assets/KPR-Logo.jpg"
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <img src={logo} alt="KPR-Logo" />
          <p>FriendlyHelp</p>
          <span>"Where answers meet empathy."</span>
        </div>

        <div className="footer-links-section">
          <ul>
            <h3>Company</h3>
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press</li>
          </ul>


           <ul>
            <h3>Legal Information</h3>
            <li>Registration Information</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>


          <ul>
            <h3>Support</h3>
            <li>Contact</li>
            <li>FAQs</li>
          </ul>


          <ul>
            <h3>Contact Us</h3>
            <li>📍 123 Street, Dhaka</li>
            <li>📞 +880-1234567890</li>
            <li>✉️ info@friendlyhelp.org</li>
          </ul>

          <ul>
            <h3>Join Us</h3>
            <li>Helpline Volunteer</li>
            <li>Non Helpline Volunteer</li>
            <li>Donate</li>
          </ul>


          <ul>
            <h3>Opening Hours</h3>
            <li>Open 24 Hours</li>
            <li>7 Days a Week</li>
            <li>No Holidays</li>
            <li>Support Can’t Wait!</li>
          </ul>

          {/* <ul>
            <h3>Stay Updated</h3>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </ul> */}

        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <div className="footer-social-icons">
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
          <FaLinkedin />
        </div>
        <p>© {new Date().getFullYear()} FriendlyHelp Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;