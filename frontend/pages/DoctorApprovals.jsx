import { useState, useEffect } from "react";
import BASE_URL from "../services/api";

function DoctorApprovals({ onPageChange }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/pending-doctors`);
      const data = await res.json();
      if (Array.isArray(data)) setPending(data);
    } catch (e) {
      console.error("Fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (username) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/approve-doctor/${encodeURIComponent(username)}`, {
        method: "PUT",
      });
      if (res.ok) {
        setMessage({ text: `Doctor ${username} has been approved!`, type: "success" });
        fetchPending();
      } else {
        setMessage({ text: "Approval failed.", type: "error" });
      }
    } catch {
      setMessage({ text: "Connection error.", type: "error" });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReject = async (username) => {
    if (!window.confirm(`Are you sure you want to reject the request for ${username}?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/auth/reject-doctor/${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
      console.log(`Reject doctor ${username} response status: ${res.status}`);
      const responseBody = await res.json(); // Assuming JSON response for errors/messages
      if (res.ok) {
        setMessage({ text: `Doctor ${username}'s request has been rejected.`, type: "success" });
        fetchPending();
      } else {
        setMessage({ text: responseBody.detail || responseBody.message || "Rejection failed.", type: "error" });
      }
    } catch {
      setMessage({ text: "Connection error.", type: "error" });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-heading fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Doctor Approvals</h1>
          <p>Review and authorize new doctor registration requests.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onPageChange('admin_dashboard')}>
          ← Back to Admin Panel
        </button>
      </div>

      {message && <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>{message.text}</div>}

      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">⏳ Pending Requests ({pending.length})</span>
          {loading && <span className="spin" style={{ marginLeft: '10px' }}>⏳</span>}
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {pending.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
              <h3>All caught up!</h3>
              <p>There are no pending doctor approval requests at this time.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Account Type</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((user) => (
                    <tr key={user.id}>
                      <td data-label="Username" className="td-bold">{user.username}</td>
                      <td data-label="Account Type"><span className="badge badge-blue">DOCTOR</span></td>
                      <td data-label="Action" style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 16px', fontSize: '0.85rem', background: '#10b981', marginRight: '8px' }}
                          onClick={() => handleApprove(user.username)}
                        >
                          Approve Access
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                          onClick={() => handleReject(user.username)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorApprovals;