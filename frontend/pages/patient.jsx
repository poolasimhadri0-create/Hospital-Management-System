import { useEffect, useState } from "react";
import BASE_URL from "../services/api";

function Patients({ onPageChange }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");
  const [problem, setProblem] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/patients/`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      if (Array.isArray(data)) setPatients(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async () => {
    if (!name.trim() || !age || !gender || !problem.trim() || !address.trim() || !hospitalName.trim()) {
      setMsg({ type: "error", text: "Please fill in all fields including Hospital Name." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: parseInt(age), gender, problem, address, hospital_name: hospitalName }),
      });
      if (res.ok) {
        setName(""); setAge(""); setGender(""); setProblem(""); setAddress(""); setHospitalName("");
        setMsg({ type: "success", text: `${name} has been successfully registered!` });
        fetchPatients();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.message || "Could not register patient." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Check if backend is running." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;
    try {
      const res = await fetch(`${BASE_URL}/patients/${id}?role=${userRole}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Patient record deleted successfully." });
        fetchPatients();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.detail || "Could not delete patient." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error." });
    } finally {
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const initials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "PT";

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).includes(searchTerm) ||
    (p.problem && p.problem.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-heading fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Patients Management</h1>
          <p>Register new patients and view existing records in the hospital system.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onPageChange('admin_dashboard')}>
          ← Back to Admin Panel
        </button>
      </div>

      {/* Add Patient Form */}
      <div className="card fade-up" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header">
          <span className="card-title">➕ Register New Patient</span>
        </div>
        <div className="card-body">
          {msg && (
            <div className={`alert alert-${msg.type}`} style={{ marginBottom: "1rem" }}>
              {msg.type === "success" ? "✅" : "❌"} {msg.text}
            </div>
          )}
          <div className="form-row" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 35"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="120"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              <select 
                className="form-input" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Medical Problem</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Fever, Fracture"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Residential Address</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. City, Zip"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Hospital Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Which Hospital?"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" onClick={addPatient} disabled={saving}>
              {saving ? <span className="spin">⏳</span> : "➕"}&nbsp; Register Patient
            </button>
          </div>
        </div>
      </div>

      <div className="card fade-up fade-up-2">
        <div className="card-header">
          <span className="card-title">🧑‍🤝‍🧑 Patient Records</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="🔍 Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', minWidth: '220px' }}
            />
            <span className="badge badge-teal" style={{ background: "#ecfeff", color: "#0e7490" }}>
              {patients.length} total
            </span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              <span className="spin" style={{ fontSize: "1.5rem" }}>⏳</span>
              <p style={{ marginTop: "0.5rem" }}>Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🧑‍🤝‍🧑</div>
              <h3>No patients registered</h3>
              <p>Patient records will appear here once added using the form above.</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No matching patients found</h3>
              <p>Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Age & Gender</th>
                    <th>Diagnosis/Problem</th>
                    <th>Address</th>
                    <th>Hospital</th>
                    <th>Status</th>
                    {userRole === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p, i) => (
                    <tr key={p.id}>
<td data-label="ID" style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        #{String(p.id).padStart(4, "0")}
                      </td>
                      <td data-label="Patient">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

                          <div
                            className="avatar"
                            style={{
                              width: 36, height: 36, fontSize: "0.75rem",
                              background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 65%, 55%), hsl(${(i * 47 + 40) % 360}, 65%, 45%))`,
                            }}
                          >
                            {initials(p.name)}
                          </div>
                          <span className="td-bold">{p.name}</span>
                        </div>
                      </td>
                      <td data-label="Age & Gender">
                        <span style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>

                          {p.age} yrs • {p.gender}
                        </span>
                      </td>
                      <td data-label="Diagnosis/Problem">
                        <span style={{ fontSize: "0.85rem" }}>{p.problem || "—"}</span>
                      </td>
                      <td data-label="Address">
                        <span style={{ fontSize: "0.85rem" }}>{p.address || "—"}</span>
                      </td>
                      <td data-label="Hospital">
                        <span style={{ fontSize: "0.85rem" }}>{p.hospital_name || "—"}</span>
                      </td>
                      <td data-label="Status">
                        <span className="badge badge-green">● Active</span>
                      </td>
                      {userRole === "admin" && (
                      <td>
                        <button 
                          onClick={() => deletePatient(p.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
                          title="Delete Record"
                        >
                          🗑️
                        </button>
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

export default Patients;