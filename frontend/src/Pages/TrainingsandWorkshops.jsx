
import React, { useState, useCallback, useMemo } from 'react';
import './CSS/VolunteerRegistration.css';

const VolunteerRegistration = () => {
  const [volunteerType, setVolunteerType] = useState('');
  const [formData, setFormData] = useState({
    agreePolicy: false,
    consentContact: false,
    confirmInfo: false,
    cyberLawConsent: false
  });

  const [dobError, setDobError] = useState('');

  const volunteerRolesNonHelpline = React.useMemo(() => [
  'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
  'Social Media & Digital Promotion', 'Content Writing / Blogging',
  'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
  'Translation / Language Support', 'Photography / Videography',
  'Mentorship / Training', 'Case Follow-up Coordinator',
  'Crisis Response Assistant', 'Resource & Referral Assistant'
], []);

const volunteerRolesHelpline = React.useMemo(() => [
  'Call/Chat Support Volunteer'
], []);


  const availabilityDays = useMemo(() => [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ], []);

  const availabilityTimes = useMemo(() => [
    '12:00 AM – 4:00 AM', '4:00 AM – 8:00 AM', '8:00 AM – 12:00 PM',
    '12:00 PM – 4:00 PM', '4:00 PM – 8:00 PM', '8:00 PM – 12:00 AM',
    'Flexible / Available 24 Hours'
  ], []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'dob') {
      const dobDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      const d = today.getDate() - dobDate.getDate();
      if (m < 0 || (m === 0 && d < 0)) {
        age--;
      }
      if (age < 18) {
        setDobError('You must be at least 18 years old.');
      } else {
        setDobError('');
      }
    }

    if (name === 'phone' || name === 'postalCode') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isFormValid = useCallback(() => {
  const requiredFields = ['fullName', 'email', 'phone', 'dob', 'street', 'city', 'state', 'postalCode'];
  const filledFields = requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  const consentChecks = formData.agreePolicy && formData.consentContact && formData.confirmInfo && formData.cyberLawConsent;
  const availabilityDayChecked = availabilityDays.some(day => formData[day]);
  const availabilityTimeChecked = availabilityTimes.some(time => formData[time]);
  const hasSelectedVolunteerType = volunteerType !== '';


  let volunteerInterestSelected = false;
  if (volunteerType === 'non-helpline') {
    volunteerInterestSelected = volunteerRolesNonHelpline.some(role => formData[role]) || !!formData.otherNonHelpline?.trim();
  } else if (volunteerType === 'helpline') {
    volunteerInterestSelected = volunteerRolesHelpline.some(role => formData[role]);
  }

  return (
    filledFields &&
    consentChecks &&
    availabilityDayChecked &&
    availabilityTimeChecked &&
    hasSelectedVolunteerType &&
    volunteerInterestSelected &&
    dobError === ''
  );
} , [formData, volunteerType, dobError, availabilityDays, availabilityTimes, volunteerRolesNonHelpline, volunteerRolesHelpline]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please complete all required fields.");
      return;
    }
    console.log('Submitted data:', formData);
    alert('Registration successful!');
 
    setFormData({
      agreePolicy: false,
      consentContact: false,
      confirmInfo: false,
      cyberLawConsent: false
    });
    setVolunteerType('');
    setDobError('');
    e.target.reset();
  };

  return (
    <div className="volunteer-registration">
      <h1>Volunteer Registration Form</h1>
      <p>Thank you for your interest in volunteering with us! Please fill out the information below.</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>👤 Personal Information</legend>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} inputMode="numeric" />
          {formData.phone && /\D/.test(formData.phone) && (
            <p style={{ color: 'red' }}>Phone number must contain only digits.</p>
          )}
          <div>
            <input type="date" name="dob" max={new Date().toISOString().split("T")[0]} onChange={handleChange} />
            {dobError && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>{dobError}</p>}
          </div>
        </fieldset>

        <fieldset>
          <legend>📍 Address</legend>
          <input name="street" placeholder="Street Address" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="state" placeholder="State/Province" onChange={handleChange} />
          <input name="postalCode" placeholder="Postal Code" onChange={handleChange} inputMode="numeric" />
          {formData.postalCode && /\D/.test(formData.postalCode) && (
            <p style={{ color: 'red' }}>Postal code must contain only digits.</p>
          )}
        </fieldset>

        <div className="volunteer-type">
          <label>
            <input
                type="radio"
                value="non-helpline"
                checked={volunteerType === 'non-helpline'}
                onChange={() => {
                    setVolunteerType('non-helpline');
          
                    setFormData(prev => {
                    const newData = { ...prev };
                    volunteerRolesHelpline.forEach(role => {
                        delete newData[role];
                    });
                    return newData;
                    });
                }}
            /> Non-Helpline Volunteer
          </label>
          <label>
            <input
                type="radio"
                value="helpline"
                checked={volunteerType === 'helpline'}
                onChange={() => {
                    setVolunteerType('helpline');
              
                    setFormData(prev => {
                    const newData = { ...prev };
                    volunteerRolesNonHelpline.forEach(role => {
                        delete newData[role];
                    });
                    return newData;
                    });
                }}
            /> Helpline Volunteer
          </label>
        </div>

        {volunteerType === 'non-helpline' && (
          <fieldset>
            <legend>💼 Volunteer Interests (Non-Helpline)</legend>
            {volunteerRolesNonHelpline.map((role, idx) => (
              <label key={idx}>
                <input type="checkbox" name={role} onChange={handleChange} /> {role}
              </label>
            ))}
            <input name="otherNonHelpline" placeholder="Other: Please Specify" onChange={handleChange} />
          </fieldset>
        )}

        {volunteerType === 'helpline' && (
          <fieldset>
            <legend>💼 Volunteer Interests (Helpline)</legend>
            {volunteerRolesHelpline.map((role, idx) => (
              <label key={idx}>
                <input type="checkbox" name={role} onChange={handleChange} /> {role}
              </label>
            ))}
          </fieldset>
        )}

        <fieldset>
          <legend>🕒 Availability</legend>
          <div>
            <strong>Days:</strong><br />
            {availabilityDays.map((day, idx) => (
              <label key={idx}>
                <input type="checkbox" name={day} onChange={handleChange} /> {day}
              </label>
            ))}
          </div>
          <div>
            <strong>Times:</strong><br />
            {availabilityTimes.map((time, idx) => (
              <label key={idx}>
                <input type="checkbox" name={time} onChange={handleChange} /> {time}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Additional Information</legend>
          <textarea name="whyVolunteer" placeholder="Why do you want to volunteer with us?" onChange={handleChange}></textarea>
          <textarea name="skillsExperience" placeholder="Do you have any relevant skills or experience?" onChange={handleChange}></textarea>
        </fieldset>

        <fieldset>
          <legend>✅ Agreement & Consent</legend>
          <label>
            <input type="checkbox" name="agreePolicy" checked={formData.agreePolicy} onChange={handleChange} />
            I agree to follow the organization’s volunteer policies and code of conduct.
          </label>
          <label>
            <input type="checkbox" name="consentContact" checked={formData.consentContact} onChange={handleChange} />
            I consent to be contacted via email or phone regarding volunteer opportunities.
          </label>
          <label>
            <input type="checkbox" name="confirmInfo" checked={formData.confirmInfo} onChange={handleChange} />
            I confirm that the information provided is accurate to the best of my knowledge.
          </label>
          <label>
            <input type="checkbox" name="cyberLawConsent" checked={formData.cyberLawConsent} onChange={handleChange} />
            I understand that any misuse of user information may result in legal action under the Cyber Security Act of Bangladesh.
          </label>
        </fieldset>

        <button type="submit" disabled={!isFormValid()}>
          Submit
        </button>

        <div className="footer-info">
          <p>Already have an account? <button className="login-btn">Login Here</button></p>
          <p>By continuing, I agree to the terms and conditions of use & privacy policy</p>
        </div>
      </form>
    </div>
  );
};

export default VolunteerRegistration;