import React from "react";
import Donations from "../Components/Assets/Donations.jpg";
import "./CSS/Donation.css";





const Donation = () => {
  return (
    <div className="donation-page">
      
      <div className="donation-info">
        <h2>Thank you for your interest in donating to FriendlyHelp.</h2>
        <p>
          FriendlyHelp is Bangladesh’s first and only emotional support and suicide prevention helpline. 
          The mission of the helpline is to alleviate feelings of despair, isolation, distress, and suicidal 
          intent among members of our community. FriendlyHelp accomplishes this through confidential, compassionate, 
          and open-minded listening.
        </p>
        <br />
        <p><strong>Depending on what is most convenient for you, there are numerous ways to donate to  FriendlyHelp:</strong></p>
        <ol>
          <li>
            <p>Directly depositing into  FriendlyHelp's bank account:</p>
            <p>
              <strong>Account Name:</strong>  FriendlyHelp Foundation<br />
              <strong>Account Number:</strong> 222222222<br />
              <strong>Bank Name:</strong> Dutch Bangla Bank Ltd.<br />
              <strong>Branch Name:</strong> Dhanmondi Branch<br />
              <strong>Routing No:</strong> 12345678
            </p>
          </li>

          <li>
            <p>
              Writing us an account payee cheque in the name of <strong>“ FriendlyHelp Foundation.”</strong> 
              You can mail the cheque, drop it off at our office, or we can pick it up from you at a convenient time.
            </p>
          </li>
        </ol>

        <p>
          In either case, please confirm the amount via email and we will issue you a donation receipt.
        </p>

        <p>
          If neither option is convenient, it's also possible to donate cash. Let us know your preference or any 
          questions you have.
        </p>

        <p>
          <strong>Contact:</strong><br />
          Phone: +880-1234567890<br />
          Email: <a href="mailto:info@friendlyhelp.org">info@friendlyhelp.org</a>
        </p>

        <p>Thank you again for donating!</p>
      </div>

      
      <div className="donation-image">
        <img src={Donations} alt="Donation Banner" />
      </div>
    </div>
  );
};

export default Donation;
