
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { BiHide } from "react-icons/bi";
import { VolunteerContext } from "../context/VolunteerContext";
import './CSS/UpdateVolunteer.css'; 


const UpdateVolunteer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { volunteers, addUpdateRequest } = useContext(VolunteerContext);

  const [volunteerType, setVolunteerType] = useState('');
  const [formData, setFormData] = useState({});
  const [dobError, setDobError] = useState('');
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  
  // Prefill volunteer data from context
  useEffect(() => {
    const existingVolunteer = volunteers.find(v => v.id === parseInt(id));
    if (existingVolunteer) {
      setFormData(existingVolunteer);
      setVolunteerType(existingVolunteer.volunteerType);
    }
  }, [id, volunteers]);

  const volunteerRolesNonHelpline = useMemo(() => [
    'Event Support','Fundraising','Community Outreach','Campus Ambassador',
    'Social Media & Digital Promotion','Content Writing / Blogging',
    'Graphic Design / Creative Support','Technical Support (e.g., IT, website)',
    'Translation / Language Support','Photography / Videography',
    'Mentorship / Training','Case Follow-up Coordinator',
    'Crisis Response Assistant','Resource & Referral Assistant'
  ], []);

  const volunteerRolesHelpline = useMemo(() => ['Call/Chat Support Volunteer'], []);

  const availabilityDays = useMemo(() => ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], []);
  const availabilityTimes = useMemo(() => [
    '12:00 AM – 4:00 AM','4:00 AM – 8:00 AM','8:00 AM – 12:00 PM',
    '12:00 PM – 4:00 PM','4:00 PM – 8:00 PM','8:00 PM – 12:00 AM','Flexible / Available 24 Hours'
  ], []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'dob') {
      const dobDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      const d = today.getDate() - dobDate.getDate();
      if (m < 0 || (m === 0 && d < 0)) age--;
      setDobError(age < 18 ? 'You must be at least 18 years old.' : '');
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if ((name === 'password' && passwordData.confirmPassword && value !== passwordData.confirmPassword) ||
        (name === 'confirmPassword' && value !== passwordData.password)) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const isFormValid = useCallback(() => {
    const requiredFields = ['fullName','email','phone','dob','street','city','state','postalCode'];
    const filledFields = requiredFields.every(field => formData[field]?.toString().trim() !== '');
    const phoneValid = /^\d+$/.test(formData.phone || '');
    const postalCodeValid = /^\d+$/.test(formData.postalCode || '');
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

    const passwordsMatch = (!passwordData.password && !passwordData.confirmPassword) || 
                           (passwordData.password === passwordData.confirmPassword);

    return filledFields && consentChecks && availabilityDayChecked && availabilityTimeChecked &&
           hasSelectedVolunteerType && volunteerInterestSelected && dobError === '' &&
           passwordsMatch && phoneValid && postalCodeValid;
  }, [formData, volunteerType, dobError, availabilityDays, availabilityTimes, volunteerRolesNonHelpline, volunteerRolesHelpline, passwordData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please complete all required fields correctly.");
      return;
    }

    // Add update request to context
    addUpdateRequest({ id: Date.now(), volunteerId: parseInt(id), data: { ...formData, password: passwordData.password || undefined } });
    alert("Volunteer update submitted successfully!");
    navigate("/admin");
  };

  return (
    <div className="volunteer-registration">
      <h1>Update Volunteer Information</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <fieldset>
          <legend>👤 Personal Information</legend>
          <input name="fullName" placeholder="Full Name" value={formData.fullName || ''} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleChange} />
          <input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} />
          {dobError && <p style={{ color: 'red' }}>{dobError}</p>}
        </fieldset>

        {/* Address */}
        <fieldset>
          <legend>📍 Address</legend>
          <input name="street" placeholder="Street" value={formData.street || ''} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city || ''} onChange={handleChange} />
          <input name="state" placeholder="State" value={formData.state || ''} onChange={handleChange} />
          <input name="postalCode" placeholder="Postal Code" value={formData.postalCode || ''} onChange={handleChange} />
        </fieldset>

        {/* Volunteer Type */}
        <div className="volunteer-type">
          <label>
            <input type="radio" value="non-helpline" checked={volunteerType==='non-helpline'} 
              onChange={() => setVolunteerType('non-helpline')} /> Non-Helpline Volunteer
          </label>
          <label>
            <input type="radio" value="helpline" checked={volunteerType==='helpline'} 
              onChange={() => setVolunteerType('helpline')} /> Helpline Volunteer
          </label>
        </div>

        {/* Volunteer Interests */}
        {volunteerType==='non-helpline' && (
          <fieldset>
            <legend>💼 Interests (Non-Helpline)</legend>
            {volunteerRolesNonHelpline.map((role, idx) => (
              <label key={idx}><input type="checkbox" name={role} checked={!!formData[role]} onChange={handleChange} /> {role}</label>
            ))}
            <input name="otherNonHelpline" placeholder="Other" value={formData.otherNonHelpline || ''} onChange={handleChange} />
          </fieldset>
        )}
        {volunteerType==='helpline' && (
          <fieldset>
            <legend>💼 Interests (Helpline)</legend>
            {volunteerRolesHelpline.map((role, idx) => (
              <label key={idx}><input type="checkbox" name={role} checked={!!formData[role]} onChange={handleChange} /> {role}</label>
            ))}
          </fieldset>
        )}

        {/* Availability */}
        <fieldset>
          <legend>🕒 Availability</legend>
          <div><strong>Days:</strong>{availabilityDays.map((day,idx)=>
            <label key={idx}><input type="checkbox" name={day} checked={!!formData[day]} onChange={handleChange} /> {day}</label>
          )}</div>
          <div><strong>Times:</strong>{availabilityTimes.map((time,idx)=>
            <label key={idx}><input type="checkbox" name={time} checked={!!formData[time]} onChange={handleChange} /> {time}</label>
          )}</div>
        </fieldset>

        {/* Additional Info */}
        <fieldset>
          <legend>Additional Information</legend>
          <textarea name="whyVolunteer" placeholder="Why volunteer?" value={formData.whyVolunteer || ''} onChange={handleChange}></textarea>
          <textarea name="skillsExperience" placeholder="Skills / Experience" value={formData.skillsExperience || ''} onChange={handleChange}></textarea>
        </fieldset>

        {/* Password */}
        <fieldset>
          <legend>🔒 Update Password (optional)</legend>
          <div style={{position:'relative', marginBottom:'1rem'}}>
            <input type={showPassword?'text':'password'} name="password" placeholder="New Password" onChange={handlePasswordChange} value={passwordData.password} />
            <BiHide onClick={()=>setShowPassword(prev=>!prev)} style={{position:'absolute',right:'10px',top:'50%', cursor:'pointer'}} />
          </div>
          <div style={{position:'relative', marginBottom:'1rem'}}>
            <input type={showPassword?'text':'password'} name="confirmPassword" placeholder="Confirm Password" onChange={handlePasswordChange} value={passwordData.confirmPassword} />
            <BiHide onClick={()=>setShowPassword(prev=>!prev)} style={{position:'absolute',right:'10px',top:'50%', cursor:'pointer'}} />
          </div>
          {passwordError && <p style={{color:'red'}}>{passwordError}</p>}
        </fieldset>

        {/* Agreements */}
        <fieldset>
          <legend>✅ Agreement & Consent</legend>
          <label><input type="checkbox" name="agreePolicy" checked={!!formData.agreePolicy} onChange={handleChange} /> Agree to policies</label>
          <label><input type="checkbox" name="consentContact" checked={!!formData.consentContact} onChange={handleChange} /> Consent to be contacted</label>
          <label><input type="checkbox" name="confirmInfo" checked={!!formData.confirmInfo} onChange={handleChange} /> Confirm info accurate</label>
          <label><input type="checkbox" name="cyberLawConsent" checked={!!formData.cyberLawConsent} onChange={handleChange} /> Understand legal terms</label>
        </fieldset>

        <button type="submit" disabled={!isFormValid()}>Update</button>
      </form>
    </div>
  );
};

export default UpdateVolunteer;
