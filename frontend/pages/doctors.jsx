import { useEffect, useState } from "react";
import BASE_URL from "../services/api";

function Doctors({ onPageChange }) {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole] = useState(localStorage.getItem("role") || "user");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/doctors/`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch (e) {
      setMsg({ type: "error", text: "Could not load doctors. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async () => {
    if (!name.trim() || !specialization.trim()) {
      setMsg({ type: "error", text: "Please fill in both Doctor Name and Specialization." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/doctors/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialization }),
      });
      if (res.ok) {
        setName(""); setSpecialization("");
        setMsg({ type: "success", text: `Dr. ${name} added successfully!` });
        fetchDoctors();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.message || "Could not add doctor." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Check if backend is running." });
    } finally {
      setSaving(false);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor? This will also cancel all their appointments.")) return;
    try {
      const res = await fetch(`${BASE_URL}/doctors/${id}?role=${userRole}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Doctor record deleted successfully." });
        fetchDoctors();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.detail || "Could not delete doctor." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error." });
    } finally {
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const initials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "DR";

  return (
    <div>
      <div className="page-heading fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Doctors Management</h1>
          <p>Add and manage all hospital doctors and their specializations.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onPageChange('admin_dashboard')}>
          ← Back to Admin Panel
        </button>
      </div>

      {/* Add Doctor Form */}
      <div className="card fade-up" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header">
          <span className="card-title">👨‍⚕️ Add New Doctor</span>
        </div>
        <div className="card-body">
          {msg && (
            <div className={`alert alert-${msg.type} alert-toast`}>
              {msg.type === "success" ? "✅" : "❌"} {msg.text}
            </div>
          )}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Doctor Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Dr. Simhadri"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Specialization</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Surgeon, Cardiologist"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDoctor()}
              />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" onClick={addDoctor} disabled={saving}>
              {saving ? <span className="spin">⏳</span> : "➕"}&nbsp; Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="card fade-up fade-up-2">
        <div className="card-header">
          <span className="card-title">All Doctors</span>
          <span className="badge badge-blue">{doctors.length} total</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              <span className="spin" style={{ fontSize: "1.5rem" }}>⏳</span>
              <p style={{ marginTop: "0.5rem" }}>Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏥</div>
              <h3>No doctors found</h3>
              <p>Add your first doctor using the form above.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    {userRole === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc, i) => (
                    <tr key={doc.id}>
                      <td data-label="#" style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{i + 1}</td>
                      <td data-label="Doctor">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

                          <div className="avatar" style={{ width: 36, height: 36, fontSize: "0.75rem" }}>
                            {initials(doc.name)}
                          </div>
                          <span className="td-bold">Dr. {doc.name}</span>
                        </div>
                      </td>
                      <td data-label="Specialization">
                        <span className="badge badge-blue">{doc.specialization}</span>
                      </td>
                      <td data-label="Status">
                        <span className="badge badge-green">● Active</span>
                      </td>
                      {userRole === "admin" && (
                        <td data-label="Actions">

                          <button 
                            onClick={() => deleteDoctor(doc.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
                            title="Delete Doctor"
                          >🗑️</button>
                        </td>
                      )}
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

export default Doctors;