
// import React, { useState, useCallback, useMemo } from 'react';
// import './CSS/VolunteerRegistration.css';
// import { useNavigate } from "react-router-dom";

// const VolunteerRegistration = () => {
//   const navigate = useNavigate();
//   const [volunteerType, setVolunteerType] = useState('');
//   const [formData, setFormData] = useState({
//     fullName: '', email: '', phone: '', dob: '',
//     street: '', city: '', state: '', postalCode: '',
//     whyVolunteer: '', skillsExperience: '', otherNonHelpline: '',
//     agreePolicy: false, consentContact: false, confirmInfo: false, cyberLawConsent: false,
//     Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false,
//     '12:00 AM – 4:00 AM': false, '4:00 AM – 8:00 AM': false, '8:00 AM – 12:00 PM': false,
//     '12:00 PM – 4:00 PM': false, '4:00 PM – 8:00 PM': false, '8:00 PM – 12:00 AM': false,
//     'Flexible / Available 24 Hours': false,
//   });
//   const [dobError, setDobError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const volunteerRolesNonHelpline = useMemo(() => [
//     'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
//     'Social Media & Digital Promotion', 'Content Writing / Blogging',
//     'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
//     'Translation / Language Support', 'Photography / Videography',
//     'Mentorship / Training', 'Case Follow-up Coordinator',
//     'Crisis Response Assistant', 'Resource & Referral Assistant'
//   ], []);

//   const volunteerRolesHelpline = useMemo(() => [
//     'Call/Chat Support Volunteer'
//   ], []);

//   const availabilityDays = useMemo(() => [
//     'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
//   ], []);

//   const availabilityTimes = useMemo(() => [
//     '12:00 AM – 4:00 AM', '4:00 AM – 8:00 AM', '8:00 AM – 12:00 PM',
//     '12:00 PM – 4:00 PM', '4:00 PM – 8:00 PM', '8:00 PM – 12:00 AM',
//     'Flexible / Available 24 Hours'
//   ], []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     // Clear messages on change
//     if (errorMessage) setErrorMessage('');
//     if (successMessage) setSuccessMessage('');

//     if (name === 'dob') {
//       if (value) {
//         const dobDate = new Date(value);
//         const today = new Date();
//         let age = today.getFullYear() - dobDate.getFullYear();
//         const m = today.getMonth() - dobDate.getMonth();
//         const d = today.getDate() - dobDate.getDate();
//         if (m < 0 || (m === 0 && d < 0)) age--;
//         setDobError(age < 18 ? 'You must be at least 18 years old.' : '');
//       } else {
//         setDobError('');
//       }
//     }

//     if (name === 'phone') {
//       const numericValue = value.replace(/\D/g, '');
//       setFormData(prev => ({ ...prev, [name]: numericValue }));
//       return;
//     }
//     if (name === 'postalCode') {
//       const numericValue = value.replace(/\D/g, '');
//       setFormData(prev => ({ ...prev, [name]: numericValue }));
//       return;
//     }

//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleVolunteerTypeChange = (type) => {
//     setVolunteerType(type);
//     const newFormData = { ...formData };
//     if (type === 'non-helpline') {
//       volunteerRolesHelpline.forEach(role => delete newFormData[role]);
//     } else if (type === 'helpline') {
//       volunteerRolesNonHelpline.forEach(role => delete newFormData[role]);
//       newFormData.otherNonHelpline = '';
//     }
//     setFormData(newFormData);
//   };

//   const isFormValid = useCallback(() => {
//     const requiredFields = ['fullName', 'email', 'phone', 'dob', 'street', 'city', 'state', 'postalCode'];
//     const filledFields = requiredFields.every(field => formData[field] && formData[field].trim() !== '');

//     const emailValid = formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : false;
//     const phoneValid = formData.phone ? /^\d{10,15}$/.test(formData.phone) : false;
//     const postalCodeValid = formData.postalCode ? /^\d+$/.test(formData.postalCode) : false;

//     const consentChecks = formData.agreePolicy && formData.consentContact && formData.confirmInfo && formData.cyberLawConsent;
//     const availabilityDayChecked = availabilityDays.some(day => formData[day]);
//     const availabilityTimeChecked = availabilityTimes.some(time => formData[time]);
//     const hasSelectedVolunteerType = volunteerType !== '';

//     let volunteerInterestSelected = false;
//     if (volunteerType === 'non-helpline') {
//       volunteerInterestSelected = volunteerRolesNonHelpline.some(role => formData[role]) || !!formData.otherNonHelpline?.trim();
//     } else if (volunteerType === 'helpline') {
//       volunteerInterestSelected = volunteerRolesHelpline.some(role => formData[role]);
//     }

//     return (
//       filledFields &&
//       emailValid &&
//       phoneValid &&
//       postalCodeValid &&
//       consentChecks &&
//       availabilityDayChecked &&
//       availabilityTimeChecked &&
//       hasSelectedVolunteerType &&
//       volunteerInterestSelected &&
//       dobError === ''
//     );
//   }, [formData, volunteerType, dobError, availabilityDays, availabilityTimes, volunteerRolesNonHelpline, volunteerRolesHelpline]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isFormValid()) {
//       setErrorMessage("Please complete all required fields correctly.");
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const selectedRoles = volunteerType === 'non-helpline'
//         ? [...volunteerRolesNonHelpline.filter(role => formData[role]), ...(formData.otherNonHelpline?.trim() ? [formData.otherNonHelpline.trim()] : [])]
//         : volunteerRolesHelpline.filter(role => formData[role]);
//       const selectedDays = availabilityDays.filter(day => formData[day]);
//       const selectedTimes = availabilityTimes.filter(time => formData[time]);

//       const payload = {
//         fullName: formData.fullName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         phone: formData.phone.trim(),
//         dob: formData.dob,
//         address: {
//           street: formData.street.trim(),
//           city: formData.city.trim(),
//           state: formData.state.trim(),
//           postalCode: formData.postalCode.trim(),
//           country: 'Bangladesh'
//         },
//         volunteerType,
//         volunteerRoles: selectedRoles,
//         availability: {
//           days: selectedDays,
//           times: selectedTimes
//         },
//         additionalInfo: {
//           whyVolunteer: formData.whyVolunteer?.trim() || '',
//           skillsExperience: formData.skillsExperience?.trim() || ''
//         },
//         consent: {
//           agreePolicy: formData.agreePolicy,
//           consentContact: formData.consentContact,
//           confirmInfo: formData.confirmInfo,
//           cyberLawConsent: formData.cyberLawConsent
//         },
//         registrationDate: new Date().toISOString(),
//         isAdmin: false,
//         status: 'pending',
//         isApproved: false
//       };

//       const response = await fetch("http://localhost:5000/api/volunteers/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setSuccessMessage(
//           `Registration successful! Your account is pending admin approval. 
//           You will receive an email once approved and can then login to your dashboard.
//           ${volunteerType === 'helpline' ? 'You will be redirected to the Helpline Volunteer Dashboard after approval.' : 'You will be redirected to the Non-Helpline Volunteer Dashboard after approval.'}`
//         );
//         // Reset form after successful registration
//         const resetForm = { ...formData };
//         Object.keys(resetForm).forEach(key => {
//           resetForm[key] = typeof resetForm[key] === 'boolean' ? false : '';
//         });
//         setFormData(resetForm);
//         setVolunteerType('');
//         setDobError('');

//         // Redirect to login after 3 seconds
//         setTimeout(() => {
//           navigate("/volunteer-login");
//         }, 3000);
//       } else {
//         if (data.message) {
//           setErrorMessage(data.message);
//         } else if (data.details) {
//           setErrorMessage(data.details);
//         } else if (data.errors) {
//           const errorMessages = Object.values(data.errors).map(err => err.message || err).join(', ');
//           setErrorMessage(errorMessages);
//         } else {
//           setErrorMessage("Registration failed. Please check your information and try again.");
//         }
//       }
//     } catch (error) {
//       if (error.message && error.message.includes('fetch')) {
//         setErrorMessage("Cannot connect to server. Please check if the backend server is running on http://localhost:5000");
//       } else {
//         setErrorMessage(`Network error: ${error.message}. Please check your connection and try again.`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="volunteer-registration">
//       <h1>Volunteer Registration Form</h1>
//       <p>Thank you for your interest in volunteering with us! Please fill out all required information below.</p>

