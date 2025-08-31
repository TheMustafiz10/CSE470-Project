
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./CSS/AdminDashboard.css";



const fixedTimeSlots = [
  "12:00 AM – 4:00 AM",
  "4:00 AM – 8:00 AM",
  "8:00 AM – 12:00 PM",
  "12:00 PM – 4:00 PM",
  "4:00 PM – 8:00 PM",
  "8:00 PM – 12:00 AM",
];

export default function AdminDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [acceptedCalls, setAcceptedCalls] = useState([]);
  const [rejectedCalls, setRejectedCalls] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", text: "" });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedSlotVolunteers, setSelectedSlotVolunteers] = useState({});
  const [acceptedCallFilter, setAcceptedCallFilter] = useState("");
  const [rejectedCallFilter, setRejectedCallFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState({
    volunteers: false,
    acceptedCalls: false,
    rejectedCalls: false,
    updateRequests: false,
    subscriptions: false,
    users: false,
    announcements: false,
    shiftAssignments: false,
  });

  // Initialize Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.emit("joinVolunteerRoom");
    socket.emit("joinCallRoom");
    socket.emit("joinAnnouncementRoom");
    socket.emit("joinUpdateRequestRoom");
    socket.emit("joinSubscriptionRoom");
    socket.emit("joinUserRoom");
    socket.emit("joinShiftAssignmentRoom");

    socket.on("newVolunteer", (volunteer) => {
      console.log("Received newVolunteer:", volunteer);
      setVolunteers((prev) => {
        if (!prev.some((v) => v._id === volunteer._id)) {
          return [...prev, volunteer];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("volunteerUpdated", (updatedVolunteer) => {
      console.log("Received volunteerUpdated:", updatedVolunteer);
      setVolunteers((prev) =>
        prev.map((v) => (v._id === updatedVolunteer._id ? updatedVolunteer : v))
      );
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("volunteerDeleted", (id) => {
      console.log("Received volunteerDeleted:", id);
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("newCall", (call) => {
      if (["accepted", "completed"].includes(call.status)) {
        setAcceptedCalls((prev) => {
          if (!prev.some((c) => c._id === call._id)) {
            return [...prev, call];
          }
          return prev;
        });
        setNotifications((prev) => ({ ...prev, acceptedCalls: true }));
      } else if (call.status === "rejected") {
        setRejectedCalls((prev) => {
          if (!prev.some((c) => c._id === call._id)) {
            return [...prev, call];
          }
          return prev;
        });
        setNotifications((prev) => ({ ...prev, rejectedCalls: true }));
      }
    });

    socket.on("newAnnouncement", (announcement) => {
      setAnnouncements((prev) => {
        if (!prev.some((a) => a._id === announcement._id)) {
          return [announcement, ...prev];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, announcements: true }));
    });

    socket.on("newUpdateRequest", (updateRequest) => {
      setUpdateRequests((prev) => {
        if (!prev.some((r) => r._id === updateRequest._id)) {
          return [...prev, updateRequest];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });

    socket.on("updateRequestApproved", (reqId) => {
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });

    socket.on("updateRequestRejected", (reqId) => {
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });

    socket.on("newSubscription", (subscription) => {
      setSubscriptions((prev) => {
        if (!prev.some((s) => s._id === subscription._id)) {
          return [...prev, subscription];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, subscriptions: true }));
    });

    socket.on("newUser", (user) => {
      setUsers((prev) => {
        if (!prev.some((u) => u._id === user._id)) {
          return [...prev, user];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, users: true }));
    });

    socket.on("newShiftAssignment", (assignment) => {
      setShiftAssignments((prev) => {
        if (!prev.some((a) => a._id === assignment._id)) {
          return [...prev, assignment];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, shiftAssignments: true }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          volRes,
          callRes,
          updateReqRes,
          subsRes,
          userRes,
          annRes,
          shiftRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/volunteers"),
          axios.get("http://localhost:5000/api/calls"),
          axios.get("http://localhost:5000/api/volunteers/update/requests"),
          axios.get("http://localhost:5000/api/subscriptions"),
          axios.get("http://localhost:5000/api/users"),
          axios.get("http://localhost:5000/api/announcements"),
          axios.get("http://localhost:5000/api/shift-assignments"),
        ]);

        console.log("Fetched volunteers:", volRes.data);
        setVolunteers(volRes.data.data || []);
        setAcceptedCalls(callRes.data.accepted || []);
        setRejectedCalls(callRes.data.rejected || []);
        setUpdateRequests(updateReqRes.data.data || []);
        setSubscriptions(subsRes.data || []);
        setUsers(userRes.data || []);
        setAnnouncements(annRes.data || []);
        setShiftAssignments(shiftRes.data || []);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        alert("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, []);

  // Clear notification for a specific section
  const clearNotification = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: false }));
  };

  // Create announcement
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.text) return;
    try {
      const res = await axios.post("http://localhost:5000/api/announcements", newAnnouncement);
      setNewAnnouncement({ title: "", text: "" });
      alert("Announcement created successfully!");
    } catch (err) {
      console.error("❌ Error creating announcement:", err.response?.data || err.message);
      alert(`Failed to create announcement: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  // Fixed approval actions with proper headers and admin authentication
  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/approve`, {}, {
        headers: {
          'Content-Type': 'application/json',
          // Add admin authentication if needed
        }
      });
      
      console.log("Approve response:", response.data);
      
      // Update local state immediately for better UX
      setVolunteers((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "approved", isApproved: true } : v))
      );
      
      alert("Volunteer approved successfully!");
    } catch (err) {
      console.error("❌ Error approving volunteer:", err.response?.data || err.message);
      alert(`Failed to approve volunteer: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/reject`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Reject response:", response.data);
      
      // Update local state immediately
      setVolunteers((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "rejected", isApproved: false } : v))
      );
      
      alert("Volunteer rejected successfully!");
    } catch (err) {
      console.error("❌ Error rejecting volunteer:", err.response?.data || err.message);
      alert(`Failed to reject volunteer: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) {
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/volunteers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Delete response:", response.data);
      
      // Update local state immediately
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
      
      // Emit socket event for real-time update
      if (socketRef.current) {
        socketRef.current.emit('volunteerDeleted', id);
      }
      
      alert("Volunteer deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting volunteer:", err.response?.data || err.message);
      alert(`Failed to delete volunteer: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  // Volunteer update request actions
  const handleUpdateApprove = async (reqId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/volunteers/update/approve/${reqId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      console.log("Update approve response:", response.data);
      alert("Update request approved successfully!");
    } catch (err) {
      console.error("❌ Error approving update request:", err.response?.data || err.message);
      alert(`Failed to approve update request: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleUpdateReject = async (reqId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/volunteers/update/reject/${reqId}`, {
        adminResponse: "Rejected by admin"
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      console.log("Update reject response:", response.data);
      alert("Update request rejected successfully!");
    } catch (err) {
      console.error("❌ Error rejecting update request:", err.response?.data || err.message);
      alert(`Failed to reject update request: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  // Shift assignment
  const assignShift = async (volunteerId, slot) => {
    if (!volunteerId) return;
    try {
      const res = await axios.post("http://localhost:5000/api/shift-assignments", {
        volunteerId,
        slot,
      });
      setShiftAssignments((prev) => {
        if (!prev.some((a) => a._id === res.data.assignment._id)) {
          return [...prev, res.data.assignment];
        }
        return prev;
      });
      setSelectedSlotVolunteers((prev) => ({ ...prev, [slot]: "" }));
      alert("Shift assigned successfully!");
    } catch (err) {
      console.error("❌ Error assigning shift:", err.response?.data || err.message);
      alert(`Failed to assign shift: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  // Filtering and stats
  const helplineVolunteers = useMemo(
    () => volunteers.filter((v) => v.volunteerType === "helpline" && v.status === "approved"),
    [volunteers]
  );
  const nonHelplineVolunteers = useMemo(
    () => volunteers.filter((v) => v.volunteerType === "non-helpline" && v.status === "approved"),
    [volunteers]
  );
  const approvalRequests = useMemo(
    () => volunteers.filter((v) => v.status === "pending"),
    [volunteers]
  );

  const totalActiveHelpline = helplineVolunteers.length;
  const totalActiveNonHelpline = nonHelplineVolunteers.length;
  const totalAnsweredCalls = acceptedCalls.length;
  const callsAfterMidnight = acceptedCalls.filter((call) => {
    const hour = parseInt(call.time.split(":")[0]);
    return hour >= 2 && hour <= 6;
  }).length;
  const totalRejectedCalls = rejectedCalls.length;
  const deEscalatedPercentage = Math.round(
    (acceptedCalls.filter((c) => c.deEscalated).length / (acceptedCalls.length || 1)) * 100
  );

  // Volunteer call stats
  const volunteerCallStats = useMemo(() => {
    const stats = {};
    volunteers.forEach((v) => (stats[v._id] = { accepted: 0, rejected: 0 }));
    acceptedCalls.forEach((c) => {
      const vol = volunteers.find((v) => v.fullName === c.user);
      if (vol) stats[vol._id].accepted += 1;
    });
    rejectedCalls.forEach((c) => {
      const vol = volunteers.find((v) => v.fullName === c.user);
      if (vol) stats[vol._id].rejected += 1;
    });
    return stats;
  }, [volunteers, acceptedCalls, rejectedCalls]);

  const enrichedHelplineVolunteers = helplineVolunteers.map((v) => ({
    ...v,
    acceptedCalls: volunteerCallStats[v._id]?.accepted || 0,
    rejectedCalls: volunteerCallStats[v._id]?.rejected || 0,
  }));

  const filteredAcceptedCalls = acceptedCalls.filter(
    (c) => !acceptedCallFilter || c.date === acceptedCallFilter
  );
  const filteredRejectedCalls = rejectedCalls.filter(
    (c) => !rejectedCallFilter || c.date === rejectedCallFilter
  );

  const filteredUsers = useMemo(() => {
    if (!ageFilter) return users;
    const age = parseInt(ageFilter);
    if (isNaN(age) || age < 8 || age > 120) return users;
    return users.filter((u) => u.age === age);
  }, [users, ageFilter]);

  // Render JSX
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="cards-container">
        <Card title="Active Helpline Volunteers" value={totalActiveHelpline} />
        <Card title="Active Non-Helpline Volunteers" value={totalActiveNonHelpline} />
        <Card title="Calls Answered (Helpline)" value={totalAnsweredCalls} />
        <Card title="Calls Answered After Midnight" value={callsAfterMidnight} />
        <Card title="Calls Rejected" value={totalRejectedCalls} />
        <Card title="De-escalated Successfully (%)" value={`${deEscalatedPercentage}%`} />
      </div>

      {/* Approval Requests */}
      <SectionHeader
        title="Approval Requests"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <Table
        title="Approval Requests"
        data={approvalRequests}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      {/* Volunteers Tables */}
      <SectionHeader
        title="Helpline Volunteers"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <SearchableVolunteerTable
        title="Helpline Volunteers"
        volunteers={enrichedHelplineVolunteers}
        showCallStats={true}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      <SectionHeader
        title="Non-Helpline Volunteers"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <SearchableVolunteerTable
        title="Non-Helpline Volunteers"
        volunteers={nonHelplineVolunteers}
        showCallStats={false}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      {/* Calls */}
      <SectionHeader
        title="Accepted Calls"
        notification={notifications.acceptedCalls}
        onClick={() => clearNotification("acceptedCalls")}
      />
      <CallTable
        title="Accepted Calls"
        data={filteredAcceptedCalls}
        filterDate={acceptedCallFilter}
        setFilterDate={setAcceptedCallFilter}
        volunteers={volunteers}
      />

      <SectionHeader
        title="Rejected Calls"
        notification={notifications.rejectedCalls}
        onClick={() => clearNotification("rejectedCalls")}
      />
      <CallTable
        title="Rejected Calls"
        data={filteredRejectedCalls}
        filterDate={rejectedCallFilter}
        setFilterDate={setRejectedCallFilter}
        volunteers={volunteers}
      />

      {/* Update Requests */}
      <SectionHeader
        title="Volunteer Update Requests"
        notification={notifications.updateRequests}
        onClick={() => clearNotification("updateRequests")}
      />
      <UpdateRequestTable
        requests={updateRequests}
        volunteers={volunteers}
        onApprove={handleUpdateApprove}
        onReject={handleUpdateReject}
        onView={setSelectedVolunteer}
      />

      {/* Newsletter Subscriptions */}
      <SectionHeader
        title="Newsletter Subscriptions"
        notification={notifications.subscriptions}
        onClick={() => clearNotification("subscriptions")}
      />
      <div className="table-section">
        <h2>Newsletter Subscriptions</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.email}</td>
                <td>
                  <span className={`status-badge ${sub.status}`}>{sub.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users */}
      <SectionHeader
        title="Users"
        notification={notifications.users}
        onClick={() => clearNotification("users")}
      />
      <div className="table-section">
        <h2>Users</h2>
        <div className="search-filters">
          <input
            type="number"
            placeholder="Enter age (8-120)"
            value={ageFilter}
            min="8"
            max="120"
            onChange={(e) => setAgeFilter(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shift Assignment Table */}
      <SectionHeader
        title="Shift Assignment (Helpline)"
        notification={notifications.shiftAssignments}
        onClick={() => clearNotification("shiftAssignments")}
      />
      <div className="table-section">
        <h2>Shift Assignment (Helpline)</h2>
        <table>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Time Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fixedTimeSlots.map((slot) => {
              const availableVols = helplineVolunteers.filter(
                (v) =>
                  v.availability.times.includes(slot) &&
                  !shiftAssignments.some((a) => a.slot === slot && a.volunteerId === v._id)
              );
              const selectedId = selectedSlotVolunteers[slot] || availableVols[0]?._id || "";

              return (
                <tr key={slot}>
                  <td>
                    <select
                      value={selectedId}
                      onChange={(e) =>
                        setSelectedSlotVolunteers((prev) => ({
                          ...prev,
                          [slot]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Volunteer</option>
                      {availableVols.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.fullName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{slot}</td>
                  <td>
                    <button onClick={() => assignShift(selectedId, slot)}>Assign</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h3>Current Assignments:</h3>
        <table>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Time Slot</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {shiftAssignments.map((s, idx) => {
              const vol = volunteers.find((v) => v._id === s.volunteerId);
              return (
                <tr key={idx}>
                  <td>{vol?.fullName}</td>
                  <td>{s.slot}</td>
                  <td>
                    <button onClick={() => vol && setSelectedVolunteer(vol)}>Info</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Announcements */}
      <SectionHeader
        title="Announcements"
        notification={notifications.announcements}
        onClick={() => clearNotification("announcements")}
      />
      <div className="table-section">
        <h2>Announcements</h2>
        <div className="announcement-form">
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Text"
            value={newAnnouncement.text}
            onChange={(e) =>
              setNewAnnouncement((prev) => ({ ...prev, text: e.target.value }))
            }
          />
          <button onClick={handleCreateAnnouncement}>Create</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a._id}>
                <td>{a.title}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>
                  <button onClick={() => setSelectedAnnouncement(a)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Volunteer Modal */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedVolunteer.fullName}'s Info</h3>
            <p>
              <strong>Email:</strong> {selectedVolunteer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedVolunteer.phone}
            </p>
            <p>
              <strong>Type:</strong> {selectedVolunteer.volunteerType}
            </p>
            <p>
              <strong>Address:</strong> {selectedVolunteer.address.street}, {selectedVolunteer.address.city},{" "}
              {selectedVolunteer.address.state}, {selectedVolunteer.address.postalCode}
            </p>
            <p>
              <strong>Availability Days:</strong>{" "}
              {selectedVolunteer.availability.days?.join(", ")}
            </p>
            <p>
              <strong>Availability Times:</strong>{" "}
              {selectedVolunteer.availability.times?.join(", ")}
            </p>
            <p>
              <strong>Interests:</strong> {selectedVolunteer.volunteerRoles?.join(", ")}
            </p>
            <p>
              <strong>Skills:</strong> {selectedVolunteer.additionalInfo.skillsExperience}
            </p>
            <p>
              <strong>Why Volunteer:</strong> {selectedVolunteer.additionalInfo.whyVolunteer}
            </p>
            <p>
              <strong>Status:</strong> {selectedVolunteer.status}
            </p>
            <button onClick={() => setSelectedVolunteer(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedAnnouncement.title}</h3>
            <p>{selectedAnnouncement.text}</p>
            <p>
              {selectedAnnouncement.date} {selectedAnnouncement.time}
            </p>
            <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// SectionHeader Component
function SectionHeader({ title, notification, onClick }) {
  return (
    <div className="section-header" onClick={onClick} style={{ cursor: "pointer" }}>
      <h2>
        {title} {notification && <span className="notification-dot" />}
      </h2>
    </div>
  );
}

// Card Component
const Card = ({ title, value }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

// Approval Requests Table
const Table = ({ title, data, onApprove, onReject, onView, onDelete }) => (
  <div className="table-section">
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((vol) => (
          <tr key={vol._id}>
            <td>{vol.fullName}</td>
            <td>{vol.email}</td>
            <td>{vol.phone}</td>
            <td>
              <span className={`status-badge ${vol.status}`}>{vol.status}</span>
            </td>
            <td>
              <button onClick={() => onView(vol)}>Info</button>
              {vol.status !== "approved" && (
                <button onClick={() => onApprove(vol._id)}>Approve</button>
              )}
              {vol.status !== "rejected" && (
                <button onClick={() => onReject(vol._id)}>Reject</button>
              )}
              <button onClick={() => onDelete(vol._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// SearchableVolunteerTable Component
const SearchableVolunteerTable = ({
  title,
  volunteers,
  onApprove,
  onReject,
  onDelete,
  onView,
  showCallStats,
}) => {
  const [searchName, setSearchName] = useState("");
  const [searchSlot, setSearchSlot] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchDays, setSearchDays] = useState([]);

  const categories = [
    "Event Support",
    "Fundraising",
    "Community Outreach",
    "Campus Ambassador",
    "Social Media & Digital Promotion",
    "Content Writing / Blogging",
    "Graphic Design / Creative Support",
    "Technical Support (e.g., IT, website)",
    "Translation / Language Support",
    "Photography / Videography",
    "Mentorship / Training",
    "Case Follow-up Coordinator",
    "Crisis Response Assistant",
    "Resource & Referral Assistant",
  ];

  const weekDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const handleDayChange = (day) => {
    setSearchDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const filteredVolunteers = useMemo(
    () =>
      volunteers.filter((v) => {
        const nameMatch = v.fullName.toLowerCase().includes(searchName.toLowerCase());
        const slotMatch =
          searchSlot === "" || v.availability.times.some((slot) => slot === searchSlot);
        const categoryMatch =
          searchCategory === "" ||
          v.volunteerRoles?.some((interest) => interest === searchCategory);
        const dayMatch =
          searchDays.length === 0 || searchDays.every((day) => v.availability.days?.includes(day));

        return nameMatch && slotMatch && categoryMatch && dayMatch;
      }),
    [volunteers, searchName, searchSlot, searchCategory, searchDays]
  );

  const uniqueNames = [...new Set(volunteers.map((v) => v.fullName))];

  return (
    <div className="table-section">
      <h2>{title}</h2>
      <div className="search-filters">
        <input
          list={`${title}-names`}
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <datalist id={`${title}-names`}>
          {uniqueNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>

        {title === "Helpline Volunteers" ? (
          <>
            <input
              list={`${title}-slots`}
              placeholder="Search by time slot"
              value={searchSlot}
              onChange={(e) => setSearchSlot(e.target.value)}
            />
            <datalist id={`${title}-slots`}>
              {fixedTimeSlots.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </>
        ) : (
          <>
            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="day-filter">
          <span>Search by days: </span>
          {weekDays.map((day) => (
            <label key={day} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={searchDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            {showCallStats && (
              <>
                <th>Accepted Calls</th>
                <th>Rejected Calls</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.map((vol) => (
            <tr key={vol._id}>
              <td>{vol.fullName}</td>
              <td>{vol.email}</td>
              <td>{vol.phone}</td>
              <td>
                <span className={`status-badge ${vol.status}`}>{vol.status}</span>
              </td>
              {showCallStats && (
                <>
                  <td>{vol.acceptedCalls}</td>
                  <td>{vol.rejectedCalls}</td>
                </>
              )}
              <td>
                <button onClick={() => onView(vol)}>Info</button>
                {vol.status !== "approved" && (
                  <button onClick={() => onApprove(vol._id)}>Approve</button>
                )}
                <Link to={`/update-volunteer/${vol._id}`}>Update</Link>
                <button onClick={() => onDelete(vol._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CallTable Component
const CallTable = ({ title, data, filterDate, setFilterDate, volunteers }) => (
  <div className="table-section">
    <h2>{title}</h2>
    <input
      type="date"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Volunteer</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration/Reason</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        {data.map((call) => {
          const vol = volunteers.find((v) => v.fullName === call.user);
          return (
            <tr key={call._id}>
              <td>{call._id}</td>
              <td>{call.user}</td>
              <td>{call.date}</td>
              <td>{call.time}</td>
              <td>{call.duration || call.reason}</td>
              <td>
                {vol && (
                  <button onClick={() => alert(JSON.stringify(vol, null, 2))}>Info</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// UpdateRequestTable Component
const UpdateRequestTable = ({ requests, volunteers, onApprove, onReject, onView }) => (
  <div className="table-section">
    <h2>Volunteer Update Requests</h2>
    <table>
      <thead>
        <tr>
          <th>Volunteer</th>
          <th>Requested Updates</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => {
          const vol = volunteers.find((v) => v._id === req.volunteerId);
          return (
            <tr key={req._id}>
              <td>{vol?.fullName}</td>
              <td>{JSON.stringify(req.updatedData)}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => onView(vol)}>Info</button>
                <button onClick={() => onApprove(req._id)}>Approve</button>
                <button onClick={() => onReject(req._id)}>Reject</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);





















// import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { io } from "socket.io-client";
// import "./CSS/AdminDashboard.css";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const fixedTimeSlots = [
//   "12:00 AM – 4:00 AM",
//   "4:00 AM – 8:00 AM",
//   "8:00 AM – 12:00 PM",
//   "12:00 PM – 4:00 PM",
//   "4:00 PM – 8:00 PM",
//   "8:00 PM – 12:00 AM",
// ];

// export default function AdminDashboard() {
//   const [volunteers, setVolunteers] = useState([]);
//   const [acceptedCalls, setAcceptedCalls] = useState([]);
//   const [rejectedCalls, setRejectedCalls] = useState([]);
//   const [updateRequests, setUpdateRequests] = useState([]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [shiftAssignments, setShiftAssignments] = useState([]);
//   const [newAnnouncement, setNewAnnouncement] = useState({ title: "", text: "" });
//   const [selectedVolunteer, setSelectedVolunteer] = useState(null);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [selectedSlotVolunteers, setSelectedSlotVolunteers] = useState({});
//   const [acceptedCallFilter, setAcceptedCallFilter] = useState("");
//   const [rejectedCallFilter, setRejectedCallFilter] = useState("");
//   const [ageFilter, setAgeFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const socketRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;

//   const [notifications, setNotifications] = useState({
//     volunteers: false,
//     acceptedCalls: false,
//     rejectedCalls: false,
//     updateRequests: false,
//     subscriptions: false,
//     users: false,
//     announcements: false,
//     shiftAssignments: false,
//   });

//   // Enhanced Socket.IO initialization with retry logic
//   const initializeSocket = useCallback(() => {
//     console.log('Initializing socket connection...');
    
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//     }

//     const socket = io(API_BASE_URL, {
//       transports: ["websocket", "polling"],
//       timeout: 20000,
//       reconnection: true,
//       reconnectionAttempts: maxReconnectAttempts,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//     });

//     socketRef.current = socket;

//     // Connection event handlers
//     socket.on("connect", () => {
//       console.log('Socket connected:', socket.id);
//       reconnectAttempts.current = 0;
//       setError(null);

//       // Join all required rooms
//       socket.emit('joinVolunteerRoom');
//       socket.emit('joinCallRoom');
//       socket.emit('joinAnnouncementRoom');
//       socket.emit('joinUpdateRequestRoom');
//       socket.emit('joinSubscriptionRoom');
//       socket.emit('joinUserRoom');
//       socket.emit('joinShiftAssignmentRoom');
//       socket.emit('joinActivityRoom');
//     });

//     socket.on("disconnect", (reason) => {
//       console.log('Socket disconnected:', reason);
//       if (reason === 'io server disconnect') {
//         socket.connect();
//       }
//     });

//     socket.on("connect_error", (error) => {
//       console.error('Socket connection error:', error);
//       reconnectAttempts.current += 1;
      
//       if (reconnectAttempts.current >= maxReconnectAttempts) {
//         setError('Unable to connect to server. Please refresh the page.');
//       }
//     });

//     // Room join confirmations
//     socket.on("roomJoined", ({ room }) => {
//       console.log(`Joined room: ${room}`);
//     });

//     socket.on("roomError", ({ room, error }) => {
//       console.error(`Error joining room ${room}:`, error);
//     });

//     // Volunteer events
//     socket.on("newVolunteer", (volunteer) => {
//       console.log("Received newVolunteer:", volunteer);
//       setVolunteers((prev) => {
//         const exists = prev.some((v) => v._id === volunteer._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, volunteers: true }));
//           return [volunteer, ...prev];
//         }
//         return prev;
//       });
//     });

//     socket.on("volunteerUpdated", (updatedVolunteer) => {
//       console.log("Received volunteerUpdated:", updatedVolunteer);
//       setVolunteers((prev) =>
//         prev.map((v) => (v._id === updatedVolunteer._id ? updatedVolunteer : v))
//       );
//       setNotifications((n) => ({ ...n, volunteers: true }));
//     });

//     socket.on("volunteerDeleted", (id) => {
//       console.log("Received volunteerDeleted:", id);
//       setVolunteers((prev) => prev.filter((v) => v._id !== id));
//       setNotifications((n) => ({ ...n, volunteers: true }));
//     });

//     // Call events
//     socket.on("newCall", (call) => {
//       console.log("Received newCall:", call);
//       if (["accepted", "completed"].includes(call.status)) {
//         setAcceptedCalls((prev) => {
//           const exists = prev.some((c) => c._id === call._id);
//           if (!exists) {
//             setNotifications((n) => ({ ...n, acceptedCalls: true }));
//             return [call, ...prev];
//           }
//           return prev.map((c) => c._id === call._id ? call : c);
//         });
//       } else if (call.status === "rejected") {
//         setRejectedCalls((prev) => {
//           const exists = prev.some((c) => c._id === call._id);
//           if (!exists) {
//             setNotifications((n) => ({ ...n, rejectedCalls: true }));
//             return [call, ...prev];
//           }
//           return prev.map((c) => c._id === call._id ? call : c);
//         });
//       }
//     });

//     // Update request events
//     socket.on("newUpdateRequest", (updateRequest) => {
//       console.log("Received newUpdateRequest:", updateRequest);
//       setUpdateRequests((prev) => {
//         const exists = prev.some((r) => r._id === updateRequest._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, updateRequests: true }));
//           return [updateRequest, ...prev];
//         }
//         return prev;
//       });
//     });

//     socket.on("updateRequestApproved", (reqId) => {
//       console.log("Received updateRequestApproved:", reqId);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setNotifications((n) => ({ ...n, updateRequests: true }));
//     });

//     socket.on("updateRequestRejected", (reqId) => {
//       console.log("Received updateRequestRejected:", reqId);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setNotifications((n) => ({ ...n, updateRequests: true }));
//     });

//     socket.on("updateRequestDeleted", (reqId) => {
//       console.log("Received updateRequestDeleted:", reqId);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setNotifications((n) => ({ ...n, updateRequests: true }));
//     });

//     // Other events
//     socket.on("newAnnouncement", (announcement) => {
//       console.log("Received newAnnouncement:", announcement);
//       setAnnouncements((prev) => {
//         const exists = prev.some((a) => a._id === announcement._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, announcements: true }));
//           return [announcement, ...prev];
//         }
//         return prev;
//       });
//     });

//     socket.on("newSubscription", (subscription) => {
//       console.log("Received newSubscription:", subscription);
//       setSubscriptions((prev) => {
//         const exists = prev.some((s) => s._id === subscription._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, subscriptions: true }));
//           return [subscription, ...prev];
//         }
//         return prev;
//       });
//     });

//     socket.on("newUser", (user) => {
//       console.log("Received newUser:", user);
//       setUsers((prev) => {
//         const exists = prev.some((u) => u._id === user._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, users: true }));
//           return [user, ...prev];
//         }
//         return prev;
//       });
//     });

//     socket.on("newShiftAssignment", (assignment) => {
//       console.log("Received newShiftAssignment:", assignment);
//       setShiftAssignments((prev) => {
//         const exists = prev.some((a) => a._id === assignment._id);
//         if (!exists) {
//           setNotifications((n) => ({ ...n, shiftAssignments: true }));
//           return [assignment, ...prev];
//         }
//         return prev;
//       });
//     });

//     return socket;
//   }, []);

//   // Initialize socket connection
//   useEffect(() => {
//     const socket = initializeSocket();

//     return () => {
//       if (socket) {
//         console.log('Cleaning up socket connection');
//         socket.disconnect();
//       }
//     };
//   }, [initializeSocket]);

//   // Enhanced data fetching with error handling
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log('Fetching dashboard data...');

//       const requests = [
//         axios.get(`${API_BASE_URL}/api/volunteers`),
//         axios.get(`${API_BASE_URL}/api/calls`).catch(() => ({ data: { accepted: [], rejected: [] } })),
//         axios.get(`${API_BASE_URL}/api/volunteers/update/requests`),
//         axios.get(`${API_BASE_URL}/api/subscriptions`).catch(() => ({ data: [] })),
//         axios.get(`${API_BASE_URL}/api/users`).catch(() => ({ data: [] })),
//         axios.get(`${API_BASE_URL}/api/announcements`).catch(() => ({ data: [] })),
//         axios.get(`${API_BASE_URL}/api/shift-assignments`).catch(() => ({ data: [] })),
//       ];

//       const [
//         volRes,
//         callRes,
//         updateReqRes,
//         subsRes,
//         userRes,
//         annRes,
//         shiftRes,
//       ] = await Promise.allSettled(requests);

//       // Handle successful responses
//       if (volRes.status === 'fulfilled') {
//         console.log('Volunteers fetched:', volRes.value.data);
//         setVolunteers(volRes.value.data.data || []);
//       } else {
//         console.error('Failed to fetch volunteers:', volRes.reason);
//       }

//       if (callRes.status === 'fulfilled') {
//         setAcceptedCalls(callRes.value.data.accepted || []);
//         setRejectedCalls(callRes.value.data.rejected || []);
//       }

//       if (updateReqRes.status === 'fulfilled') {
//         setUpdateRequests(updateReqRes.value.data.data || []);
//       }

//       if (subsRes.status === 'fulfilled') {
//         setSubscriptions(subsRes.value.data || []);
//       }

//       if (userRes.status === 'fulfilled') {
//         setUsers(userRes.value.data || []);
//       }

//       if (annRes.status === 'fulfilled') {
//         setAnnouncements(annRes.value.data || []);
//       }

//       if (shiftRes.status === 'fulfilled') {
//         setShiftAssignments(shiftRes.value.data || []);
//       }

//       console.log('Dashboard data loaded successfully');
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data. Please try refreshing the page.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Initial data fetch
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Clear notification for a specific section
//   const clearNotification = useCallback((field) => {
//     setNotifications((prev) => ({ ...prev, [field]: false }));
//   }, []);

//   // Enhanced API call function with better error handling
//   const makeAPICall = async (url, options = {}) => {
//     try {
//       console.log(`Making API call: ${options.method || 'GET'} ${url}`);
//       const response = await axios({
//         url: `${API_BASE_URL}${url}`,
//         timeout: 30000,
//         ...options
//       });
//       return response;
//     } catch (error) {
//       console.error(`API call failed: ${url}`, error.response?.data || error.message);
//       throw error;
//     }
//   };

//   // Create announcement
//   const handleCreateAnnouncement = async () => {
//     if (!newAnnouncement.title?.trim() || !newAnnouncement.text?.trim()) {
//       alert("Please fill in both title and text");
//       return;
//     }

//     try {
//       await makeAPICall('/api/announcements', {
//         method: 'POST',
//         data: newAnnouncement
//       });
//       setNewAnnouncement({ title: "", text: "" });
//       alert("Announcement created successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to create announcement";
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   // Volunteer approval actions with enhanced error handling
//   const handleApprove = async (id) => {
//     if (!id) {
//       alert("Invalid volunteer ID");
//       return;
//     }

//     try {
//       console.log("Approving volunteer:", id);
//       const response = await makeAPICall(`/api/volunteers/${id}/approve`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' }
//       });

//       console.log("Volunteer approved successfully:", response.data);
      
//       // Update local state immediately for better UX
//       setVolunteers((prev) =>
//         prev.map((v) => 
//           v._id === id 
//             ? { ...v, status: "approved", isApproved: true } 
//             : v
//         )
//       );

//       alert("Volunteer approved successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to approve volunteer";
//       console.error("Error approving volunteer:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   const handleReject = async (id) => {
//     if (!id) {
//       alert("Invalid volunteer ID");
//       return;
//     }

//     try {
//       console.log("Rejecting volunteer:", id);
//       const response = await makeAPICall(`/api/volunteers/${id}/reject`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' }
//       });

//       console.log("Volunteer rejected successfully:", response.data);
      
//       // Update local state immediately
//       setVolunteers((prev) =>
//         prev.map((v) => 
//           v._id === id 
//             ? { ...v, status: "rejected", isApproved: false } 
//             : v
//         )
//       );

//       alert("Volunteer rejected successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to reject volunteer";
//       console.error("Error rejecting volunteer:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!id) {
//       alert("Invalid volunteer ID");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this volunteer? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       console.log("Deleting volunteer:", id);
//       const response = await makeAPICall(`/api/volunteers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' }
//       });

//       console.log("Volunteer deleted successfully:", response.data);
      
//       // Update local state immediately
//       setVolunteers((prev) => prev.filter((v) => v._id !== id));

//       alert("Volunteer deleted successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to delete volunteer";
//       console.error("Error deleting volunteer:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   // Update request actions
//   const handleUpdateApprove = async (reqId) => {
//     if (!reqId) {
//       alert("Invalid request ID");
//       return;
//     }

//     try {
//       console.log("Approving update request:", reqId);
//       const response = await makeAPICall(`/api/volunteers/update/approve/${reqId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' }
//       });

//       console.log("Update request approved:", response.data);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       alert("Update request approved successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to approve update request";
//       console.error("Error approving update request:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   const handleUpdateReject = async (reqId) => {
//     if (!reqId) {
//       alert("Invalid request ID");
//       return;
//     }

//     try {
//       console.log("Rejecting update request:", reqId);
//       const response = await makeAPICall(`/api/volunteers/update/reject/${reqId}`, {
//         method: 'PUT',
//         data: { adminResponse: "Rejected by admin" },
//         headers: { 'Content-Type': 'application/json' }
//       });

//       console.log("Update request rejected:", response.data);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       alert("Update request rejected successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to reject update request";
//       console.error("Error rejecting update request:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   // Shift assignment
//   const assignShift = async (volunteerId, slot) => {
//     if (!volunteerId || !slot) {
//       alert("Please select a volunteer and time slot");
//       return;
//     }

//     try {
//       console.log("Assigning shift:", { volunteerId, slot });
//       const response = await makeAPICall('/api/shift-assignments', {
//         method: 'POST',
//         data: { volunteerId, slot }
//       });

//       console.log("Shift assigned successfully:", response.data);
//       setShiftAssignments((prev) => {
//         const newAssignment = response.data.assignment;
//         const exists = prev.some((a) => a._id === newAssignment._id);
//         if (!exists) {
//           return [...prev, newAssignment];
//         }
//         return prev;
//       });
      
//       setSelectedSlotVolunteers((prev) => ({ ...prev, [slot]: "" }));
//       alert("Shift assigned successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to assign shift";
//       console.error("Error assigning shift:", err);
//       alert(`Error: ${errorMsg}`);
//     }
//   };

//   // Computed values with proper error handling
//   const helplineVolunteers = useMemo(
//     () => volunteers.filter((v) => v.volunteerType === "helpline" && v.status === "approved"),
//     [volunteers]
//   );
  
//   const nonHelplineVolunteers = useMemo(
//     () => volunteers.filter((v) => v.volunteerType === "non-helpline" && v.status === "approved"),
//     [volunteers]
//   );
  
//   const approvalRequests = useMemo(
//     () => volunteers.filter((v) => v.status === "pending"),
//     [volunteers]
//   );

//   const totalActiveHelpline = helplineVolunteers.length;
//   const totalActiveNonHelpline = nonHelplineVolunteers.length;
//   const totalAnsweredCalls = acceptedCalls.length;
//   const callsAfterMidnight = acceptedCalls.filter((call) => {
//     try {
//       const hour = parseInt(call.time?.split(":")[0] || "0");
//       return hour >= 2 && hour <= 6;
//     } catch {
//       return false;
//     }
//   }).length;
//   const totalRejectedCalls = rejectedCalls.length;
//   const deEscalatedPercentage = Math.round(
//     (acceptedCalls.filter((c) => c.deEscalated).length / (acceptedCalls.length || 1)) * 100
//   );

//   // Volunteer call stats
//   const volunteerCallStats = useMemo(() => {
//     const stats = {};
//     volunteers.forEach((v) => (stats[v._id] = { accepted: 0, rejected: 0 }));
    
//     acceptedCalls.forEach((c) => {
//       const vol = volunteers.find((v) => v.fullName === c.user);
//       if (vol && stats[vol._id]) stats[vol._id].accepted += 1;
//     });
    
//     rejectedCalls.forEach((c) => {
//       const vol = volunteers.find((v) => v.fullName === c.user);
//       if (vol && stats[vol._id]) stats[vol._id].rejected += 1;
//     });
    
//     return stats;
//   }, [volunteers, acceptedCalls, rejectedCalls]);

//   const enrichedHelplineVolunteers = helplineVolunteers.map((v) => ({
//     ...v,
//     acceptedCalls: volunteerCallStats[v._id]?.accepted || 0,
//     rejectedCalls: volunteerCallStats[v._id]?.rejected || 0,
//   }));

//   const filteredAcceptedCalls = acceptedCalls.filter(
//     (c) => !acceptedCallFilter || c.date === acceptedCallFilter
//   );
  
//   const filteredRejectedCalls = rejectedCalls.filter(
//     (c) => !rejectedCallFilter || c.date === rejectedCallFilter
//   );

//   const filteredUsers = useMemo(() => {
//     if (!ageFilter) return users;
//     const age = parseInt(ageFilter);
//     if (isNaN(age) || age < 8 || age > 120) return users;
//     return users.filter((u) => u.age === age);
//   }, [users, ageFilter]);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="admin-dashboard">
//         <div className="loading-container">
//           <h2>Loading Dashboard...</h2>
//           <p>Please wait while we fetch the latest data.</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="admin-dashboard">
//         <div className="error-container">
//           <h2>Error Loading Dashboard</h2>
//           <p>{error}</p>
//           <button onClick={fetchData}>Retry</button>
//         </div>
//       </div>
//     );
//   }

//   // Render main dashboard
//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>
      
//       {/* Connection Status */}
//       {socketRef.current && (
//         <div className="connection-status">
//           <span className={`status-indicator ${socketRef.current.connected ? 'connected' : 'disconnected'}`}>
//             {socketRef.current.connected ? 'Connected' : 'Disconnected'}
//           </span>
//         </div>
//       )}

//       {/* Dashboard Cards */}
//       <div className="cards-container">
//         <Card title="Active Helpline Volunteers" value={totalActiveHelpline} />
//         <Card title="Active Non-Helpline Volunteers" value={totalActiveNonHelpline} />
//         <Card title="Calls Answered (Helpline)" value={totalAnsweredCalls} />
//         <Card title="Calls Answered After Midnight" value={callsAfterMidnight} />
//         <Card title="Calls Rejected" value={totalRejectedCalls} />
//         <Card title="De-escalated Successfully (%)" value={`${deEscalatedPercentage}%`} />
//       </div>

//       {/* Approval Requests */}
//       <SectionHeader
//         title={`Approval Requests (${approvalRequests.length})`}
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <Table
//         title="Approval Requests"
//         data={approvalRequests}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       {/* Volunteers Tables */}
//       <SectionHeader
//         title={`Helpline Volunteers (${helplineVolunteers.length})`}
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <SearchableVolunteerTable
//         title="Helpline Volunteers"
//         volunteers={enrichedHelplineVolunteers}
//         showCallStats={true}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       <SectionHeader
//         title={`Non-Helpline Volunteers (${nonHelplineVolunteers.length})`}
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <SearchableVolunteerTable
//         title="Non-Helpline Volunteers"
//         volunteers={nonHelplineVolunteers}
//         showCallStats={false}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       {/* Calls */}
//       <SectionHeader
//         title={`Accepted Calls (${acceptedCalls.length})`}
//         notification={notifications.acceptedCalls}
//         onClick={() => clearNotification("acceptedCalls")}
//       />
//       <CallTable
//         title="Accepted Calls"
//         data={filteredAcceptedCalls}
//         filterDate={acceptedCallFilter}
//         setFilterDate={setAcceptedCallFilter}
//         volunteers={volunteers}
//       />

//       <SectionHeader
//         title={`Rejected Calls (${rejectedCalls.length})`}
//         notification={notifications.rejectedCalls}
//         onClick={() => clearNotification("rejectedCalls")}
//       />
//       <CallTable
//         title="Rejected Calls"
//         data={filteredRejectedCalls}
//         filterDate={rejectedCallFilter}
//         setFilterDate={setRejectedCallFilter}
//         volunteers={volunteers}
//       />

//       {/* Update Requests */}
//       <SectionHeader
//         title={`Volunteer Update Requests (${updateRequests.length})`}
//         notification={notifications.updateRequests}
//         onClick={() => clearNotification("updateRequests")}
//       />
//       <UpdateRequestTable
//         requests={updateRequests}
//         volunteers={volunteers}
//         onApprove={handleUpdateApprove}
//         onReject={handleUpdateReject}
//         onView={setSelectedVolunteer}
//       />

//       {/* Newsletter Subscriptions */}
//       <SectionHeader
//         title={`Newsletter Subscriptions (${subscriptions.length})`}
//         notification={notifications.subscriptions}
//         onClick={() => clearNotification("subscriptions")}
//       />
//       <div className="table-section">
//         <h2>Newsletter Subscriptions</h2>
//         {subscriptions.length === 0 ? (
//           <p>No subscriptions found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Email</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subscriptions.map((sub) => (
//                 <tr key={sub._id || sub.email}>
//                   <td>{sub.email}</td>
//                   <td>
//                     <span className={`status-badge ${sub.status || 'active'}`}>
//                       {sub.status || 'active'}
//                     </span>
//                   </td>
//                   <td>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Users */}
//       <SectionHeader
//         title={`Users (${users.length})`}
//         notification={notifications.users}
//         onClick={() => clearNotification("users")}
//       />
//       <div className="table-section">
//         <h2>Users</h2>
//         <div className="search-filters">
//           <input
//             type="number"
//             placeholder="Enter age (8-120)"
//             value={ageFilter}
//             min="8"
//             max="120"
//             onChange={(e) => setAgeFilter(e.target.value)}
//           />
//         </div>
//         {filteredUsers.length === 0 ? (
//           <p>No users found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Age</th>
//                 <th>Registration Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u) => (
//                 <tr key={u._id || u.email}>
//                   <td>{u.name || 'N/A'}</td>
//                   <td>{u.email || 'N/A'}</td>
//                   <td>{u.age || 'N/A'}</td>
//                   <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Shift Assignment Table */}
//       <SectionHeader
//         title="Shift Assignment (Helpline)"
//         notification={notifications.shiftAssignments}
//         onClick={() => clearNotification("shiftAssignments")}
//       />
//       <div className="table-section">
//         <h2>Shift Assignment (Helpline)</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Volunteer</th>
//               <th>Time Slot</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fixedTimeSlots.map((slot) => {
//               const availableVols = helplineVolunteers.filter(
//                 (v) =>
//                   v.availability?.times?.includes(slot) &&
//                   !shiftAssignments.some((a) => a.slot === slot && a.volunteerId === v._id)
//               );
//               const selectedId = selectedSlotVolunteers[slot] || availableVols[0]?._id || "";

//               return (
//                 <tr key={slot}>
//                   <td>
//                     <select
//                       value={selectedId}
//                       onChange={(e) =>
//                         setSelectedSlotVolunteers((prev) => ({
//                           ...prev,
//                           [slot]: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="">Select Volunteer</option>
//                       {availableVols.map((v) => (
//                         <option key={v._id} value={v._id}>
//                           {v.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>{slot}</td>
//                   <td>
//                     <button 
//                       onClick={() => assignShift(selectedId, slot)}
//                       disabled={!selectedId}
//                     >
//                       Assign
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <h3>Current Assignments:</h3>
//         {shiftAssignments.length === 0 ? (
//           <p>No shift assignments found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Volunteer</th>
//                 <th>Time Slot</th>
//                 <th>Assigned Date</th>
//                 <th>Info</th>
//               </tr>
//             </thead>
//             <tbody>
//               {shiftAssignments.map((s, idx) => {
//                 const vol = volunteers.find((v) => v._id === s.volunteerId);
//                 return (
//                   <tr key={s._id || idx}>
//                     <td>{vol?.fullName || 'Unknown Volunteer'}</td>
//                     <td>{s.slot}</td>
//                     <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}</td>
//                     <td>
//                       {vol && (
//                         <button onClick={() => setSelectedVolunteer(vol)}>Info</button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Announcements */}
//       <SectionHeader
//         title={`Announcements (${announcements.length})`}
//         notification={notifications.announcements}
//         onClick={() => clearNotification("announcements")}
//       />
//       <div className="table-section">
//         <h2>Announcements</h2>
//         <div className="announcement-form">
//           <input
//             type="text"
//             placeholder="Title"
//             value={newAnnouncement.title}
//             onChange={(e) =>
//               setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
//             }
//           />
//           <textarea
//             placeholder="Text"
//             value={newAnnouncement.text}
//             onChange={(e) =>
//               setNewAnnouncement((prev) => ({ ...prev, text: e.target.value }))
//             }
//             rows={4}
//           />
//           <button 
//             onClick={handleCreateAnnouncement}
//             disabled={!newAnnouncement.title.trim() || !newAnnouncement.text.trim()}
//           >
//             Create Announcement
//           </button>
//         </div>
        
//         {announcements.length === 0 ? (
//           <p>No announcements found.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {announcements.map((a) => (
//                 <tr key={a._id}>
//                   <td>{a.title}</td>
//                   <td>{a.date || (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A')}</td>
//                   <td>{a.time || (a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : 'N/A')}</td>
//                   <td>
//                     <button onClick={() => setSelectedAnnouncement(a)}>View</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Volunteer Modal */}
//       {selectedVolunteer && (
//         <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>{selectedVolunteer.fullName}'s Information</h3>
//             <div className="volunteer-info">
//               <p><strong>Email:</strong> {selectedVolunteer.email}</p>
//               <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
//               <p><strong>Type:</strong> {selectedVolunteer.volunteerType}</p>
//               <p><strong>Status:</strong> 
//                 <span className={`status-badge ${selectedVolunteer.status}`}>
//                   {selectedVolunteer.status}
//                 </span>
//               </p>
//               <p><strong>Address:</strong> {selectedVolunteer.address ? 
//                 `${selectedVolunteer.address.street}, ${selectedVolunteer.address.city}, ${selectedVolunteer.address.state}, ${selectedVolunteer.address.postalCode}` : 
//                 'N/A'
//               }</p>
//               <p><strong>Availability Days:</strong> {selectedVolunteer.availability?.days?.join(", ") || 'N/A'}</p>
//               <p><strong>Availability Times:</strong> {selectedVolunteer.availability?.times?.join(", ") || 'N/A'}</p>
//               <p><strong>Volunteer Roles:</strong> {selectedVolunteer.volunteerRoles?.join(", ") || 'N/A'}</p>
//               <p><strong>Skills:</strong> {selectedVolunteer.additionalInfo?.skillsExperience || 'N/A'}</p>
//               <p><strong>Why Volunteer:</strong> {selectedVolunteer.additionalInfo?.whyVolunteer || 'N/A'}</p>
//               <p><strong>Registration Date:</strong> {selectedVolunteer.registrationDate ? 
//                 new Date(selectedVolunteer.registrationDate).toLocaleDateString() : 'N/A'
//               }</p>
//               <p><strong>Last Login:</strong> {selectedVolunteer.lastLogin ? 
//                 new Date(selectedVolunteer.lastLogin).toLocaleDateString() : 'Never'
//               }</p>
//             </div>
//             <button onClick={() => setSelectedVolunteer(null)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* Announcement Modal */}
//       {selectedAnnouncement && (
//         <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>{selectedAnnouncement.title}</h3>
//             <div className="announcement-content">
//               <p>{selectedAnnouncement.text}</p>
//               <p className="announcement-meta">
//                 <small>
//                   {selectedAnnouncement.date || (selectedAnnouncement.createdAt ? new Date(selectedAnnouncement.createdAt).toLocaleDateString() : '')} {' '}
//                   {selectedAnnouncement.time || (selectedAnnouncement.createdAt ? new Date(selectedAnnouncement.createdAt).toLocaleTimeString() : '')}
//                 </small>
//               </p>
//             </div>
//             <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // SectionHeader Component
// function SectionHeader({ title, notification, onClick }) {
//   return (
//     <div className="section-header" onClick={onClick} style={{ cursor: "pointer" }}>
//       <h2>
//         {title} {notification && <span className="notification-dot" />}
//       </h2>
//     </div>
//   );
// }

// // Card Component
// const Card = ({ title, value }) => (
//   <div className="card">
//     <h3>{title}</h3>
//     <p>{value}</p>
//   </div>
// );

// // Approval Requests Table
// const Table = ({ title, data, onApprove, onReject, onView, onDelete }) => (
//   <div className="table-section">
//     <h2>{title}</h2>
//     {data.length === 0 ? (
//       <p>No pending approval requests.</p>
//     ) : (
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Type</th>
//             <th>Registration Date</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((vol) => (
//             <tr key={vol._id}>
//               <td>{vol.fullName}</td>
//               <td>{vol.email}</td>
//               <td>{vol.phone}</td>
//               <td>{vol.volunteerType}</td>
//               <td>{vol.registrationDate ? new Date(vol.registrationDate).toLocaleDateString() : 'N/A'}</td>
//               <td>
//                 <span className={`status-badge ${vol.status}`}>{vol.status}</span>
//               </td>
//               <td>
//                 <div className="action-buttons">
//                   <button onClick={() => onView(vol)}>Info</button>
//                   {vol.status !== "approved" && (
//                     <button onClick={() => onApprove(vol._id)} className="approve-btn">Approve</button>
//                   )}
//                   {vol.status !== "rejected" && (
//                     <button onClick={() => onReject(vol._id)} className="reject-btn">Reject</button>
//                   )}
//                   <button onClick={() => onDelete(vol._id)} className="delete-btn">Delete</button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     )}
//   </div>
// );

// // SearchableVolunteerTable Component
// const SearchableVolunteerTable = ({
//   title,
//   volunteers,
//   onApprove,
//   onReject,
//   onDelete,
//   onView,
//   showCallStats,
// }) => {
//   const [searchName, setSearchName] = useState("");
//   const [searchSlot, setSearchSlot] = useState("");
//   const [searchCategory, setSearchCategory] = useState("");
//   const [searchDays, setSearchDays] = useState([]);

//   const categories = [
//     "Event Support",
//     "Fundraising",
//     "Community Outreach",
//     "Campus Ambassador",
//     "Social Media & Digital Promotion",
//     "Content Writing / Blogging",
//     "Graphic Design / Creative Support",
//     "Technical Support (e.g., IT, website)",
//     "Translation / Language Support",
//     "Photography / Videography",
//     "Mentorship / Training",
//     "Case Follow-up Coordinator",
//     "Crisis Response Assistant",
//     "Resource & Referral Assistant",
//   ];

//   const weekDays = [
//     "Saturday",
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//   ];

//   const handleDayChange = (day) => {
//     setSearchDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   const filteredVolunteers = useMemo(
//     () =>
//       volunteers.filter((v) => {
//         const nameMatch = !searchName || v.fullName?.toLowerCase().includes(searchName.toLowerCase());
//         const slotMatch = !searchSlot || v.availability?.times?.some((slot) => slot === searchSlot);
//         const categoryMatch = !searchCategory || v.volunteerRoles?.some((role) => role === searchCategory);
//         const dayMatch = searchDays.length === 0 || searchDays.every((day) => v.availability?.days?.includes(day));

//         return nameMatch && slotMatch && categoryMatch && dayMatch;
//       }),
//     [volunteers, searchName, searchSlot, searchCategory, searchDays]
//   );

//   const uniqueNames = [...new Set(volunteers.map((v) => v.fullName).filter(Boolean))];

//   return (
//     <div className="table-section">
//       <h2>{title}</h2>
//       <div className="search-filters">
//         <input
//           list={`${title}-names`}
//           placeholder="Search by name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         <datalist id={`${title}-names`}>
//           {uniqueNames.map((n) => (
//             <option key={n} value={n} />
//           ))}
//         </datalist>

//         {title === "Helpline Volunteers" ? (
//           <>
//             <input
//               list={`${title}-slots`}
//               placeholder="Search by time slot"
//               value={searchSlot}
//               onChange={(e) => setSearchSlot(e.target.value)}
//             />
//             <datalist id={`${title}-slots`}>
//               {fixedTimeSlots.map((s) => (
//                 <option key={s} value={s} />
//               ))}
//             </datalist>
//           </>
//         ) : (
//           <>
//             <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
//               <option value="">All Categories</option>
//               {categories.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}

//         <div className="day-filter">
//           <span>Search by days: </span>
//           {weekDays.map((day) => (
//             <label key={day} style={{ marginRight: "10px" }}>
//               <input
//                 type="checkbox"
//                 checked={searchDays.includes(day)}
//                 onChange={() => handleDayChange(day)}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//       </div>
      
//       {filteredVolunteers.length === 0 ? (
//         <p>No volunteers found matching the criteria.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Type</th>
//               <th>Status</th>
//               {showCallStats && (
//                 <>
//                   <th>Accepted Calls</th>
//                   <th>Rejected Calls</th>
//                 </>
//               )}
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredVolunteers.map((vol) => (
//               <tr key={vol._id}>
//                 <td>{vol.fullName}</td>
//                 <td>{vol.email}</td>
//                 <td>{vol.phone}</td>
//                 <td>{vol.volunteerType}</td>
//                 <td>
//                   <span className={`status-badge ${vol.status}`}>{vol.status}</span>
//                 </td>
//                 {showCallStats && (
//                   <>
//                     <td>{vol.acceptedCalls || 0}</td>
//                     <td>{vol.rejectedCalls || 0}</td>
//                   </>
//                 )}
//                 <td>
//                   <div className="action-buttons">
//                     <button onClick={() => onView(vol)}>Info</button>
//                     {vol.status !== "approved" && (
//                       <button onClick={() => onApprove(vol._id)} className="approve-btn">Approve</button>
//                     )}
//                     <Link to={`/update-volunteer/${vol._id}`}>Update</Link>
//                     <button onClick={() => onDelete(vol._id)} className="delete-btn">Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// // CallTable Component
// const CallTable = ({ title, data, filterDate, setFilterDate, volunteers }) => (
//   <div className="table-section">
//     <h2>{title}</h2>
//     <div className="call-filters">
//       <input
//         type="date"
//         value={filterDate}
//         onChange={(e) => setFilterDate(e.target.value)}
//         placeholder="Filter by date"
//       />
//     </div>
//     {data.length === 0 ? (
//       <p>No calls found.</p>
//     ) : (
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Volunteer</th>
//             <th>User</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Duration/Reason</th>
//             <th>De-escalated</th>
//             <th>Info</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((call) => {
//             const vol = volunteers.find((v) => v.fullName === call.user || v._id === call.volunteerId);
//             return (
//               <tr key={call._id}>
//                 <td>{call._id?.substring(0, 8)}...</td>
//                 <td>{call.user || vol?.fullName || 'Unknown'}</td>
//                 <td>{call.userName || call.userPhone || 'Anonymous'}</td>
//                 <td>{call.date}</td>
//                 <td>{call.time}</td>
//                 <td>{call.duration || call.reason || 'N/A'}</td>
//                 <td>{call.deEscalated ? 'Yes' : 'No'}</td>
//                 <td>
//                   {vol && (
//                     <button onClick={() => alert(JSON.stringify(vol, null, 2))}>Info</button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     )}
//   </div>
// );

// // UpdateRequestTable Component
// const UpdateRequestTable = ({ requests, volunteers, onApprove, onReject, onView }) => (
//   <div className="table-section">
//     <h2>Volunteer Update Requests</h2>
//     {requests.length === 0 ? (
//       <p>No update requests pending.</p>
//     ) : (
//       <table>
//         <thead>
//           <tr>
//             <th>Volunteer</th>
//             <th>Email</th>
//             <th>Request Date</th>
//             <th>Fields to Update</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map((req) => {
//             const vol = volunteers.find((v) => v._id === req.volunteerId) || req.volunteerId;
//             return (
//               <tr key={req._id}>
//                 <td>{typeof vol === 'object' ? vol.fullName : 'Unknown'}</td>
//                 <td>{typeof vol === 'object' ? vol.email : 'Unknown'}</td>
//                 <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</td>
//                 <td>
//                   <div className="update-fields">
//                     {req.requestedFields ? req.requestedFields.join(', ') : 'Multiple fields'}
//                   </div>
//                 </td>
//                 <td>
//                   <span className={`status-badge ${req.status}`}>{req.status}</span>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button onClick={() => onView(typeof vol === 'object' ? vol : null)}>Info</button>
//                     <button onClick={() => onApprove(req._id)} className="approve-btn">Approve</button>
//                     <button onClick={() => onReject(req._id)} className="reject-btn">Reject</button>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     )}
//   </div>
// );
