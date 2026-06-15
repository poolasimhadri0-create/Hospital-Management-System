import { useEffect, useState } from "react";
import BASE_URL from "../services/api";

function Appointments({ onPageChange }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [appRes, patRes, docRes] = await Promise.all([
        fetch(`${BASE_URL}/appointments/`),
        fetch(`${BASE_URL}/patients/`),
        fetch(`${BASE_URL}/doctors/`)
      ]);
      
      const appData = await appRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();
      
      if (Array.isArray(appData)) setAppointments(appData);
      if (Array.isArray(patData)) setPatients(patData);
      if (Array.isArray(docData)) setDoctors(docData);
    } catch (e) {
      console.error("Fetch data failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async () => {
    if (!patientId || !doctorId || !date) {
      setMsg({ type: "error", text: "Please select a Patient, a Doctor, and a Date." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: Number(patientId),
          doctor_id: Number(doctorId),
          date,
        }),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Appointment booked successfully!" });
        setPatientId(""); setDoctorId(""); setDate("");
        fetchAllData(); // refresh appointments
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.message || "Could not book appointment." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Please check if the backend is running." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
  };

  const getPatientName = (id) => patients.find(p => p.id === id)?.name || `Patient #${id}`;
  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || `Doctor #${id}`;

  return (
    <div>
      <div className="page-heading fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Appointments Management</h1>
          <p>Schedule new consultations and manage existing patient-doctor appointments.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onPageChange('admin_dashboard')}>
          ← Back to Admin Panel
        </button>
      </div>

      {/* Book Appointment Form */}
      <div className="card fade-up" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header">
          <span className="card-title">📅 Book New Appointment</span>
        </div>
        <div className="card-body">
          {msg && (
            <div className={`alert alert-${msg.type}`} style={{ marginBottom: "1rem" }}>
              {msg.type === "success" ? "✅" : "❌"} {msg.text}
            </div>
          )}

          <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Patient</label>
              <select 
                className="form-input" 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select a patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Doctor</label>
              <select 
                className="form-input" 
                value={doctorId} 
                onChange={(e) => setDoctorId(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select a doctor...</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.name} - {d.specialization}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Appointment Date</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" onClick={addAppointment} disabled={saving}>
              {saving ? <span className="spin">⏳</span> : "📅"}&nbsp; Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card fade-up fade-up-2">
        <div className="card-header">
          <span className="card-title">All Appointments</span>
          <span className="badge badge-purple">{appointments.length} total</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              <span className="spin" style={{ fontSize: "1.5rem" }}>⏳</span>
              <p style={{ marginTop: "0.5rem" }}>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No appointments yet</h3>
              <p>Book your first appointment using the form above.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item, i) => (
                    <tr key={item.id}>
                      <td data-label="#" style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        #{String(item.id || i + 1).padStart(4, "0")}
                      </td>
                      <td data-label="Patient" className="td-bold">
                        {getPatientName(item.patient_id)}
                      </td>
                      <td data-label="Doctor" className="td-bold">
                        Dr. {getDoctorName(item.doctor_id).replace('Dr. ', '')}
                      </td>
                      <td data-label="Date">{formatDate(item.date)}</td>
                      <td data-label="Status">
                        <span className={`badge ${new Date(item.date) >= new Date() ? "badge-green" : "badge-amber"}`}>
                          {new Date(item.date) >= new Date() ? "● Upcoming" : "✓ Past"}
                        </span>
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

export default Appointments;