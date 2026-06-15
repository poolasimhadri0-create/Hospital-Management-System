import { useState, useEffect } from "react";
import BASE_URL from "../services/api";

function PatientLogin({ onPageChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const role = "patient";

  // Portal States
  const [myProfile, setMyProfile] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showLetter, setShowLetter] = useState(null);
  const [showWelcomeLetter, setShowWelcomeLetter] = useState(null);

  // New Plan: Appointment Management State
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [selDoc, setSelDoc] = useState("");
  const [bookDate, setBookDate] = useState("");

  // Profile Registration State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [problem, setProblem] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const saved = localStorage.getItem("medicore_admin");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user data", e);
      return null;
    }
  });

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === 'patient') {
      fetchPatientData();
    }
  }, [loggedInUser]);

  const fetchPatientData = async () => {
    try {
      const [profRes, appRes, docRes, patRes] = await Promise.all([
        fetch(`${BASE_URL}/patients/me/${loggedInUser.username}`),
        fetch(`${BASE_URL}/appointments/me/${loggedInUser.username}`),
        fetch(`${BASE_URL}/doctors/`),
        fetch(`${BASE_URL}/patients/`)
      ]);
      const profData = await profRes.json();
      const appData = await appRes.json();
      const docData = await docRes.json();
      const patData = await patRes.json();

      if (profData && !profData.detail) setMyProfile(profData);
      if (Array.isArray(appData)) setMyAppointments(appData);
      if (Array.isArray(docData)) setDoctors(docData);
      if (Array.isArray(patData)) setPatients(patData);
    } catch (e) {
      console.error("Failed to load portal data", e);
    }
  };

  const roleColor = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        // Non-JSON response (common for 403/404 with plain text)
        data = { message: `Server returned status ${response.status}` };
      }

      if (isLoginMode && response.ok) {
        const user = { id: data.id, username, role: data.role };
        setLoggedInUser(user);
        localStorage.setItem("medicore_admin", JSON.stringify(user));
        localStorage.setItem("role", data.role);
        setMessage(null);
      } else {
        const detail = data?.detail || data?.message;
        setMessage(
          detail === "Invalid Username or Password"
            ? "Invalid credentials or account is not registered as a Patient."
            : detail || "Action failed"
        );
        setMsgType(response.ok ? "success" : "error");
        if (response.ok && !isLoginMode) setTimeout(() => setIsLoginMode(true), 2000);
      }
    } catch {
      setMessage("Server connection failed");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };


  const addPatient = async () => {
    if (!name.trim() || !age || !gender || !problem.trim() || !address.trim() || !hospitalName.trim()) {
      setMessage("Please fill in all fields including Hospital Name.");
      setMsgType("error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: parseInt(age), gender, problem, address, hospital_name: hospitalName }),
      });
      if (res.ok) {
        const registeredPatient = { name, problem, hospitalName };
        setName(""); setAge(""); setGender(""); setProblem(""); setAddress(""); setHospitalName("");
        setMessage(`${registeredPatient.name} registered! View your Admission Offer Letter below.`);
        setMsgType("success");
        setShowWelcomeLetter(registeredPatient);
        fetchPatientData();
      } else {
        const err = await res.json();
        setMessage(err.message || "Could not register patient.");
        setMsgType("error");
      }
    } catch {
      setMessage("Network error. Check if backend is running.");
      setMsgType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleBookApp = async () => {
    if (!patientId || !selDoc || !bookDate) {
      setMessage("Please select a patient, a doctor, and a date.");
      setMsgType("error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: Number(patientId), doctor_id: Number(selDoc), date: bookDate }),
      });
      if (res.ok) {
        setMessage("Appointment booked successfully!");
        setMsgType("success");
        setPatientId(""); setSelDoc(""); setBookDate("");
        fetchPatientData();
      } else { setMessage("Booking failed", "error"); }
    } catch { setMessage("Connection error", "error"); }
    finally { setLoading(false); }
  };

  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || `Doctor #${id}`;

  // Used by some inline styles below; define so PatientLogin doesn't crash.
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const handleLogout = () => {

    setLoggedInUser(null);
    localStorage.removeItem("medicore_admin");
    localStorage.removeItem("role");
  };

  if (loggedInUser && loggedInUser.role === 'patient') {
    return (
      <div className="fade-up" style={{ padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: roleColor, padding: '1.25rem 1.5rem', borderRadius: '20px 20px 0 0', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Patient Portal</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>Welcome, {loggedInUser.username}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost" onClick={() => onPageChange("admin_login")} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '5px 10px' }}>🛡️ Admin Portal</button>
              <button className="btn btn-ghost" onClick={() => onPageChange("doctor_login")} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '5px 10px' }}>🩺 Doctor Portal</button>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '5px 10px', fontWeight: 'bold' }}>🚪 Logout</button>
            </div>
          </div>

          <div className="card-body">
            {showLetter ? (
              <div className="fade-up" style={{ padding: '2rem', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '15px', position: 'relative' }}>
                <button 
                  onClick={() => setShowLetter(null)} 
                  style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                >✕</button>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ color: '#7c3aed', marginBottom: '5px' }}>Consultation Offer Letter</h2>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>City General Hospital | Department of Clinical Excellence</p>
                  <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />
                </div>
                
                <div style={{ fontSize: '1rem', lineHeight: '1.6', color: '#1e293b' }}>
                  <p><strong>To,</strong><br />{myProfile?.name || loggedInUser.username}</p>
                  <p>Dear Patient,</p>
                  <p>We are pleased to inform you that your request for a medical consultation has been reviewed and <strong>Accepted</strong>.</p>
                  
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0', borderLeft: '4px solid #7c3aed' }}>
                    <p style={{ margin: '0 0 10px 0' }}><strong>Consultant:</strong> Dr. {getDoctorName(showLetter.doctor_id)}</p>
                    <p style={{ margin: '10px 0 10px 0' }}><strong>Appointment Date:</strong> {showLetter.date}</p>
                    <p style={{ margin: '10px 0 0 0' }}><strong>Assigned Time Slot:</strong> <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>{showLetter.time}</span></p>
                  </div>

                  <p>Please ensure you are present at the reception desk at least 15 minutes before your scheduled time. Carry your hospital ID and any relevant previous medical reports.</p>
                  
                  <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                    <p style={{ marginBottom: '5px' }}>Sincerely,</p>
                    <p style={{ fontWeight: 'bold', margin: '0' }}>Medical Administration</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>MediCore Digital System</p>
                  </div>
                </div>
                <button className="btn btn-primary btn-full" style={{ marginTop: '2rem' }} onClick={() => setShowLetter(null)}>Back to Dashboard</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="page-heading fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                  <div>
                    <h1>Patients Management</h1>
                    <p>Register new patients and view existing records in the hospital system.</p>
                  </div>
                  <button className="btn btn-ghost" onClick={() => onPageChange('admin_dashboard')}>
                    ← Back to Admin Panel
                  </button>
                </div>

                {message && <div className={`alert alert-${msgType}`} style={{ marginBottom: '0.5rem' }}>{message}</div>}

                {/* Admission Offer Letter (Visible after registration) */}
                {showWelcomeLetter && (
                  <div className="card fade-up" style={{ padding: '2rem', background: '#fff', border: '2px solid #10b981', borderRadius: '15px', position: 'relative', marginBottom: '1.5rem' }}>
                    <button onClick={() => setShowWelcomeLetter(null)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h2 style={{ color: '#10b981', marginBottom: '5px' }}>Official Admission Offer</h2>
                      <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Welcome to MediCore Health Systems</p>
                      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />
                    </div>
                    <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1e293b' }}>
                      <p>Dear <strong>{showWelcomeLetter.name}</strong>,</p>
                      <p>We are pleased to offer you admission to the medical care program at <strong>{showWelcomeLetter.hospitalName}</strong>. Your registration has been successfully processed.</p>
                      <p>At MediCore, we prioritize your wellbeing. You now have full access to our specialist network and appointment booking services for your medical concern regarding "{showWelcomeLetter.problem}".</p>
                      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>The Medical Board</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>MediCore Digital Administration</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Patient Form */}
                <div className="card fade-up" style={{ marginBottom: "1.5rem" }}>
                  <div className="card-header">
                    <span className="card-title">➕ Register New Patient</span>
                  </div>
                  <div className="card-body">
                    <div className="form-row" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))' }}>
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
                      <button className="btn btn-primary" onClick={addPatient} disabled={loading}>
                        ➕ Register Patient
                      </button>
                    </div>
                  </div>
                </div>

                {/* Book Appointment Form */}
                <div className="card fade-up" style={{ marginBottom: "1.5rem" }}>
                  <div className="card-header">
                    <span className="card-title">📅 Book New Appointment</span>
                  </div>
                  <div className="card-body">
                    <div className="form-row" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Patient</label>
                        <select 
                          className="form-input" 
                          value={patientId} 
                          onChange={(e) => setPatientId(e.target.value)}
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
                          value={selDoc} 
                          onChange={(e) => setSelDoc(e.target.value)}
                        >
                          <option value="">Select a doctor...</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Appointment Date</label>
                        <input
                          className="form-input"
                          type="date"
                          value={bookDate}
                          onChange={(e) => setBookDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: "1.5rem" }}>
                      <button className="btn btn-primary" onClick={handleBookApp} disabled={loading}>
                        📅 Book Appointment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Appointments List */}
                <div className="card fade-up fade-up-2">
                  <div className="card-header">
                    <span className="card-title">📋 Current Appointments</span>
                    <button onClick={fetchPatientData} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>🔄 Refresh</button>
                  </div>
                  <div className="card-body" style={{ padding: 0 }}>
                    {myAppointments.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No upcoming appointments found.</div>
                    ) : (
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Doctor</th>
                              <th>Date</th>
                              <th>Acceptance Status</th>
                              <th>Acceptance Letter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myAppointments.map(app => (
                              <tr key={app.id}>
                                <td className="td-bold">Dr. {getDoctorName(app.doctor_id)}</td>
                                <td>{app.date}</td>
                                <td>
                                  <span className={`badge ${app.status === 'Accepted' ? "badge-green" : "badge-amber"}`}>
                                    {app.status === 'Accepted' ? `✅ Accepted: ${app.time}` : '⏳ Pending Approval'}
                                  </span>
                                </td>
                                <td>
                                  {app.status === 'Accepted' ? (
                                    <button 
                                      className="btn btn-ghost" 
                                      style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#7c3aed', borderColor: '#7c3aed' }}
                                      onClick={() => setShowLetter(app)}
                                    >
                                      📄 View Offer Letter
                                    </button>
                                  ) : (
                                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Waiting for Doc</span>
                                  )}
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
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ 
          position: 'relative',
          background: roleColor, borderRadius: '20px 20px 0 0', padding: '2rem', textAlign: 'center', color: '#fff' 
        }}>
          <button 
            onClick={() => onPageChange('portals')}
            style={{
              position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.2)', 
              border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '4px 8px', fontSize: '0.8rem'
            }}
          >← Back</button>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧑‍🤝‍🧑</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>Patient {isLoginMode ? 'Login' : 'Registration'}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '2rem', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
          {message && <div className={`alert alert-${msgType}`} style={{ marginBottom: '1rem' }}>{message}</div>}
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={loading} style={{ background: '#8b5cf6' }}>
            {loading ? '...' : isLoginMode ? 'Sign In' : 'Register'}
          </button>

          <button className="btn btn-ghost btn-full" style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? "New patient? Create account" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;