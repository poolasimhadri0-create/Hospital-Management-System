import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../services/api";

function PatientPortal() {
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("medicore_admin"));

  if (!user || user.role !== "patient") {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access Denied. Please login via the Patient Portal.</div>;
  }

  const handleSubmit = async () => {
    if (!name.trim() || !problem.trim() || !address.trim() || !hospitalName.trim()) {
      setMsg({ type: "error", text: "Please fill in all fields including Hospital Name." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, problem, address, hospital_name: hospitalName }),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Your information has been successfully submitted!" });
        setName(""); setProblem(""); setAddress(""); setHospitalName("");
      } else {
        setMsg({ type: "error", text: "Submission failed. Please try again." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Please check your connection." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 6000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patient-login");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="page-heading">
        <h1>Welcome, {user.username}</h1>
        <p>Please provide your details below to update your medical file.</p>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-title">📝 Medical Information Form</span>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Logout</button>
        </div>
        <div className="card-body">
          {msg && (
            <div className={`alert alert-${msg.type}`} style={{ marginBottom: "1.5rem" }}>
              {msg.type === "success" ? "✅ " : "❌ "}{msg.text}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Your Full Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Medical Problem / Symptoms</label>
            <textarea
              className="form-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your medical concern..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Residential Address</label>
            <input
              className="form-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, Zip Code"
            />
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={saving}>
            {saving ? "Submitting..." : "Submit Information"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientPortal;