import React from "react";
import "./CSS/CallUs.css";

import { FaWhatsapp, FaPhoneAlt, FaPhone } from "react-icons/fa";

const CallUs = () => {
  return (
    <div className="callus-container">
      <h1 className="callus-title">Get in Touch With Us</h1>
      <p className="callus-subtitle">We are here to listen and help you 24/7</p>

      <div className="contact-cards">
        {/* WhatsApp */}
        <div className="contact-card whatsapp">
          <FaWhatsapp className="contact-icon" />
          <h3>WhatsApp</h3>
          <p>Chat with us on WhatsApp</p>
          <a
            href="https://wa.me/880123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            +880 1234 567 89
          </a>
        </div>

        {/* Mobile */}
        <div className="contact-card mobile">
          <FaPhoneAlt className="contact-icon" />
          <h3>Mobile</h3>
          <p>Call us directly on mobile</p>
          <a href="tel:+8801987654321" className="contact-link">
            +880 1987 654 321
          </a>
        </div>

        {/* Telephone */}
        <div className="contact-card telephone">
          <FaPhone className="contact-icon" />
          <h3>Telephone</h3>
          <p>Reach us via landline</p>
          <a href="tel:+88029876543" className="contact-link">
            +880 2 9876543
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallUs;