//       {successMessage && (
//         <div style={{
//           backgroundColor: '#d4edda',
//           color: '#155724',
//           padding: '15px',
//           border: '1px solid #c3e6cb',
//           borderRadius: '8px',
//           marginBottom: '20px',
//           whiteSpace: 'pre-line',
//           fontSize: '14px'
//         }}>
//           <strong>Success:</strong> {successMessage}
//         </div>
//       )}

//       {errorMessage && (
//         <div style={{
//           backgroundColor: '#f8d7da',
//           color: '#721c24',
//           padding: '15px',
//           border: '1px solid #f5c6cb',
//           borderRadius: '8px',
//           marginBottom: '20px'
//         }}>
//           <strong>Registration Error:</strong> {errorMessage}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Personal Info */}
//         <fieldset>
//           <legend>👤 Personal Information (Required)</legend>
//           <input
//             name="fullName"
//             placeholder="Full Name *"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//           />

//           <input
//             name="email"
//             type="email"
//             placeholder="Email Address *"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
//             <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
//               Please enter a valid email address
//             </p>
//           )}

//           <input
//             name="phone"
//             placeholder="Phone Number (digits only) *"
//             value={formData.phone}
//             onChange={handleChange}
//             inputMode="numeric"
//             required
//           />
//           {formData.phone && (formData.phone.length < 10 || formData.phone.length > 15) && (
//             <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
//               Phone number must be 10-15 digits
//             </p>
//           )}

//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             max={new Date().toISOString().split("T")[0]}
//             onChange={handleChange}
//             required
//           />
//           {dobError && <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>{dobError}</p>}
//         </fieldset>

//         {/* Address */}
//         <fieldset>
//           <legend>🏠 Address (Required)</legend>
//           <input
//             name="street"
//             placeholder="Street Address *"
//             value={formData.street}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="city"
//             placeholder="City *"
//             value={formData.city}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="state"
//             placeholder="State *"
//             value={formData.state}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="postalCode"
//             placeholder="Postal Code (digits only) *"
//             value={formData.postalCode}
//             onChange={handleChange}
//             inputMode="numeric"
//             required
//           />
//           {formData.postalCode && !/^\d+$/.test(formData.postalCode) && (
//             <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
//               Postal code must contain only digits
//             </p>
//           )}
//         </fieldset>

//         {/* Volunteer Type */}
//         <fieldset>
//           <legend>🧩 Volunteer Type (Determines Your Dashboard)</legend>
//           <div style={{
//             marginBottom: '10px',
//             padding: '10px',
//             backgroundColor: '#e9ecef',
//             borderRadius: '5px'
//           }}>
//             <strong>Important:</strong> Your selection will determine which dashboard you'll access after approval:
//             <br />• <strong>Helpline:</strong> Access to call management and helpline-specific features
//             <br />• <strong>Non-Helpline:</strong> Access to activities, events, and community outreach features
//           </div>
//           <label>
//             <input
//               type="radio"
//               name="volunteerType"
//               value="helpline"
//               checked={volunteerType === 'helpline'}
//               onChange={() => handleVolunteerTypeChange('helpline')}
//             /> Helpline Volunteer
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="volunteerType"
//               value="non-helpline"
//               checked={volunteerType === 'non-helpline'}
//               onChange={() => handleVolunteerTypeChange('non-helpline')}
//             /> Non-Helpline Volunteer
//           </label>
//         </fieldset>

//         {/* Volunteer Roles */}
//         {volunteerType === 'non-helpline' && (
//           <fieldset>
//             <legend>🎯 Non-Helpline Volunteer Interests</legend>
//             {volunteerRolesNonHelpline.map(role => (
//               <label key={role}>
//                 <input
//                   type="checkbox"
//                   name={role}
//                   checked={!!formData[role]}
//                   onChange={handleChange}
//                 /> {role}
//               </label>
//             ))}
//             <input
//               name="otherNonHelpline"
//               placeholder="Other (please specify)"
//               value={formData.otherNonHelpline}
//               onChange={handleChange}
//             />
//           </fieldset>
//         )}

//         {volunteerType === 'helpline' && (
//           <fieldset>
//             <legend>🎯 Helpline Volunteer Roles</legend>
//             {volunteerRolesHelpline.map(role => (
//               <label key={role}>
//                 <input
//                   type="checkbox"
//                   name={role}
//                   checked={!!formData[role]}
//                   onChange={handleChange}
//                 /> {role}
//               </label>
//             ))}
//           </fieldset>
//         )}

//         {/* Availability */}
//         <fieldset>
//           <legend>⏰ Availability</legend>
//           <div>
//             <p>Days:</p>
//             {availabilityDays.map(day => (
//               <label key={day}>
//                 <input
//                   type="checkbox"
//                   name={day}
//                   checked={!!formData[day]}
//                   onChange={handleChange}
//                 /> {day}
//               </label>
//             ))}
//           </div>
//           <div>
//             <p>Time:</p>
//             {availabilityTimes.map(time => (
//               <label key={time}>
//                 <input
//                   type="checkbox"
//                   name={time}
//                   checked={!!formData[time]}
//                   onChange={handleChange}
//                 /> {time}
//               </label>
//             ))}
//           </div>
//         </fieldset>

//         {/* Additional Info */}
//         <fieldset>
//           <legend>✍ Additional Information</legend>
//           <textarea
//             name="whyVolunteer"
//             placeholder="Why do you want to volunteer?"
//             value={formData.whyVolunteer}
//             onChange={handleChange}
//           ></textarea>
//           <textarea
//             name="skillsExperience"
//             placeholder="Skills / Experience"
//             value={formData.skillsExperience}
//             onChange={handleChange}
//           ></textarea>
//         </fieldset>

//         {/* Consents */}
//         <fieldset>
//           <legend>✅ Consent & Agreements</legend>
//           <label>
//             <input
//               type="checkbox"
//               name="agreePolicy"
//               checked={formData.agreePolicy}
//               onChange={handleChange}
//             /> I agree to the Volunteer Policy *
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="consentContact"
//               checked={formData.consentContact}
//               onChange={handleChange}
//             /> I consent to be contacted *
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="confirmInfo"
//               checked={formData.confirmInfo}
//               onChange={handleChange}
//             /> I confirm all information is accurate *
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="cyberLawConsent"
//               checked={formData.cyberLawConsent}
//               onChange={handleChange}
//             /> I agree to abide by Cyber Security laws *
//           </label>
//         </fieldset>

//         <button
//           type="submit"
//           disabled={loading || !isFormValid()}
//           style={{
//             padding: '12px 24px',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             marginBottom: '20px',
//             backgroundColor: loading || !isFormValid() ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: loading || !isFormValid() ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'Submitting...' : 'Register'}
//         </button>

//         <div style={{
//           textAlign: 'center',
//           marginTop: '20px',
//           padding: '20px',
//           backgroundColor: '#f5f5f5',
//           borderRadius: '8px',
//           border: '1px solid #ddd'
//         }}>
//           <p style={{ margin: '0 0 10px 0', color: '#666' }}>
//             Already have an account?
//           </p>
//           <button
//             type="button"
//             onClick={() => navigate("/volunteer-login")}
//             disabled={loading}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#007bff',
//               textDecoration: 'underline',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: 'bold'
//             }}
//           >
//             Login Here
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default VolunteerRegistration;











// src/components/VolunteerRegistration.jsx
import React, { useState, useCallback, useMemo } from 'react';
import './CSS/VolunteerRegistration.css';
import { useNavigate } from 'react-router-dom';

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [volunteerType, setVolunteerType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    whyVolunteer: '',
    skillsExperience: '',
    otherNonHelpline: '',
    agreePolicy: false,
    consentContact: false,
    confirmInfo: false,
    cyberLawConsent: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
    '12:00 AM – 4:00 AM': false,
    '4:00 AM – 8:00 AM': false,
    '8:00 AM – 12:00 PM': false,
    '12:00 PM – 4:00 PM': false,
    '4:00 PM – 8:00 PM': false,
    '8:00 PM – 12:00 AM': false,
    'Flexible / Available 24 Hours': false,
  });
  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const volunteerRolesNonHelpline = useMemo(
    () => [
      'Event Support',
      'Fundraising',
      'Community Outreach',
      'Campus Ambassador',
      'Social Media & Digital Promotion',
      'Content Writing / Blogging',
      'Graphic Design / Creative Support',
      'Technical Support (e.g., IT, website)',
      'Translation / Language Support',
      'Photography / Videography',
      'Mentorship / Training',
      'Case Follow-up Coordinator',
      'Crisis Response Assistant',
      'Resource & Referral Assistant',
    ],
    []
  );

  const volunteerRolesHelpline = useMemo(() => ['Call/Chat Support Volunteer'], []);

  const availabilityDays = useMemo(
    () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    []
  );

  const availabilityTimes = useMemo(
    () => [
      '12:00 AM – 4:00 AM',
      '4:00 AM – 8:00 AM',
      '8:00 AM – 12:00 PM',
      '12:00 PM – 4:00 PM',
      '4:00 PM – 8:00 PM',
      '8:00 PM – 12:00 AM',
      'Flexible / Available 24 Hours',
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');

    if (name === 'dob') {
      if (value) {
        const dobDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        const d = today.getDate() - dobDate.getDate();
        if (m < 0 || (m === 0 && d < 0)) age--;
        setDobError(age < 18 ? 'You must be at least 18 years old.' : '');
      } else {
        setDobError('');
      }
    }

    if (name === 'phone' || name === 'postalCode') {
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVolunteerTypeChange = (type) => {
    setVolunteerType(type);
    const newFormData = { ...formData };
    if (type === 'non-helpline') {
      volunteerRolesHelpline.forEach((role) => delete newFormData[role]);
    } else if (type === 'helpline') {
      volunteerRolesNonHelpline.forEach((role) => delete newFormData[role]);
      newFormData.otherNonHelpline = '';
    }
    setFormData(newFormData);
  };

  const isFormValid = useCallback(() => {
    const requiredFields = ['fullName', 'email', 'phone', 'dob', 'street', 'city', 'state', 'postalCode'];
    const filledFields = requiredFields.every((field) => formData[field]?.trim());

    const emailValid = formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : false;
    const phoneValid = formData.phone ? /^\d{10,15}$/.test(formData.phone) : false;
    const postalCodeValid = formData.postalCode ? /^\d+$/.test(formData.postalCode) : false;

    const consentChecks = formData.agreePolicy && formData.consentContact && formData.confirmInfo && formData.cyberLawConsent;
    const availabilityDayChecked = availabilityDays.some((day) => formData[day]);
    const availabilityTimeChecked = availabilityTimes.some((time) => formData[time]);
    const hasSelectedVolunteerType = volunteerType !== '';

    let volunteerInterestSelected = false;
    if (volunteerType === 'non-helpline') {
      volunteerInterestSelected = volunteerRolesNonHelpline.some((role) => formData[role]) || !!formData.otherNonHelpline?.trim();
    } else if (volunteerType === 'helpline') {
      volunteerInterestSelected = volunteerRolesHelpline.some((role) => formData[role]);
    }

    return (
      filledFields &&
      emailValid &&
      phoneValid &&
      postalCodeValid &&
      consentChecks &&
      availabilityDayChecked &&
      availabilityTimeChecked &&
      hasSelectedVolunteerType &&
      volunteerInterestSelected &&
      dobError === ''
    );
  }, [formData, volunteerType, dobError, availabilityDays, availabilityTimes, volunteerRolesNonHelpline, volunteerRolesHelpline]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const selectedRoles = volunteerType === 'non-helpline'
        ? [...volunteerRolesNonHelpline.filter((role) => formData[role]), ...(formData.otherNonHelpline?.trim() ? [formData.otherNonHelpline.trim()] : [])]
        : volunteerRolesHelpline.filter((role) => formData[role]);
      const selectedDays = availabilityDays.filter((day) => formData[day]);
      const selectedTimes = availabilityTimes.filter((time) => formData[time]);

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: 'Bangladesh',
        },
        volunteerType,
        volunteerRoles: selectedRoles,
        availability: {
          days: selectedDays,
          times: selectedTimes,
          timezone: 'Asia/Dhaka',
        },
        additionalInfo: {
          whyVolunteer: formData.whyVolunteer?.trim() || '',
          skillsExperience: formData.skillsExperience?.trim() || '',
        },
        consent: {
          agreePolicy: formData.agreePolicy,
          consentContact: formData.consentContact,
          confirmInfo: formData.confirmInfo,
          cyberLawConsent: formData.cyberLawConsent,
        },
      };

      console.log('Submitting registration payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:5000/api/volunteers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok && data.success) {
        setSuccessMessage(
          `Registration successful! Your account is pending admin approval. You will receive an email once approved and can then login to your dashboard. ${
            volunteerType === 'helpline'
              ? 'You will be redirected to the Helpline Volunteer Dashboard after approval.'
              : 'You will be redirected to the Non-Helpline Volunteer Dashboard after approval.'
          }`
        );
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dob: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          whyVolunteer: '',
          skillsExperience: '',
          otherNonHelpline: '',
          agreePolicy: false,
          consentContact: false,
          confirmInfo: false,
          cyberLawConsent: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
          '12:00 AM – 4:00 AM': false,
          '4:00 AM – 8:00 AM': false,
          '8:00 AM – 12:00 PM': false,
          '12:00 PM – 4:00 PM': false,
          '4:00 PM – 8:00 PM': false,
          '8:00 PM – 12:00 AM': false,
          'Flexible / Available 24 Hours': false,
        });
        setVolunteerType('');
        setDobError('');
        setTimeout(() => navigate('/volunteer-login'), 3000);
      } else {
        setErrorMessage(
          data.message ||
          data.details ||
          (data.errors ? Object.values(data.errors).map((err) => err.message || err).join(', ') : 'Registration failed. Please check your information and try again.')
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(
        error.message.includes('Failed to fetch')
          ? 'Cannot connect to server. Please check if the backend server is running on http://localhost:5000'
          : `Network error: ${error.message}. Please check your connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-registration">
      <h1>Volunteer Registration Form</h1>
      <p>Thank you for your interest in volunteering with us! Please fill out all required information below.</p>

      {successMessage && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', border: '1px solid #c3e6cb', borderRadius: '8px', marginBottom: '20px', whiteSpace: 'pre-line', fontSize: '14px' }}>
          <strong>Success:</strong> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', border: '1px solid #f5c6cb', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Registration Error:</strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>👤 Personal Information (Required)</legend>
          <input name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required />
          {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>Please enter a valid email address</p>
          )}
          <input name="phone" placeholder="Phone Number (digits only) *" value={formData.phone} onChange={handleChange} inputMode="numeric" required />
          {formData.phone && (formData.phone.length < 10 || formData.phone.length > 15) && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>Phone number must be 10-15 digits</p>
          )}
          <input type="date" name="dob" value={formData.dob} max={new Date().toISOString().split('T')[0]} onChange={handleChange} required />
          {dobError && <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>{dobError}</p>}
        </fieldset>

        <fieldset>
          <legend>🏠 Address (Required)</legend>
          <input name="street" placeholder="Street Address *" value={formData.street} onChange={handleChange} required />
          <input name="city" placeholder="City *" value={formData.city} onChange={handleChange} required />
          <input name="state" placeholder="State *" value={formData.state} onChange={handleChange} required />
          <input name="postalCode" placeholder="Postal Code (digits only) *" value={formData.postalCode} onChange={handleChange} inputMode="numeric" required />
          {formData.postalCode && !/^\d+$/.test(formData.postalCode) && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>Postal code must contain only digits</p>
          )}
        </fieldset>

        <fieldset>
          <legend>🧩 Volunteer Type (Determines Your Dashboard)</legend>
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
            <strong>Important:</strong> Your selection will determine which dashboard you'll access after approval:
            <br />• <strong>Helpline:</strong> Access to call management and helpline-specific features
            <br />• <strong>Non-Helpline:</strong> Access to activities, events, and community outreach features
          </div>
          <label>
            <input type="radio" name="volunteerType" value="helpline" checked={volunteerType === 'helpline'} onChange={() => handleVolunteerTypeChange('helpline')} /> Helpline Volunteer
          </label>
          <label>
            <input type="radio" name="volunteerType" value="non-helpline" checked={volunteerType === 'non-helpline'} onChange={() => handleVolunteerTypeChange('non-helpline')} /> Non-Helpline Volunteer
          </label>
        </fieldset>

        {volunteerType === 'non-helpline' && (
          <fieldset>
            <legend>🎯 Non-Helpline Volunteer Interests</legend>
            {volunteerRolesNonHelpline.map((role) => (
              <label key={role}>
                <input type="checkbox" name={role} checked={!!formData[role]} onChange={handleChange} /> {role}
              </label>
            ))}
            <input name="otherNonHelpline" placeholder="Other (please specify)" value={formData.otherNonHelpline} onChange={handleChange} />
          </fieldset>
        )}

        {volunteerType === 'helpline' && (
          <fieldset>
            <legend>🎯 Helpline Volunteer Roles</legend>
            {volunteerRolesHelpline.map((role) => (
              <label key={role}>
                <input type="checkbox" name={role} checked={!!formData[role]} onChange={handleChange} /> {role}
              </label>
            ))}
          </fieldset>
        )}

        <fieldset>
          <legend>⏰ Availability</legend>
          <div>
            <p>Days:</p>
            {availabilityDays.map((day) => (
              <label key={day}>
                <input type="checkbox" name={day} checked={!!formData[day]} onChange={handleChange} /> {day}
              </label>
            ))}
          </div>
          <div>
            <p>Time:</p>
            {availabilityTimes.map((time) => (
              <label key={time}>
                <input type="checkbox" name={time} checked={!!formData[time]} onChange={handleChange} /> {time}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>✍ Additional Information</legend>
          <textarea name="whyVolunteer" placeholder="Why do you want to volunteer?" value={formData.whyVolunteer} onChange={handleChange}></textarea>
          <textarea name="skillsExperience" placeholder="Skills / Experience" value={formData.skillsExperience} onChange={handleChange}></textarea>
        </fieldset>

        <fieldset>
          <legend>✅ Consent & Agreements</legend>
          <label>
            <input type="checkbox" name="agreePolicy" checked={formData.agreePolicy} onChange={handleChange} /> I agree to the Volunteer Policy *
          </label>
          <label>
            <input type="checkbox" name="consentContact" checked={formData.consentContact} onChange={handleChange} /> I consent to be contacted *
          </label>
          <label>
            <input type="checkbox" name="confirmInfo" checked={formData.confirmInfo} onChange={handleChange} /> I confirm all information is accurate *
          </label>
          <label>
            <input type="checkbox" name="cyberLawConsent" checked={formData.cyberLawConsent} onChange={handleChange} /> I agree to abide by Cyber Security laws *
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px',
            backgroundColor: loading || !isFormValid() ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !isFormValid() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>Already have an account?</p>
          <button
            type="button"
            onClick={() => navigate('/volunteer-login')}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Login Here
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerRegistration;