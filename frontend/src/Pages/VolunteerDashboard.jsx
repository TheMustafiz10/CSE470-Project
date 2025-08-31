
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./CSS/VolunteerDashboard.css";

// const VolunteerDashboard = () => {
//   // Profile states
//   const [volunteer, setVolunteer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editing, setEditing] = useState(false);
//   const [updateData, setUpdateData] = useState({});
//   const [profileImage, setProfileImage] = useState(null);
  
//   // Call management states
//   const [acceptedCalls, setAcceptedCalls] = useState([]);
//   const [rejectedCalls, setRejectedCalls] = useState([]);
//   const [incomingCalls, setIncomingCalls] = useState([]);
//   const [currentCall, setCurrentCall] = useState(null);
  
//   // Announcements states
//   const [announcements, setAnnouncements] = useState([]);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  
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
//     availability: {
//       days: [],
//       times: []
//     },
//     additionalInfo: {
//       whyVolunteer: '',
//       skillsExperience: ''
//     }
//   });
  
//   // Statistics states
//   const [callStats, setCallStats] = useState({
//     totalAccepted: 0,
//     totalRejected: 0,
//     midnightCalls: 0,
//     acceptedPercentage: 0,
//     rejectedPercentage: 0
//   });
  
//   // Filter states
//   const [searchAccepted, setSearchAccepted] = useState('');
//   const [searchRejected, setSearchRejected] = useState('');
//   const [rejectionReasonFilter, setRejectionReasonFilter] = useState('all');
  
//   const callTimerRef = useRef(null);
//   const refreshInterval = useRef(null);
//   const announcementCheck = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
//     if (!volunteerData._id) {
//       navigate('/volunteer-login');
//       return;
//     }

//     setVolunteer(volunteerData);
//     fetchVolunteerData(volunteerData._id);
//     setupRealTimeUpdates(volunteerData._id);

//     return () => {
//       if (refreshInterval.current) clearInterval(refreshInterval.current);
//       if (announcementCheck.current) clearInterval(announcementCheck.current);
//       if (callTimerRef.current) clearInterval(callTimerRef.current);
//     };
//   }, []);

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
//       const [profileRes, callsRes, requestsRes, announcementsRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/calls`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
//         axios.get('http://localhost:5000/api/announcements')
//       ]);

//       // Update profile data
//       if (profileRes.data.success) {
//         const updatedVolunteer = profileRes.data.volunteer;
//         setVolunteer(updatedVolunteer);
//         localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
//         // Update form data if volunteer data changed
//         setUpdateRequestData({
//           fullName: updatedVolunteer.fullName || '',
//           phone: updatedVolunteer.phone || '',
//           address: updatedVolunteer.address || {
//             street: '',
//             city: '',
//             state: '',
//             postalCode: ''
//           },
//           availability: updatedVolunteer.availability || {
//             days: [],
//             times: []
//           },
//           additionalInfo: updatedVolunteer.additionalInfo || {
//             whyVolunteer: '',
//             skillsExperience: ''
//           }
//         });
//       }

//       // Update calls data
//       if (callsRes.data.success) {
//         setAcceptedCalls(callsRes.data.acceptedCalls || []);
//         setRejectedCalls(callsRes.data.rejectedCalls || []);
//         calculateStats(callsRes.data.acceptedCalls || [], callsRes.data.rejectedCalls || []);
//       }

//       // Update requests data
//       if (requestsRes.data.success) {
//         setUpdateRequests(requestsRes.data.updateRequests || []);
//       }

//       // Update announcements
//       if (Array.isArray(announcementsRes.data)) {
//         setAnnouncements(announcementsRes.data);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching volunteer data:', error);
//       setError('Failed to fetch data');
//       setLoading(false);
//     }
//   };

//   const fetchAnnouncements = async (checkForNew = false) => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/announcements');
//       const newAnnouncements = Array.isArray(response.data) ? response.data : [];
      
//       if (checkForNew && announcements.length > 0 && newAnnouncements.length > announcements.length) {
//         setHasNewAnnouncement(true);
//         // Show notification
//         if (Notification.permission === 'granted') {
//           new Notification('New Announcement', {
//             body: 'A new announcement has been posted!',
//             icon: '/favicon.ico'
//           });
//         }
//       }
      
//       setAnnouncements(newAnnouncements);
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//     }
//   };

//   const fetchIncomingCalls = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/volunteers/incoming-calls');
//       if (response.data.success) {
//         setIncomingCalls(response.data.incomingCalls || []);
//       }
//     } catch (error) {
//       console.error('Error fetching incoming calls:', error);
//     }
//   };

//   const calculateStats = (accepted, rejected) => {
//     const totalCalls = accepted.length + rejected.length;
//     const midnightCalls = accepted.filter(call => {
//       const hour = new Date(call.startTime).getHours();
//       return hour >= 0 && hour < 8;
//     }).length;

//     setCallStats({
//       totalAccepted: accepted.length,
//       totalRejected: rejected.length,
//       midnightCalls,
//       acceptedPercentage: totalCalls > 0 ? ((accepted.length / totalCalls) * 100).toFixed(1) : 0,
//       rejectedPercentage: totalCalls > 0 ? ((rejected.length / totalCalls) * 100).toFixed(1) : 0
//     });
//   };

//   const handleUpdateRequest = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/volunteers/update-request', {
//         volunteerId: volunteer._id,
//         updatedData: updateRequestData,
//         requestedFields: Object.keys(updateRequestData),
//         reason: 'Profile update request'
//       });

//       if (response.data.success) {
//         alert('Update request submitted successfully! Please wait for admin approval.');
//         setIsUpdateModalOpen(false);
//         // Refresh update requests
//         fetchVolunteerData(volunteer._id);
//       }
//     } catch (error) {
//       console.error('Error submitting update request:', error);
//       alert('Failed to submit update request. Please try again.');
//     }
//   };

//   const handleAcceptCall = async (call) => {
//     if (currentCall) {
//       await handleRejectCall(call, 'busy');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:5000/api/volunteers/accept-call', {
//         callId: call._id,
//         volunteerId: volunteer._id
//       });

//       setCurrentCall({ ...call, startTime: new Date(), duration: '0h 0m 0s' });
      
//       callTimerRef.current = setInterval(() => {
//         setCurrentCall(prev => {
//           if (!prev) return null;
//           return { ...prev, duration: getDuration(prev.startTime) };
//         });
//       }, 1000);

//       fetchIncomingCalls();
//     } catch (error) {
//       console.error('Error accepting call:', error);
//       alert('Failed to accept call');
//     }
//   };

//   const handleRejectCall = async (call, reason = 'personal') => {
//     try {
//       await axios.post('http://localhost:5000/api/volunteers/reject-call', {
//         callId: call._id,
//         reason,
//         volunteerId: volunteer._id
//       });

//       fetchIncomingCalls();
//       fetchVolunteerData(volunteer._id);
//     } catch (error) {
//       console.error('Error rejecting call:', error);
//       alert('Failed to reject call');
//     }
//   };

//   const handleEndCall = async () => {
//     if (!currentCall) return;

//     clearInterval(callTimerRef.current);

//     try {
//       await axios.post('http://localhost:5000/api/volunteers/end-call', {
//         callId: currentCall._id,
//         duration: currentCall.duration,
//         endTime: new Date(),
//         volunteerId: volunteer._id
//       });

//       fetchVolunteerData(volunteer._id);
//       setCurrentCall(null);
//     } catch (error) {
//       console.error('Error ending call:', error);
//       alert('Failed to end call');
//     }
//   };

//   const getDuration = (startTime) => {
//     const diff = new Date() - new Date(startTime);
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   const handleInputChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('volunteer');
//     localStorage.removeItem('volunteerToken');
//     localStorage.removeItem('isLoggedIn');
//     navigate('/volunteer-login');
//   };

//   const requestNotificationPermission = () => {
//     if (Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   };

//   // Load incoming calls on component mount for helpline volunteers
//   useEffect(() => {
//     if (volunteer?.volunteerType === 'helpline') {
//       fetchIncomingCalls();
//       const incomingCallsInterval = setInterval(fetchIncomingCalls, 3000);
//       return () => clearInterval(incomingCallsInterval);
//     }
//   }, [volunteer]);

//   const filteredAccepted = acceptedCalls.filter(call => {
//     if (!searchAccepted) return true;
//     return call.date?.includes(searchAccepted);
//   });

//   const filteredRejected = rejectedCalls.filter(call => {
//     const dateMatch = !searchRejected || call.date?.includes(searchRejected);
//     const reasonMatch = rejectionReasonFilter === 'all' || call.rejectionReason === rejectionReasonFilter;
//     return dateMatch && reasonMatch;
//   });

//   if (loading) return <div className="dashboard-loading">Loading...</div>;
//   if (error) return <div className="dashboard-error">Error: {error}</div>;
//   if (!volunteer) return <div className="dashboard-error">No profile data found</div>;

//   return (
//     <div className="volunteer-dashboard">
//       <header className="dashboard-header">
//         <h1>Welcome, {volunteer.fullName}!</h1>
//         <div className="dashboard-actions">
//           <button onClick={() => setIsUpdateModalOpen(true)} className="update-btn">
//             Request Profile Update
//           </button>
//           <button onClick={handleLogout} className="logout-btn">Logout</button>
//           <button onClick={requestNotificationPermission} className="notification-btn">
//             Enable Notifications
//           </button>
//         </div>
//       </header>

//       {/* Profile Section */}
//       <div className="profile-section">
//         <div className="profile-info">
//           <h2>{volunteer.fullName}</h2>
//           <p><strong>Email:</strong> {volunteer.email}</p>
//           <p><strong>Phone:</strong> {volunteer.phone}</p>
//           <p><strong>Type:</strong> {volunteer.volunteerType}</p>
//           <p><strong>Status:</strong> <span className={`status-badge ${volunteer.status}`}>{volunteer.status}</span></p>
//         </div>
//       </div>

//       {/* Statistics Cards - Only for Helpline Volunteers */}
//       {volunteer.volunteerType === 'helpline' && (
//         <div className="stats-cards">
//           <div className="stat-card accepted">
//             <h3>Calls Accepted</h3>
//             <div className="stat-number">{callStats.totalAccepted}</div>
//           </div>
//           <div className="stat-card rejected">
//             <h3>Calls Rejected</h3>
//             <div className="stat-number">{callStats.totalRejected}</div>
//           </div>
//           <div className="stat-card midnight">
//             <h3>Midnight Calls</h3>
//             <div className="stat-number">{callStats.midnightCalls}</div>
//           </div>
//           <div className="stat-card percentage">
//             <h3>Success Rate</h3>
//             <div className="stat-percentage">
//               <span>{callStats.acceptedPercentage}% Accepted</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Announcements Section */}
//       <div className="dashboard-card">
//         <h2>
//           Announcements 
//           {hasNewAnnouncement && <span className="new-badge">NEW!</span>}
//         </h2>
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {announcements.map(announcement => (
//                 <tr key={announcement._id}>
//                   <td>{announcement.title}</td>
//                   <td>{announcement.date}</td>
//                   <td>{announcement.time}</td>
//                   <td>
//                     <button 
//                       className="btn btn-sm"
//                       onClick={() => {
//                         setSelectedAnnouncement(announcement);
//                         setHasNewAnnouncement(false);
//                       }}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Update Requests Status */}
//       <div className="dashboard-card">
//         <h2>Update Requests</h2>
//         {updateRequests.length === 0 ? (
//           <p>No pending update requests</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Request Date</th>
//                 <th>Status</th>
//                 <th>Fields</th>
//               </tr>
//             </thead>
//             <tbody>
//               {updateRequests.map(request => (
//                 <tr key={request._id}>
//                   <td>{new Date(request.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <span className={`status-badge ${request.status}`}>
//                       {request.status}
//                     </span>
//                   </td>
//                   <td>{request.requestedFields?.join(', ')}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Helpline Specific Features */}
//       {volunteer.volunteerType === 'helpline' && (
//         <>
//           {/* Current Call */}
//           {currentCall && (
//             <div className="current-call-section">
//               <h3>Current Call</h3>
//               <div className="current-call-info">
//                 <p><strong>Caller:</strong> {currentCall.userName}</p>
//                 <p><strong>Phone:</strong> {currentCall.userPhone}</p>
//                 <p><strong>Duration:</strong> {currentCall.duration}</p>
//                 <button onClick={handleEndCall} className="end-call-btn">End Call</button>
//               </div>
//             </div>
//           )}

//           {/* Incoming Calls */}
//           <div className="incoming-calls-section">
//             <h3>Incoming Calls</h3>
//             {incomingCalls.length === 0 ? (
//               <p>No incoming calls</p>
//             ) : (
//               <div className="incoming-calls-list">
//                 {incomingCalls.map(call => (
//                   <div key={call._id} className="incoming-call">
//                     <div className="call-info">
//                       <span><strong>{call.userName}</strong></span>
//                       <span>{call.userPhone}</span>
//                     </div>
//                     <div className="call-actions">
//                       <button onClick={() => handleAcceptCall(call)} className="accept-btn">
//                         Accept
//                       </button>
//                       <button onClick={() => handleRejectCall(call, 'personal')} className="reject-btn">
//                         Reject
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Call History Tables */}
//           <div className="calls-table-section">
//             <h3>Accepted Calls</h3>
//             <div className="table-filters">
//               <input
//                 type="date"
//                 value={searchAccepted}
//                 onChange={(e) => setSearchAccepted(e.target.value)}
//                 placeholder="Filter by date"
//               />
//             </div>
//             <table className="calls-table">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Duration</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAccepted.map(call => (
//                   <tr key={call._id || Math.random()}>
//                     <td>{call.user || call.userName}</td>
//                     <td>{call.date}</td>
//                     <td>{call.time}</td>
//                     <td>{call.duration}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {/* Update Request Modal */}
//       {isUpdateModalOpen && (
//         <div className="modal-overlay" onClick={() => setIsUpdateModalOpen(false)}>
//           <div className="modal-content update-modal" onClick={e => e.stopPropagation()}>
//             <h3>Request Profile Update</h3>
//             <div className="update-form">
//               <div className="form-group">
//                 <label>Full Name:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.fullName}
//                   onChange={e => handleInputChange('fullName', e.target.value)}
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Phone:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.phone}
//                   onChange={e => handleInputChange('phone', e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Street Address:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.address.street}
//                   onChange={e => handleInputChange('address.street', e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>City:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.address.city}
//                   onChange={e => handleInputChange('address.city', e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Skills & Experience:</label>
//                 <textarea
//                   value={updateRequestData.additionalInfo.skillsExperience}
//                   onChange={e => handleInputChange('additionalInfo.skillsExperience', e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="modal-actions">
//               <button onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
//               <button onClick={handleUpdateRequest} className="btn btn-primary">
//                 Submit Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Announcement Modal */}
//       {selectedAnnouncement && (
//         <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <h3>{selectedAnnouncement.title}</h3>
//             <p>{selectedAnnouncement.text}</p>
//             <p className="announcement-meta">
//               {selectedAnnouncement.date} at {selectedAnnouncement.time}
//             </p>
//             <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VolunteerDashboard;










import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import "./CSS/VolunteerDashboard.css";

const VolunteerDashboard = () => {
  // Profile states
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Call management states
  const [acceptedCalls, setAcceptedCalls] = useState([]);
  const [rejectedCalls, setRejectedCalls] = useState([]);
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  
  // REAL-TIME FEATURE: Announcements with live updates
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  
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
    availability: {
      days: [],
      times: []
    },
    additionalInfo: {
      whyVolunteer: '',
      skillsExperience: ''
    }
  });
  
  // Statistics states
  const [callStats, setCallStats] = useState({
    totalAccepted: 0,
    totalRejected: 0,
    midnightCalls: 0,
    acceptedPercentage: 0,
    rejectedPercentage: 0
  });
  
  // Filter states
  const [searchAccepted, setSearchAccepted] = useState('');
  const [searchRejected, setSearchRejected] = useState('');
  
  // REAL-TIME INTERVALS: References for cleanup
  const callTimerRef = useRef(null);
  const navigate = useNavigate();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  useEffect(() => {
    const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
    if (!volunteerData._id) {
      navigate('/volunteer-login');
      return;
    }

    // REAL-TIME REDIRECT: Check volunteer type for proper dashboard
    if (volunteerData.volunteerType === 'non-helpline') {
      navigate('/non-helpline-dashboard');
      return;
    }

    setVolunteer(volunteerData);
    fetchVolunteerData(volunteerData._id);
    const socket = setupRealTimeUpdates(volunteerData._id);

    return () => {
      socket.disconnect();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [navigate]);

  // REAL-TIME SETUP: Configure Socket.IO updates
  const setupRealTimeUpdates = (volunteerId) => {
    const socket = io('http://localhost:5000', {
      transports: ["websocket"],
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    socket.emit('joinVolunteerRoom');
    socket.emit('joinCallRoom');
    socket.emit('joinAnnouncementRoom');
    socket.emit('joinUpdateRequestRoom');

    // Real-time listeners
    socket.on('volunteerUpdated', (updatedVolunteer) => {
      if (updatedVolunteer._id === volunteerId) {
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
      }
    });

    socket.on('newCall', (call) => {
      if (call.volunteerId === volunteerId) {
        if (['accepted', 'completed'].includes(call.status)) {
          setAcceptedCalls((prev) => {
            if (!prev.some((c) => c._id === call._id)) {
              return [...prev, call];
            }
            return prev;
          });
        } else if (call.status === 'rejected') {
          setRejectedCalls((prev) => {
            if (!prev.some((c) => c._id === call._id)) {
              return [...prev, call];
            }
            return prev;
          });
        }
        calculateStats([...acceptedCalls, call], rejectedCalls);
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

    return socket;
  };

  // REAL-TIME DATA FETCHING: Initial fetch only
  const fetchVolunteerData = async (volunteerId) => {
    try {
      const [profileRes, callsRes, requestsRes, announcementsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/calls`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
        axios.get('http://localhost:5000/api/announcements')
      ]);

      // REAL-TIME UPDATE: Update profile data
      if (profileRes.data.success) {
        const updatedVolunteer = profileRes.data.data;
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
        // Update form data if volunteer data changed
        setUpdateRequestData({
          fullName: updatedVolunteer.fullName || '',
          phone: updatedVolunteer.phone || '',
          address: updatedVolunteer.address || {
            street: '',
            city: '',
            state: '',
            postalCode: ''
          },
          availability: updatedVolunteer.availability || {
            days: [],
            times: []
          },
          additionalInfo: updatedVolunteer.additionalInfo || {
            whyVolunteer: '',
            skillsExperience: ''
          }
        });
      }

      // REAL-TIME UPDATE: Update calls data
      if (callsRes.data.success) {
        setAcceptedCalls(callsRes.data.acceptedCalls || []);
        setRejectedCalls(callsRes.data.rejectedCalls || []);
        calculateStats(callsRes.data.acceptedCalls || [], callsRes.data.rejectedCalls || []);
      }

      // REAL-TIME UPDATE: Update requests data
      if (requestsRes.data.success) {
        setUpdateRequests(requestsRes.data.data || []);
      }

      // REAL-TIME UPDATE: Update announcements
      if (announcementsRes.data.success) {
        setAnnouncements(announcementsRes.data.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const calculateStats = (accepted, rejected) => {
    const totalCalls = accepted.length + rejected.length;
    const midnightCalls = accepted.filter(call => {
      const hour = new Date(call.startTime || call.createdAt).getHours();
      return hour >= 0 && hour < 8;
    }).length;

    setCallStats({
      totalAccepted: accepted.length,
      totalRejected: rejected.length,
      midnightCalls,
      acceptedPercentage: totalCalls > 0 ? ((accepted.length / totalCalls) * 100).toFixed(1) : 0,
      rejectedPercentage: totalCalls > 0 ? ((rejected.length / totalCalls) * 100).toFixed(1) : 0
    });
  };

  // REAL-TIME UPDATE REQUEST: Submit update request with immediate feedback
  const handleUpdateRequest = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/volunteers/${volunteer._id}/update-request`, updateRequestData);

      if (response.data.success) {
        alert('Update request submitted successfully! Please wait for admin approval.');
        setIsUpdateModalOpen(false);
        // REAL-TIME REFRESH: Get updated requests
        fetchVolunteerData(volunteer._id);
      }
    } catch (error) {
      console.error('Error submitting update request:', error);
      alert('Failed to submit update request. Please try again.');
    }
  };

  // REAL-TIME DELETE: Delete update request with immediate removal
  const handleDeleteUpdateRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/volunteers/${volunteer._id}/update-requests/${requestId}`);
      
      if (response.data.success) {
        // REAL-TIME UPDATE: Remove from state immediately
        setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Update request deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting update request:', error);
      alert('Error deleting update request');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUpdateRequestData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUpdateRequestData(prev => ({
        ...prev,
        [field]: value
      }));
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

  const handleLogout = () => {
    localStorage.removeItem('volunteer');
    localStorage.removeItem('volunteerToken');
    localStorage.removeItem('isLoggedIn');
    navigate('/volunteer-login');
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Filter functions
  const filteredAccepted = acceptedCalls.filter(call => {
    if (!searchAccepted) return true;
    const searchLower = searchAccepted.toLowerCase();
    return call.date?.toLowerCase().includes(searchLower) || 
           call.userName?.toLowerCase().includes(searchLower) ||
           call.user?.toLowerCase().includes(searchLower);
  });

  const filteredRejected = rejectedCalls.filter(call => {
    if (!searchRejected) return true;
    const searchLower = searchRejected.toLowerCase();
    return call.date?.toLowerCase().includes(searchLower) || 
           call.userName?.toLowerCase().includes(searchLower) ||
           call.user?.toLowerCase().includes(searchLower) ||
           call.rejectionReason?.toLowerCase().includes(searchLower);
  });

  if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!volunteer) return <div className="dashboard-error">No profile data found</div>;

  return (
    <div className="volunteer-dashboard">
      {/* REAL-TIME HEADER: Shows live status */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {volunteer.fullName}! (Helpline Volunteer)</h1>
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
            <button onClick={() => setIsUpdateModalOpen(true)} className="update-btn">
              Request Profile Update
            </button>
            <button onClick={requestNotificationPermission} className="enable-notifications-btn">
              Enable Notifications
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* REAL-TIME PROFILE SECTION */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Profile Information (Live Updates)</h2>
        </div>
        <div className="profile-info">
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{volunteer.fullName}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{volunteer.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span className="value">{volunteer.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Type:</span>
            <span className="value">Helpline Volunteer</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`status-badge ${volunteer.status}`}>
              {volunteer.status}
            </span>
          </div>
          {volunteer.lastLogin && (
            <div className="info-row">
              <span className="label">Last Login:</span>
              <span className="value">{new Date(volunteer.lastLogin).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* REAL-TIME STATISTICS CARDS */}
      <div className="stats-cards">
        <div className="stat-card accepted">
          <h3>Calls Accepted</h3>
          <div className="stat-number">{callStats.totalAccepted}</div>
        </div>
        <div className="stat-card rejected">
          <h3>Calls Rejected</h3>
          <div className="stat-number">{callStats.totalRejected}</div>
        </div>
        <div className="stat-card midnight">
          <h3>Midnight Calls</h3>
          <div className="stat-number">{callStats.midnightCalls}</div>
        </div>
        <div className="stat-card percentage">
          <h3>Success Rate</h3>
          <div className="stat-percentage">
            <span>{callStats.acceptedPercentage}% Accepted</span>
          </div>
        </div>
      </div>

      {/* REAL-TIME UPDATE REQUESTS SECTION */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Update Requests (Live Status)</h2>
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
                    <div className="request-fields">
                      Fields: {request.requestedFields?.join(', ') || 'Multiple fields'}
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

      {/* REAL-TIME CALL HISTORY TABLES */}
      <div className="calls-table-section">
        <h3>Accepted Calls (Live Updates)</h3>
        <div className="table-filters">
          <input
            type="text"
            value={searchAccepted}
            onChange={(e) => setSearchAccepted(e.target.value)}
            placeholder="Search calls..."
          />
        </div>
        <table className="calls-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>De-escalated</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccepted.length === 0 ? (
              <tr><td colSpan="6">No accepted calls found</td></tr>
            ) : (
              filteredAccepted.map(call => (
                <tr key={call._id || Math.random()}>
                  <td>{call.userName || call.user || 'Unknown'}</td>
                  <td>{call.userPhone || 'N/A'}</td>
                  <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
                  <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
                  <td>{call.duration || 'N/A'}</td>
                  <td>{call.deEscalated ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="calls-table-section">
        <h3>Rejected Calls (Live Updates)</h3>
        <div className="table-filters">
          <input
            type="text"
            value={searchRejected}
            onChange={(e) => setSearchRejected(e.target.value)}
            placeholder="Search calls..."
          />
        </div>
        <table className="calls-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredRejected.length === 0 ? (
              <tr><td colSpan="5">No rejected calls found</td></tr>
            ) : (
              filteredRejected.map(call => (
                <tr key={call._id || Math.random()}>
                  <td>{call.userName || call.user || 'Unknown'}</td>
                  <td>{call.userPhone || 'N/A'}</td>
                  <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
                  <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
                  <td>{call.rejectionReason || call.reason || 'No reason provided'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REAL-TIME UPDATE REQUEST MODAL */}
      {isUpdateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>Request Profile Update</h2>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
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
              <button onClick={() => setIsUpdateModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateRequest} className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME ANNOUNCEMENTS MODAL */}
      {isAnnouncementModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Announcements (Live Updates)</h2>
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

      {/* INDIVIDUAL ANNOUNCEMENT MODAL */}
      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedAnnouncement.title}</h3>
            <p>{selectedAnnouncement.content}</p>
            <p className="announcement-meta">
              Created: {new Date(selectedAnnouncement.createdAt).toLocaleString()}
            </p>
            <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;











// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./CSS/VolunteerDashboard.css";

// const VolunteerDashboard = () => {
//   // Profile states
//   const [volunteer, setVolunteer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Call management states
//   const [acceptedCalls, setAcceptedCalls] = useState([]);
//   const [rejectedCalls, setRejectedCalls] = useState([]);
//   const [incomingCalls, setIncomingCalls] = useState([]);
//   const [currentCall, setCurrentCall] = useState(null);
  
//   // REAL-TIME FEATURE: Announcements with live updates
//   const [announcements, setAnnouncements] = useState([]);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
//   const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
//   const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  
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
//     availability: {
//       days: [],
//       times: []
//     },
//     additionalInfo: {
//       whyVolunteer: '',
//       skillsExperience: ''
//     }
//   });
  
//   // Statistics states
//   const [callStats, setCallStats] = useState({
//     totalAccepted: 0,
//     totalRejected: 0,
//     midnightCalls: 0,
//     acceptedPercentage: 0,
//     rejectedPercentage: 0
//   });
  
//   // Filter states
//   const [searchAccepted, setSearchAccepted] = useState('');
//   const [searchRejected, setSearchRejected] = useState('');
  
//   // REAL-TIME INTERVALS: References for cleanup
//   const callTimerRef = useRef(null);
//   const refreshInterval = useRef(null);
//   const announcementCheck = useRef(null);
//   const navigate = useNavigate();

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

//   useEffect(() => {
//     const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
//     if (!volunteerData._id) {
//       navigate('/volunteer-login');
//       return;
//     }

//     // REAL-TIME REDIRECT: Check volunteer type for proper dashboard
//     if (volunteerData.volunteerType === 'non-helpline') {
//       navigate('/non-helpline-dashboard');
//       return;
//     }

//     setVolunteer(volunteerData);
//     fetchVolunteerData(volunteerData._id);
//     setupRealTimeUpdates(volunteerData._id);

//     return () => {
//       if (refreshInterval.current) clearInterval(refreshInterval.current);
//       if (announcementCheck.current) clearInterval(announcementCheck.current);
//       if (callTimerRef.current) clearInterval(callTimerRef.current);
//     };
//   }, [navigate]);

//   // REAL-TIME SETUP: Configure automatic updates
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

//   // REAL-TIME DATA FETCHING: Always get fresh data
//   const fetchVolunteerData = async (volunteerId) => {
//     try {
//       const [profileRes, callsRes, requestsRes, announcementsRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/calls`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
//         axios.get('http://localhost:5000/api/announcements')
//       ]);

//       // REAL-TIME UPDATE: Update profile data
//       if (profileRes.data.success) {
//         const updatedVolunteer = profileRes.data.data;
//         setVolunteer(updatedVolunteer);
//         localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
//         // Update form data if volunteer data changed
//         setUpdateRequestData({
//           fullName: updatedVolunteer.fullName || '',
//           phone: updatedVolunteer.phone || '',
//           address: updatedVolunteer.address || {
//             street: '',
//             city: '',
//             state: '',
//             postalCode: ''
//           },
//           availability: updatedVolunteer.availability || {
//             days: [],
//             times: []
//           },
//           additionalInfo: updatedVolunteer.additionalInfo || {
//             whyVolunteer: '',
//             skillsExperience: ''
//           }
//         });
//       }

//       // REAL-TIME UPDATE: Update calls data
//       if (callsRes.data.success) {
//         setAcceptedCalls(callsRes.data.acceptedCalls || []);
//         setRejectedCalls(callsRes.data.rejectedCalls || []);
//         calculateStats(callsRes.data.acceptedCalls || [], callsRes.data.rejectedCalls || []);
//       }

//       // REAL-TIME UPDATE: Update requests data
//       if (requestsRes.data.success) {
//         setUpdateRequests(requestsRes.data.data || []);
//       }

//       // REAL-TIME UPDATE: Update announcements
//       if (announcementsRes.data.success) {
//         setAnnouncements(announcementsRes.data.data || []);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching volunteer data:', error);
//       setError('Failed to fetch data');
//       setLoading(false);
//     }
//   };

//   // REAL-TIME ANNOUNCEMENTS: Check for new announcements with notifications
//   const fetchAnnouncements = async (checkForNew = false) => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/announcements');
      
//       if (response.data.success) {
//         const newAnnouncements = response.data.data || [];
        
//         if (checkForNew && announcements.length > 0) {
//           const latestNew = new Date(Math.max(...newAnnouncements.map(a => new Date(a.createdAt))));
//           if (latestNew > lastAnnouncementCheck) {
//             setHasNewAnnouncement(true);
//             setLastAnnouncementCheck(new Date());
            
//             // REAL-TIME NOTIFICATION: Show browser notification
//             if (Notification.permission === 'granted') {
//               new Notification('New Announcement', {
//                 body: 'A new announcement has been posted!',
//                 icon: '/favicon.ico'
//               });
//             }
//           }
//         }
        
//         setAnnouncements(newAnnouncements);
//       }
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//     }
//   };

//   const calculateStats = (accepted, rejected) => {
//     const totalCalls = accepted.length + rejected.length;
//     const midnightCalls = accepted.filter(call => {
//       const hour = new Date(call.startTime || call.createdAt).getHours();
//       return hour >= 0 && hour < 8;
//     }).length;

//     setCallStats({
//       totalAccepted: accepted.length,
//       totalRejected: rejected.length,
//       midnightCalls,
//       acceptedPercentage: totalCalls > 0 ? ((accepted.length / totalCalls) * 100).toFixed(1) : 0,
//       rejectedPercentage: totalCalls > 0 ? ((rejected.length / totalCalls) * 100).toFixed(1) : 0
//     });
//   };

//   // REAL-TIME UPDATE REQUEST: Submit update request with immediate feedback
//   const handleUpdateRequest = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/volunteers/${volunteer._id}/update-request`, updateRequestData);

//       if (response.data.success) {
//         alert('Update request submitted successfully! Please wait for admin approval.');
//         setIsUpdateModalOpen(false);
//         // REAL-TIME REFRESH: Get updated requests
//         fetchVolunteerData(volunteer._id);
//       }
//     } catch (error) {
//       console.error('Error submitting update request:', error);
//       alert('Failed to submit update request. Please try again.');
//     }
//   };

//   // REAL-TIME DELETE: Delete update request with immediate removal
//   const handleDeleteUpdateRequest = async (requestId) => {
//     if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/volunteers/${volunteer._id}/update-requests/${requestId}`);
      
//       if (response.data.success) {
//         // REAL-TIME UPDATE: Remove from state immediately
//         setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
//         alert('Update request deleted successfully!');
//       }
//     } catch (error) {
//       console.error('Error deleting update request:', error);
//       alert('Error deleting update request');
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [field]: value
//       }));
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

//   const handleLogout = () => {
//     localStorage.removeItem('volunteer');
//     localStorage.removeItem('volunteerToken');
//     localStorage.removeItem('isLoggedIn');
//     navigate('/volunteer-login');
//   };

//   const requestNotificationPermission = () => {
//     if (Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   };

//   // Filter functions
//   const filteredAccepted = acceptedCalls.filter(call => {
//     if (!searchAccepted) return true;
//     const searchLower = searchAccepted.toLowerCase();
//     return call.date?.toLowerCase().includes(searchLower) || 
//            call.userName?.toLowerCase().includes(searchLower) ||
//            call.user?.toLowerCase().includes(searchLower);
//   });

//   const filteredRejected = rejectedCalls.filter(call => {
//     if (!searchRejected) return true;
//     const searchLower = searchRejected.toLowerCase();
//     return call.date?.toLowerCase().includes(searchLower) || 
//            call.userName?.toLowerCase().includes(searchLower) ||
//            call.user?.toLowerCase().includes(searchLower) ||
//            call.rejectionReason?.toLowerCase().includes(searchLower);
//   });

//   if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;
//   if (error) return <div className="dashboard-error">Error: {error}</div>;
//   if (!volunteer) return <div className="dashboard-error">No profile data found</div>;

//   return (
//     <div className="volunteer-dashboard">
//       {/* REAL-TIME HEADER: Shows live status */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <h1>Welcome, {volunteer.fullName}! (Helpline Volunteer)</h1>
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
//             <button onClick={() => setIsUpdateModalOpen(true)} className="update-btn">
//               Request Profile Update
//             </button>
//             <button onClick={requestNotificationPermission} className="enable-notifications-btn">
//               Enable Notifications
//             </button>
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//           </div>
//         </div>
//       </header>

//       {/* REAL-TIME PROFILE SECTION */}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Profile Information (Live Updates)</h2>
//         </div>
//         <div className="profile-info">
//           <div className="info-row">
//             <span className="label">Name:</span>
//             <span className="value">{volunteer.fullName}</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Email:</span>
//             <span className="value">{volunteer.email}</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Phone:</span>
//             <span className="value">{volunteer.phone}</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Type:</span>
//             <span className="value">Helpline Volunteer</span>
//           </div>
//           <div className="info-row">
//             <span className="label">Status:</span>
//             <span className={`status-badge ${volunteer.status}`}>
//               {volunteer.status}
//             </span>
//           </div>
//           {volunteer.lastLogin && (
//             <div className="info-row">
//               <span className="label">Last Login:</span>
//               <span className="value">{new Date(volunteer.lastLogin).toLocaleString()}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* REAL-TIME STATISTICS CARDS */}
//       <div className="stats-cards">
//         <div className="stat-card accepted">
//           <h3>Calls Accepted</h3>
//           <div className="stat-number">{callStats.totalAccepted}</div>
//         </div>
//         <div className="stat-card rejected">
//           <h3>Calls Rejected</h3>
//           <div className="stat-number">{callStats.totalRejected}</div>
//         </div>
//         <div className="stat-card midnight">
//           <h3>Midnight Calls</h3>
//           <div className="stat-number">{callStats.midnightCalls}</div>
//         </div>
//         <div className="stat-card percentage">
//           <h3>Success Rate</h3>
//           <div className="stat-percentage">
//             <span>{callStats.acceptedPercentage}% Accepted</span>
//           </div>
//         </div>
//       </div>

//       {/* REAL-TIME UPDATE REQUESTS SECTION */}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Update Requests (Live Status)</h2>
//         </div>
//         <div className="update-requests">
//           {updateRequests.length === 0 ? (
//             <p>No pending update requests</p>
//           ) : (
//             <div className="requests-table">
//               {updateRequests.map(request => (
//                 <div key={request._id} className="request-item">
//                   <div className="request-info">
//                     <div className="request-status">
//                       Status: <span className={`status ${request.status}`}>{request.status}</span>
//                     </div>
//                     <div className="request-date">
//                       Submitted: {new Date(request.createdAt).toLocaleDateString()}
//                     </div>
//                     <div className="request-fields">
//                       Fields: {request.requestedFields?.join(', ') || 'Multiple fields'}
//                     </div>
//                     {request.adminResponse && (
//                       <div className="admin-response">
//                         Admin Response: {request.adminResponse}
//                       </div>
//                     )}
//                   </div>
//                   <button 
//                     onClick={() => handleDeleteUpdateRequest(request._id)}
//                     className="btn btn-danger btn-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* REAL-TIME CALL HISTORY TABLES */}
//       <div className="calls-table-section">
//         <h3>Accepted Calls (Live Updates)</h3>
//         <div className="table-filters">
//           <input
//             type="text"
//             value={searchAccepted}
//             onChange={(e) => setSearchAccepted(e.target.value)}
//             placeholder="Search calls..."
//           />
//         </div>
//         <table className="calls-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Phone</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Duration</th>
//               <th>De-escalated</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAccepted.length === 0 ? (
//               <tr><td colSpan="6">No accepted calls found</td></tr>
//             ) : (
//               filteredAccepted.map(call => (
//                 <tr key={call._id || Math.random()}>
//                   <td>{call.userName || call.user || 'Unknown'}</td>
//                   <td>{call.userPhone || 'N/A'}</td>
//                   <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
//                   <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
//                   <td>{call.duration || 'N/A'}</td>
//                   <td>{call.deEscalated ? 'Yes' : 'No'}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="calls-table-section">
//         <h3>Rejected Calls (Live Updates)</h3>
//         <div className="table-filters">
//           <input
//             type="text"
//             value={searchRejected}
//             onChange={(e) => setSearchRejected(e.target.value)}
//             placeholder="Search calls..."
//           />
//         </div>
//         <table className="calls-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Phone</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Rejection Reason</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRejected.length === 0 ? (
//               <tr><td colSpan="5">No rejected calls found</td></tr>
//             ) : (
//               filteredRejected.map(call => (
//                 <tr key={call._id || Math.random()}>
//                   <td>{call.userName || call.user || 'Unknown'}</td>
//                   <td>{call.userPhone || 'N/A'}</td>
//                   <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
//                   <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
//                   <td>{call.rejectionReason || call.reason || 'No reason provided'}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* REAL-TIME UPDATE REQUEST MODAL */}
//       {isUpdateModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content large-modal">
//             <div className="modal-header">
//               <h2>Request Profile Update</h2>
//               <button 
//                 onClick={() => setIsUpdateModalOpen(false)}
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
//               <button onClick={() => setIsUpdateModalOpen(false)} className="btn btn-secondary">
//                 Cancel
//               </button>
//               <button onClick={handleUpdateRequest} className="btn btn-primary">
//                 Submit Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* REAL-TIME ANNOUNCEMENTS MODAL */}
//       {isAnnouncementModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Announcements (Live Updates)</h2>
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

//       {/* INDIVIDUAL ANNOUNCEMENT MODAL */}
//       {selectedAnnouncement && (
//         <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <h3>{selectedAnnouncement.title}</h3>
//             <p>{selectedAnnouncement.content}</p>
//             <p className="announcement-meta">
//               Created: {new Date(selectedAnnouncement.createdAt).toLocaleString()}
//             </p>
//             <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VolunteerDashboard;










// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./CSS/VolunteerDashboard.css";


// const VolunteerDashboard = () => {
//   // Profile states
//   const [volunteer, setVolunteer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editing, setEditing] = useState(false);
//   const [updateData, setUpdateData] = useState({});
//   const [profileImage, setProfileImage] = useState(null);
  
//   // Call management states
//   const [acceptedCalls, setAcceptedCalls] = useState([]);
//   const [rejectedCalls, setRejectedCalls] = useState([]);
//   const [incomingCalls, setIncomingCalls] = useState([]);
//   const [currentCall, setCurrentCall] = useState(null);
  
//   // Statistics states
//   const [callStats, setCallStats] = useState({
//     totalAccepted: 0,
//     totalRejected: 0,
//     midnightCalls: 0,
//     acceptedPercentage: 0,
//     rejectedPercentage: 0
//   });
  
//   // Filter states
//   const [searchAccepted, setSearchAccepted] = useState('');
//   const [searchRejected, setSearchRejected] = useState('');
//   const [rejectionReasonFilter, setRejectionReasonFilter] = useState('all');
  
//   const callTimerRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//     fetchCalls();
//     fetchIncomingCalls();
    
//     // Set up polling for incoming calls
//     const interval = setInterval(fetchIncomingCalls, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     calculateStats();
//   }, [acceptedCalls, rejectedCalls]);




//   const fetchProfile = async () => {
//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       if (!token) {
//         navigate('/volunteer-login');
//         return;
//       }

//       const response = await fetch('http://localhost:5000/api/volunteers/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       console.log("Profile data:", data);

//       if (response.ok && data.success) {
//         setVolunteer(data.volunteer);
//         setUpdateData(data.volunteer);
//         setProfileImage(data.volunteer.profileImage);
//       } 
//       // if (data.volunteer) {
//       //   setVolunteer(data.volunteer);
//       //   setUpdateData(data.volunteer);
//       //   setProfileImage(data.volunteer.profileImage);
//       // }
      
//       else {
//         setError(data.message || 'Failed to fetch profile');
//         if (response.status === 401) {
//           localStorage.removeItem('volunteerToken');
//           navigate('/volunteer-login');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       setError('Network error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };



//   const fetchCalls = async () => {
//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       const response = await axios.get('http://localhost:5000/api/volunteers/calls', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setAcceptedCalls(response.data.acceptedCalls || []);
//         setRejectedCalls(response.data.rejectedCalls || []);
//       }
//     } catch (error) {
//       console.error('Error fetching calls:', error);
//     }
//   };

//   const fetchIncomingCalls = async () => {
//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       const response = await axios.get('http://localhost:5000/api/volunteers/incoming-calls', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setIncomingCalls(response.data.incomingCalls || []);
//       }
//     } catch (error) {
//       console.error('Error fetching incoming calls:', error);
//     }
//   };

//   const calculateStats = () => {
//     const totalCalls = acceptedCalls.length + rejectedCalls.length;
//     const midnightCalls = acceptedCalls.filter(call => {
//       const hour = new Date(call.startTime).getHours();
//       return hour >= 0 && hour < 8;
//     }).length;

//     setCallStats({
//       totalAccepted: acceptedCalls.length,
//       totalRejected: rejectedCalls.length,
//       midnightCalls,
//       acceptedPercentage: totalCalls > 0 ? ((acceptedCalls.length / totalCalls) * 100).toFixed(1) : 0,
//       rejectedPercentage: totalCalls > 0 ? ((rejectedCalls.length / totalCalls) * 100).toFixed(1) : 0
//     });
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       const response = await fetch('http://localhost:5000/api/volunteers/profile', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updateData)
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setVolunteer(data.volunteer);
//         setEditing(false);
//         alert('Profile updated successfully!');
//       } else {
//         alert(data.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Network error occurred');
//     }
//   };

//   const handleProfileDelete = async () => {
//     if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       const response = await fetch('http://localhost:5000/api/volunteers/profile', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         localStorage.removeItem('volunteerToken');
//         localStorage.removeItem('volunteerInfo'); // Also remove volunteer info
//         alert('Profile deleted successfully!');
//         navigate('/volunteer-login');
//       } else {
//         const data = await response.json();
//         alert(data.message || 'Failed to delete profile');
//       }
//     } catch (error) {
//       console.error('Error deleting profile:', error);
//       alert('Network error occurred');
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('profileImage', file);

//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       const response = await axios.post('http://localhost:5000/api/volunteers/upload-image', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success) {
//         setProfileImage(response.data.imageUrl);
//         setVolunteer(prev => ({ ...prev, profileImage: response.data.imageUrl }));
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to upload image');
//     }
//   };

//   const handleAcceptCall = async (call) => {
//     if (currentCall) {
//       await handleRejectCall(call, 'busy');
//       return;
//     }

//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       await axios.post('http://localhost:5000/api/volunteers/accept-call', 
//         { callId: call._id },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       setCurrentCall({ ...call, startTime: new Date(), duration: '0h 0m 0s' });
      
//       callTimerRef.current = setInterval(() => {
//         setCurrentCall(prev => {
//           if (!prev) return null;
//           return { ...prev, duration: getDuration(prev.startTime) };
//         });
//       }, 1000);

//       fetchIncomingCalls();
//     } catch (error) {
//       console.error('Error accepting call:', error);
//       alert('Failed to accept call');
//     }
//   };

//   const handleRejectCall = async (call, reason = 'personal') => {
//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       await axios.post('http://localhost:5000/api/volunteers/reject-call', 
//         { callId: call._id, reason },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       fetchIncomingCalls();
//       fetchCalls();
//     } catch (error) {
//       console.error('Error rejecting call:', error);
//       alert('Failed to reject call');
//     }
//   };

//   const handleEndCall = async () => {
//     if (!currentCall) return;

//     clearInterval(callTimerRef.current);

//     try {
//       // Get token directly from localStorage
//       const token = localStorage.getItem('volunteerToken');

//       await axios.post('http://localhost:5000/api/volunteers/end-call', 
//         { 
//           callId: currentCall._id, 
//           duration: currentCall.duration,
//           endTime: new Date()
//         },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       fetchCalls();
//       setCurrentCall(null);
//     } catch (error) {
//       console.error('Error ending call:', error);
//       alert('Failed to end call');
//     }
//   };

//   const getDuration = (startTime) => {
//     const diff = new Date() - new Date(startTime);
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setUpdateData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setUpdateData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('volunteerToken');
//     localStorage.removeItem('volunteerInfo'); // Also remove volunteer info
//     navigate('/volunteer-login');
//   };

//   const filteredAccepted = acceptedCalls.filter(call => {
//     if (!searchAccepted) return true;
//     return new Date(call.date).toISOString().split('T')[0] === searchAccepted;
//   });

//   const filteredRejected = rejectedCalls.filter(call => {
//     const dateMatch = !searchRejected || new Date(call.date).toISOString().split('T')[0] === searchRejected;
//     const reasonMatch = rejectionReasonFilter === 'all' || call.rejectionReason === rejectionReasonFilter;
//     return dateMatch && reasonMatch;
//   });

//   if (loading) return <div className="dashboard-loading">Loading...</div>;
//   if (error) return <div className="dashboard-error">Error: {error}</div>;
//   if (!volunteer) return <div className="dashboard-error">No profile data found</div>;

//   return (
//     <div className="volunteer-dashboard">
//       <header className="dashboard-header">
//         <h1>Volunteer Dashboard</h1>
//         <div className="dashboard-actions">
//           <button onClick={() => setEditing(!editing)}>
//             {editing ? 'Cancel Edit' : 'Edit Profile'}
//           </button>
//           <button onClick={handleProfileDelete} className="delete-btn">Delete Profile</button>
//           <button onClick={handleLogout} className="logout-btn">Logout</button>
//         </div>
//       </header>

//       {/* Profile Section */}
//       <div className="profile-section">
//         <div className="profile-image-container">
//           <img 
//             src={profileImage || '/default-profile.png'} 
//             alt="Profile" 
//             className="profile-image"
//           />
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleImageUpload} 
//             className="image-upload-input"
//           />
//         </div>
        
//         <div className="profile-info">
//           <h2>{volunteer.fullName}</h2>
//           <p>{volunteer.email}</p>
//           <p>Status: <span className={`status ${volunteer.status}`}>{volunteer.status}</span></p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="stats-cards">
//         <div className="stat-card accepted">
//           <h3>Calls Accepted</h3>
//           <div className="stat-number">{callStats.totalAccepted}</div>
//         </div>
//         <div className="stat-card rejected">
//           <h3>Calls Rejected</h3>
//           <div className="stat-number">{callStats.totalRejected}</div>
//         </div>
//         <div className="stat-card midnight">
//           <h3>Midnight Calls (12AM-8AM)</h3>
//           <div className="stat-number">{callStats.midnightCalls}</div>
//         </div>
//         <div className="stat-card percentage">
//           <h3>Success Rate</h3>
//           <div className="stat-percentage">
//             <span className="accepted-percentage">{callStats.acceptedPercentage}% Accepted</span>
//             <span className="rejected-percentage">{callStats.rejectedPercentage}% Rejected</span>
//           </div>
//         </div>
//       </div>

//       {/* Current Call */}
//       {currentCall && (
//         <div className="current-call-section">
//           <h3>Current Call</h3>
//           <div className="current-call-info">
//             <p><strong>Caller:</strong> {currentCall.userName}</p>
//             <p><strong>Phone:</strong> {currentCall.userPhone}</p>
//             <p><strong>Started:</strong> {new Date(currentCall.startTime).toLocaleTimeString()}</p>
//             <p><strong>Duration:</strong> {currentCall.duration}</p>
//             <button onClick={handleEndCall} className="end-call-btn">End Call</button>
//           </div>
//         </div>
//       )}

//       {/* Incoming Calls */}
//       <div className="incoming-calls-section">
//         <h3>Incoming Calls</h3>
//         {currentCall ? (
//           <p className="busy-message">Currently busy in a call</p>
//         ) : incomingCalls.length === 0 ? (
//           <p>No incoming calls</p>
//         ) : (
//           <div className="incoming-calls-list">
//             {incomingCalls.map(call => (
//               <div key={call._id} className="incoming-call">
//                 <div className="call-info">
//                   <span><strong>{call.userName}</strong></span>
//                   <span>{call.userPhone}</span>
//                   <span>{new Date(call.timestamp).toLocaleString()}</span>
//                 </div>
//                 <div className="call-actions">
//                   <button onClick={() => handleAcceptCall(call)} className="accept-btn">Accept</button>
//                   <button onClick={() => handleRejectCall(call, 'personal')} className="reject-btn">Reject</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Profile Edit Form */}
//       {editing && (
//         <div className="edit-form-section">
//           <form onSubmit={handleProfileUpdate} className="edit-form">
//             <h2>Edit Profile</h2>
            
//             <section className="form-section">
//               <h3>Personal Information</h3>
//               <input
//                 name="fullName"
//                 placeholder="Full Name"
//                 value={updateData.fullName || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 value={updateData.email || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 name="phone"
//                 placeholder="Phone"
//                 value={updateData.phone || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 name="dob"
//                 type="date"
//                 value={updateData.dob ? updateData.dob.split('T')[0] : ''}
//                 onChange={handleInputChange}
//               />
//             </section>

//             <section className="form-section">
//               <h3>Address</h3>
//               <input
//                 name="address.street"
//                 placeholder="Street Address"
//                 value={updateData.address?.street || ''}
//                 onChange={handleInputChange}
//               />
//               <input
//                 name="address.city"
//                 placeholder="City"
//                 value={updateData.address?.city || ''}
//                 onChange={handleInputChange}
//               />
//               <input
//                 name="address.state"
//                 placeholder="State"
//                 value={updateData.address?.state || ''}
//                 onChange={handleInputChange}
//               />
//               <input
//                 name="address.postalCode"
//                 placeholder="Postal Code"
//                 value={updateData.address?.postalCode || ''}
//                 onChange={handleInputChange}
//               />
//             </section>

//             <button type="submit" className="save-btn">Save Changes</button>
//           </form>
//         </div>
//       )}

//       {/* Accepted Calls Table */}
//       <div className="calls-table-section">
//         <h3>Accepted Calls</h3>
//         <div className="table-filters">
//           <input
//             type="date"
//             value={searchAccepted}
//             onChange={(e) => setSearchAccepted(e.target.value)}
//             placeholder="Filter by date"
//           />
//         </div>
//         <div className="table-container">
//           <table className="calls-table">
//             <thead>
//               <tr>
//                 <th>User Name</th>
//                 <th>User Number</th>
//                 <th>Date</th>
//                 <th>Start Time</th>
//                 <th>End Time</th>
//                 <th>Duration</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAccepted.map(call => (
//                 <tr key={call._id}>
//                   <td>{call.userName}</td>
//                   <td>{call.userPhone}</td>
//                   <td>{new Date(call.date).toLocaleDateString()}</td>
//                   <td>{new Date(call.startTime).toLocaleTimeString()}</td>
//                   <td>{call.endTime ? new Date(call.endTime).toLocaleTimeString() : 'Ongoing'}</td>
//                   <td>{call.duration}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Rejected Calls Table */}
//       <div className="calls-table-section">
//         <h3>Rejected Calls</h3>
//         <div className="table-filters">
//           <input
//             type="date"
//             value={searchRejected}
//             onChange={(e) => setSearchRejected(e.target.value)}
//             placeholder="Filter by date"
//           />
//           <select 
//             value={rejectionReasonFilter} 
//             onChange={(e) => setRejectionReasonFilter(e.target.value)}
//           >
//             <option value="all">All Reasons</option>
//             <option value="busy">Busy with another call</option>
//             <option value="personal">Personal reason</option>
//           </select>
//         </div>
//         <div className="table-container">
//           <table className="calls-table">
//             <thead>
//               <tr>
//                 <th>User Name</th>
//                 <th>User Number</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Rejection Reason</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRejected.map(call => (
//                 <tr key={call._id}>
//                   <td>{call.userName}</td>
//                   <td>{call.userPhone}</td>
//                   <td>{new Date(call.date).toLocaleDateString()}</td>
//                   <td>{new Date(call.timestamp).toLocaleTimeString()}</td>
//                   <td>
//                     <span className={`reason ${call.rejectionReason}`}>
//                       {call.rejectionReason === 'busy' ? 'Busy with another call' : 'Personal reason'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

     
//     </div>
//   );
// };

// export default VolunteerDashboard;
