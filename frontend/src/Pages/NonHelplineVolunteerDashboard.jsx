// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./CSS/VolunteerDashboard.css";



// const NonHelplineVolunteerDashboard = () => {
//   // Profile states
//   const [volunteer, setVolunteer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Announcements states
//   const [announcements, setAnnouncements] = useState([]);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
//   const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
  
//   // Update request states
//   const [updateRequests, setUpdateRequests] = useState([]);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [updateRequestData, setUpdateRequestData] = useState({
//     fullName: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       postalCode: ''
//     },
//     volunteerRoles: [],
//     availability: {
//       days: [],
//       times: []
//     },
//     additionalInfo: {
//       whyVolunteer: '',
//       skillsExperience: ''
//     }
//   });
  
//   // Activity states
//   const [activities, setActivities] = useState([]);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [filteredActivities, setFilteredActivities] = useState([]);
  
//   // Modal states
//   const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
  
//   const refreshInterval = useRef(null);
//   const announcementCheck = useRef(null);
//   const navigate = useNavigate();
  
//   const categories = [
//     'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
//     'Social Media & Digital Promotion', 'Content Writing / Blogging',
//     'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
//     'Translation / Language Support', 'Photography / Videography',
//     'Mentorship / Training', 'Case Follow-up Coordinator',
//     'Crisis Response Assistant', 'Resource & Referral Assistant'
//   ];

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

//   useEffect(() => {
//     const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
//     if (!volunteerData._id) {
//       navigate('/volunteer-login');
//       return;
//     }
//     if (volunteerData.volunteerType !== 'non-helpline') {
//       navigate('/volunteer-dashboard');
//       return;
//     }
//     setVolunteer(volunteerData);
//     fetchVolunteerData(volunteerData._id);
//     setupRealTimeUpdates(volunteerData._id);
    
//     return () => {
//       if (refreshInterval.current) clearInterval(refreshInterval.current);
//       if (announcementCheck.current) clearInterval(announcementCheck.current);
//     };
//   }, [navigate]);

//   useEffect(() => {
//     if (categoryFilter === '') {
//       setFilteredActivities(activities);
//     } else {
//       setFilteredActivities(activities.filter(activity => 
//         activity.category === categoryFilter
//       ));
//     }
//   }, [activities, categoryFilter]);

//   const setupRealTimeUpdates = (volunteerId) => {
//     // Fetch data every 10 seconds for real-time updates
//     refreshInterval.current = setInterval(() => {
//       fetchVolunteerData(volunteerId);
//     }, 10000);
    
//     // Check for new announcements every 5 seconds
//     announcementCheck.current = setInterval(() => {
//       fetchAnnouncements(true);
//     }, 5000);
//   };

//   const fetchVolunteerData = async (volunteerId) => {
//     try {
//       setLoading(true);
//       const [profileRes, requestsRes, announcementsRes, activitiesRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
//         axios.get('http://localhost:5000/api/announcements'),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/activities`)
//       ]);

//       // Update profile data
//       if (profileRes.data.success) {
//         setVolunteer(profileRes.data.data);
//         localStorage.setItem('volunteer', JSON.stringify(profileRes.data.data));
//       }

//       // Update requests data
//       if (requestsRes.data.success) {
//         setUpdateRequests(requestsRes.data.data);
//       }

//       // Update announcements data
//       if (announcementsRes.data.success) {
//         setAnnouncements(announcementsRes.data.data);
//       }

//       // Update activities data
//       if (activitiesRes.data.success) {
//         setActivities(activitiesRes.data.data);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching volunteer data:', error);
//       setError('Error loading dashboard data');
//       setLoading(false);
//     }
//   };

//   const fetchAnnouncements = async (checkForNew = false) => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/announcements');
//       if (response.data.success) {
//         const newAnnouncements = response.data.data;
        
//         if (checkForNew && announcements.length > 0) {
//           const latestNew = new Date(Math.max(...newAnnouncements.map(a => new Date(a.createdAt))));
//           if (latestNew > lastAnnouncementCheck) {
//             setHasNewAnnouncement(true);
//             setLastAnnouncementCheck(new Date());
//           }
//         }
        
//         setAnnouncements(newAnnouncements);
//       }
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//     }
//   };

//   const handleUpdateRequest = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/volunteers/${volunteer._id}/update-request`,
//         updateRequestData
//       );
      
//       if (response.data.success) {
//         alert('Update request submitted successfully!');
//         setShowUpdateForm(false);
//         setUpdateRequestData({
//           fullName: '',
//           phone: '',
//           address: { street: '', city: '', state: '', postalCode: '' },
//           volunteerRoles: [],
//           availability: { days: [], times: [] },
//           additionalInfo: { whyVolunteer: '', skillsExperience: '' }
//         });
//         fetchVolunteerData(volunteer._id);
//       }
//     } catch (error) {
//       console.error('Error submitting update request:', error);
//       alert('Error submitting update request');
//     }
//   };

//   const handleDeleteUpdateRequest = async (requestId) => {
//     if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/volunteers/${volunteer._id}/update-requests/${requestId}`
//       );
      
//       if (response.data.success) {
//         setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
//         alert('Update request deleted successfully!');
//       }
//     } catch (error) {
//       console.error('Error deleting update request:', error);
//       alert('Error deleting update request');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('volunteer');
//     navigate('/volunteer-login');
//   };

//   const handleInputChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setUpdateRequestData(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleArrayChange = (field, value, isChecked) => {
//     setUpdateRequestData(prev => ({
//       ...prev,
//       [field]: isChecked 
//         ? [...prev[field], value]
//         : prev[field].filter(item => item !== value)
//     }));
//   };

//   const handleAvailabilityChange = (type, value, isChecked) => {
//     setUpdateRequestData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [type]: isChecked 
//           ? [...prev.availability[type], value]
//           : prev.availability[type].filter(item => item !== value)
//       }
//     }));
//   };

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="volunteer-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-content">
//           <h1>Non-Helpline Volunteer Dashboard</h1>
//           <div className="header-actions">
//             <button 
//               className={`notification-btn ${hasNewAnnouncement ? 'has-notification' : ''}`}
//               onClick={() => {
//                 setIsAnnouncementModalOpen(true);
//                 setHasNewAnnouncement(false);
//               }}
//             >
//               📢 Announcements {hasNewAnnouncement && <span className="notification-dot"></span>}
//             </button>
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-content">
//         {/* Profile Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Profile Information</h2>
//             <button 
//               onClick={() => setShowUpdateForm(true)}
//               className="btn btn-primary"
//             >
//               Request Profile Update
//             </button>
//           </div>
//           <div className="profile-info">
//             <div className="info-row">
//               <span className="label">Name:</span>
//               <span className="value">{volunteer?.fullName}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Email:</span>
//               <span className="value">{volunteer?.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Phone:</span>
//               <span className="value">{volunteer?.phone}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Status:</span>
//               <span className={`status ${volunteer?.isApproved ? 'approved' : 'pending'}`}>
//                 {volunteer?.isApproved ? 'Approved' : 'Pending Approval'}
//               </span>
//             </div>
//             <div className="info-row">
//               <span className="label">Volunteer Roles:</span>
//               <span className="value">{volunteer?.volunteerRoles?.join(', ')}</span>
//             </div>
//           </div>
//         </div>

//         {/* Update Requests Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Update Requests</h2>
//           </div>
//           <div className="update-requests">
//             {updateRequests.length === 0 ? (
//               <p>No pending update requests</p>
//             ) : (
//               <div className="requests-table">
//                 {updateRequests.map(request => (
//                   <div key={request._id} className="request-item">
//                     <div className="request-info">
//                       <div className="request-status">
//                         Status: <span className={`status ${request.status}`}>{request.status}</span>
//                       </div>
//                       <div className="request-date">
//                         Submitted: {new Date(request.createdAt).toLocaleDateString()}
//                       </div>
//                       {request.adminResponse && (
//                         <div className="admin-response">
//                           Admin Response: {request.adminResponse}
//                         </div>
//                       )}
//                     </div>
//                     <button 
//                       onClick={() => handleDeleteUpdateRequest(request._id)}
//                       className="btn btn-danger btn-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Activities Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>My Activities</h2>
//             <div className="filter-section">
//               <select 
//                 value={categoryFilter} 
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="category-filter"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="activities-table">
//             {filteredActivities.length === 0 ? (
//               <p>No activities found</p>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Title</th>
//                     <th>Category</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Description</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredActivities.map(activity => (
//                     <tr key={activity._id}>
//                       <td>{activity.title}</td>
//                       <td>{activity.category}</td>
//                       <td>{new Date(activity.date).toLocaleDateString()}</td>
//                       <td>
//                         <span className={`status ${activity.status}`}>
//                           {activity.status}
//                         </span>
//                       </td>
//                       <td>{activity.description}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Update Form Modal */}
//       {showUpdateForm && (
//         <div className="modal-overlay">
//           <div className="modal-content large-modal">
//             <div className="modal-header">
//               <h2>Request Profile Update</h2>
//               <button 
//                 onClick={() => setShowUpdateForm(false)}
//                 className="close-btn"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>Full Name:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.fullName}
//                   onChange={(e) => handleInputChange('fullName', e.target.value)}
//                   placeholder={volunteer?.fullName}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Phone:</label>
//                 <input
//                   type="tel"
//                   value={updateRequestData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                   placeholder={volunteer?.phone}
//                 />
//               </div>

//               <div className="form-section">
//                 <h3>Address</h3>
//                 <div className="form-group">
//                   <label>Street:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.street}
//                     onChange={(e) => handleInputChange('address.street', e.target.value)}
//                     placeholder={volunteer?.address?.street}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>City:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.city}
//                     onChange={(e) => handleInputChange('address.city', e.target.value)}
//                     placeholder={volunteer?.address?.city}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>State:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.state}
//                     onChange={(e) => handleInputChange('address.state', e.target.value)}
//                     placeholder={volunteer?.address?.state}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Postal Code:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.postalCode}
//                     onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
//                     placeholder={volunteer?.address?.postalCode}
//                   />
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Volunteer Roles</h3>
//                 <div className="checkbox-group">
//                   {categories.map(category => (
//                     <label key={category} className="checkbox-item">
//                       <input
//                         type="checkbox"
//                         checked={updateRequestData.volunteerRoles.includes(category)}
//                         onChange={(e) => handleArrayChange('volunteerRoles', category, e.target.checked)}
//                       />
//                       {category}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Availability</h3>
//                 <div className="availability-section">
//                   <h4>Days</h4>
//                   <div className="checkbox-group">
//                     {daysOfWeek.map(day => (
//                       <label key={day} className="checkbox-item">
//                         <input
//                           type="checkbox"
//                           checked={updateRequestData.availability.days.includes(day)}
//                           onChange={(e) => handleAvailabilityChange('days', day, e.target.checked)}
//                         />
//                         {day}
//                       </label>
//                     ))}
//                   </div>
//                   <h4>Times</h4>
//                   <div className="checkbox-group">
//                     {timeSlots.map(time => (
//                       <label key={time} className="checkbox-item">
//                         <input
//                           type="checkbox"
//                           checked={updateRequestData.availability.times.includes(time)}
//                           onChange={(e) => handleAvailabilityChange('times', time, e.target.checked)}
//                         />
//                         {time}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Additional Information</h3>
//                 <div className="form-group">
//                   <label>Why do you want to volunteer?</label>
//                   <textarea
//                     value={updateRequestData.additionalInfo.whyVolunteer}
//                     onChange={(e) => handleInputChange('additionalInfo.whyVolunteer', e.target.value)}
//                     rows="3"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Skills and Experience:</label>
//                   <textarea
//                     value={updateRequestData.additionalInfo.skillsExperience}
//                     onChange={(e) => handleInputChange('additionalInfo.skillsExperience', e.target.value)}
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button onClick={() => setShowUpdateForm(false)} className="btn btn-secondary">
//                 Cancel
//               </button>
//               <button onClick={handleUpdateRequest} className="btn btn-primary">
//                 Submit Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Announcements Modal */}
//       {isAnnouncementModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Announcements</h2>
//               <button 
//                 onClick={() => setIsAnnouncementModalOpen(false)}
//                 className="close-btn"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               {announcements.length === 0 ? (
//                 <p>No announcements available</p>
//               ) : (
//                 <div className="announcements-list">
//                   {announcements.map(announcement => (
//                     <div key={announcement._id} className="announcement-item">
//                       <div className="announcement-header">
//                         <h3>{announcement.title}</h3>
//                         <span className="announcement-date">
//                           {new Date(announcement.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="announcement-content">
//                         <p>{announcement.content}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NonHelplineVolunteerDashboard;















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import "./CSS/VolunteerDashboard.css";

const NonHelplineVolunteerDashboard = () => {
  // Profile states
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Announcements states
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
  
  // Update request states
  const [updateRequests, setUpdateRequests] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateRequestData, setUpdateRequestData] = useState({
    fullName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    volunteerRoles: [],
    availability: {
      days: [],
      times: []
    },
    additionalInfo: {
      whyVolunteer: '',
      skillsExperience: ''
    }
  });
  
  // Activity states
  const [activities, setActivities] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  
  // Modal states
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  const navigate = useNavigate();
  
  const categories = [
    'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
    'Social Media & Digital Promotion', 'Content Writing / Blogging',
    'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
    'Translation / Language Support', 'Photography / Videography',
    'Mentorship / Training', 'Case Follow-up Coordinator',
    'Crisis Response Assistant', 'Resource & Referral Assistant'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  useEffect(() => {
    const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
    if (!volunteerData._id) {
      navigate('/volunteer-login');
      return;
    }
    if (volunteerData.volunteerType !== 'non-helpline') {
      navigate('/volunteer-dashboard');
      return;
    }
    setVolunteer(volunteerData);
    fetchVolunteerData(volunteerData._id);
    const socket = setupRealTimeUpdates(volunteerData._id);
    
    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (categoryFilter === '') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => 
        activity.category === categoryFilter
      ));
    }
  }, [activities, categoryFilter]);

  // REAL-TIME SETUP: Configure Socket.IO updates
  const setupRealTimeUpdates = (volunteerId) => {
    const socket = io('http://localhost:5000', {
      transports: ["websocket"],
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    socket.emit('joinVolunteerRoom');
    socket.emit('joinAnnouncementRoom');
    socket.emit('joinUpdateRequestRoom');

    // Real-time listeners
    socket.on('volunteerUpdated', (updatedVolunteer) => {
      if (updatedVolunteer._id === volunteerId) {
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
      }
    });

    socket.on('newAnnouncement', (announcement) => {
      setAnnouncements((prev) => [announcement, ...prev]);
      setHasNewAnnouncement(true);
      setLastAnnouncementCheck(new Date());
      if (Notification.permission === 'granted') {
        new Notification('New Announcement', {
          body: announcement.title,
          icon: '/favicon.ico'
        });
      }
    });

    socket.on('newUpdateRequest', (updateRequest) => {
      if (updateRequest.volunteerId === volunteerId) {
        setUpdateRequests((prev) => [...prev, updateRequest]);
      }
    });

    socket.on('updateRequestApproved', (reqId) => {
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      fetchVolunteerData(volunteerId); // Refresh profile after approval
    });

    socket.on('updateRequestRejected', (reqId) => {
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
    });

    socket.on('newActivity', (activity) => {
      if (activity.volunteerId === volunteerId) {
        setActivities((prev) => [...prev, activity]);
      }
    });

    return socket;
  };

  // REAL-TIME DATA FETCHING: Initial fetch only
  const fetchVolunteerData = async (volunteerId) => {
    try {
      setLoading(true);
      const [profileRes, requestsRes, announcementsRes, activitiesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
        axios.get('http://localhost:5000/api/announcements'),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/activities`)
      ]);

      // Update profile data
      if (profileRes.data.success) {
        setVolunteer(profileRes.data.data);
        localStorage.setItem('volunteer', JSON.stringify(profileRes.data.data));
      }

      // Update requests data
      if (requestsRes.data.success) {
        setUpdateRequests(requestsRes.data.data);
      }

      // Update announcements data
      if (announcementsRes.data.success) {
        setAnnouncements(announcementsRes.data.data);
      }

      // Update activities data
      if (activitiesRes.data.success) {
        setActivities(activitiesRes.data.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/volunteers/${volunteer._id}/update-request`,
        updateRequestData
      );
      
      if (response.data.success) {
        alert('Update request submitted successfully!');
        setShowUpdateForm(false);
        setUpdateRequestData({
          fullName: '',
          phone: '',
          address: { street: '', city: '', state: '', postalCode: '' },
          volunteerRoles: [],
          availability: { days: [], times: [] },
          additionalInfo: { whyVolunteer: '', skillsExperience: '' }
        });
        fetchVolunteerData(volunteer._id);
      }
    } catch (error) {
      console.error('Error submitting update request:', error);
      alert('Error submitting update request');
    }
  };

  const handleDeleteUpdateRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/volunteers/${volunteer._id}/update-requests/${requestId}`
      );
      
      if (response.data.success) {
        setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Update request deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting update request:', error);
      alert('Error deleting update request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('volunteer');
    navigate('/volunteer-login');
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUpdateRequestData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setUpdateRequestData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (field, value, isChecked) => {
    setUpdateRequestData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleAvailabilityChange = (type, value, isChecked) => {
    setUpdateRequestData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: isChecked 
          ? [...prev.availability[type], value]
          : prev.availability[type].filter(item => item !== value)
      }
    }));
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="volunteer-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Non-Helpline Volunteer Dashboard</h1>
          <div className="header-actions">
            <button 
              className={`notification-btn ${hasNewAnnouncement ? 'has-notification' : ''}`}
              onClick={() => {
                setIsAnnouncementModalOpen(true);
                setHasNewAnnouncement(false);
              }}
            >
              📢 Announcements {hasNewAnnouncement && <span className="notification-dot"></span>}
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Profile Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            <button 
              onClick={() => setShowUpdateForm(true)}
              className="btn btn-primary"
            >
              Request Profile Update
            </button>
          </div>
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{volunteer?.fullName}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{volunteer?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{volunteer?.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status ${volunteer?.isApproved ? 'approved' : 'pending'}`}>
                {volunteer?.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Volunteer Roles:</span>
              <span className="value">{volunteer?.volunteerRoles?.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Update Requests Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Update Requests</h2>
          </div>
          <div className="update-requests">
            {updateRequests.length === 0 ? (
              <p>No pending update requests</p>
            ) : (
              <div className="requests-table">
                {updateRequests.map(request => (
                  <div key={request._id} className="request-item">
                    <div className="request-info">
                      <div className="request-status">
                        Status: <span className={`status ${request.status}`}>{request.status}</span>
                      </div>
                      <div className="request-date">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {request.adminResponse && (
                        <div className="admin-response">
                          Admin Response: {request.adminResponse}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteUpdateRequest(request._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activities Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>My Activities</h2>
            <div className="filter-section">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="activities-table">
            {filteredActivities.length === 0 ? (
              <p>No activities found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map(activity => (
                    <tr key={activity._id}>
                      <td>{activity.title}</td>
                      <td>{activity.category}</td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${activity.status}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>Request Profile Update</h2>
              <button 
                onClick={() => setShowUpdateForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={updateRequestData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={volunteer?.fullName}
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={updateRequestData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={volunteer?.phone}
                />
              </div>

              <div className="form-section">
                <h3>Address</h3>
                <div className="form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder={volunteer?.address?.street}
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder={volunteer?.address?.city}
                  />
                </div>
                <div className="form-group">
                  <label>State:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder={volunteer?.address?.state}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                    placeholder={volunteer?.address?.postalCode}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Volunteer Roles</h3>
                <div className="checkbox-group">
                  {categories.map(category => (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={updateRequestData.volunteerRoles.includes(category)}
                        onChange={(e) => handleArrayChange('volunteerRoles', category, e.target.checked)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Availability</h3>
                <div className="availability-section">
                  <h4>Days</h4>
                  <div className="checkbox-group">
                    {daysOfWeek.map(day => (
                      <label key={day} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={updateRequestData.availability.days.includes(day)}
                          onChange={(e) => handleAvailabilityChange('days', day, e.target.checked)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  <h4>Times</h4>
                  <div className="checkbox-group">
                    {timeSlots.map(time => (
                      <label key={time} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={updateRequestData.availability.times.includes(time)}
                          onChange={(e) => handleAvailabilityChange('times', time, e.target.checked)}
                        />
                        {time}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                  <label>Why do you want to volunteer?</label>
                  <textarea
                    value={updateRequestData.additionalInfo.whyVolunteer}
                    onChange={(e) => handleInputChange('additionalInfo.whyVolunteer', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Skills and Experience:</label>
                  <textarea
                    value={updateRequestData.additionalInfo.skillsExperience}
                    onChange={(e) => handleInputChange('additionalInfo.skillsExperience', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUpdateForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateRequest} className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {isAnnouncementModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Announcements</h2>
              <button 
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {announcements.length === 0 ? (
                <p>No announcements available</p>
              ) : (
                <div className="announcements-list">
                  {announcements.map(announcement => (
                    <div key={announcement._id} className="announcement-item">
                      <div className="announcement-header">
                        <h3>{announcement.title}</h3>
                        <span className="announcement-date">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="announcement-content">
                        <p>{announcement.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonHelplineVolunteerDashboard;