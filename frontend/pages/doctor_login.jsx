import { useState, useEffect } from "react";
import BASE_URL from "../services/api";

function DoctorLogin({ onPageChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const role = "doctor";

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [timeInputs, setTimeInputs] = useState({});

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
    if (loggedInUser && loggedInUser.role === 'doctor') {
      fetchPortalData();
    }
  }, [loggedInUser]);

  const fetchPortalData = async () => {
    setFetching(true);
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
    } catch (e) { console.error("Portal data fetch failed", e); }
    finally { setFetching(false); }
  };

  const roleColor = 'linear-gradient(135deg, #10b981, #059669)';

  const showMsg = (text, type = "info") => {
    setMessage(text);
    setMsgType(type);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      showMsg("Please enter both username and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
      
      if (isLoginMode) {
        if (response.ok) {
          const user = { username, role: data.role };
          setLoggedInUser(user);
          localStorage.setItem("medicore_admin", JSON.stringify(user));
          localStorage.setItem("role", data.role);
          setMessage(null);
        } else {
          showMsg(data.detail === "Invalid Username or Password" ? "Invalid credentials or account is not registered as a Doctor." : (data.detail || "Login failed"), "error");
        }
      } else {
        showMsg(response.ok ? "Registration submitted! Please wait for admin approval before signing in." : (data.detail || "Registration failed"), response.ok ? "success" : "error");
        if (response.ok) setTimeout(() => setIsLoginMode(true), 2000);
      }
    } catch {
      showMsg(`Connection failed.`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("medicore_admin");
    localStorage.removeItem("role");
  };

  const handleAccept = async (appId) => {
    const time = timeInputs[appId];
    if (!time) {
      showMsg("Please enter a time (e.g., 10:30 AM)", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/appointments/${appId}/accept?time=${encodeURIComponent(time)}`, {
        method: "PUT"
      });
      if (res.ok) {
        showMsg("Appointment accepted and Offer Letter sent!", "success");
        fetchPortalData();
      } else {
        showMsg("Failed to accept appointment", "error");
      }
    } catch {
      showMsg("Connection error", "error");
    }
  };

  const getPatientName = (id) => patients.find(p => p.id === id)?.name || `Patient #${id}`;
  const getPatientProblem = (id) => patients.find(p => p.id === id)?.problem || "—";
  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || `Doctor #${id}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Filter appointments for the logged-in doctor
  const currentDoctor = doctors.find(d => d.name === loggedInUser?.username);
  const myAppointments = appointments.filter(a => !currentDoctor || a.doctor_id === currentDoctor.id);

  if (loggedInUser && loggedInUser.role === 'doctor') {
    return (
      <div className="fade-up" style={{ padding: '1rem' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ 
            background: roleColor, 
            padding: '1.5rem 2rem', 
            borderRadius: '20px 20px 0 0', 
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="avatar" style={{ width: 48, height: 48, background: '#fff', color: '#059669', fontSize: '1rem' }}>DR</div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Dr. {loggedInUser.username}</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Doctor Portal | Active Session</p>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Logout</button>
          </div>
          
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>📋 Patient Appointment List</h3>
              <button onClick={fetchPortalData} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
                {fetching ? 'Refreshing...' : '🔄 Refresh List'}
              </button>
            </div>

            {fetching && myAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <span className="spin" style={{ fontSize: '2rem' }}>⏳</span>
                <p>Loading your schedule...</p>
              </div>
            ) : myAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3>No appointments found</h3>
                <p>There are currently no patients assigned to you.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Medical Problem</th>
                      <th>Date</th>
                      <th>Timing</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAppointments.map((item, i) => (
                      <tr key={item.id || i}>
                        <td className="td-bold">{getPatientName(item.patient_id)}</td>
                        <td>{getPatientProblem(item.patient_id)}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.time || "Not Set"}</td>
                        <td>
                          <span className={`badge ${item.status === 'Accepted' ? "badge-green" : "badge-amber"}`}>
                            {item.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {item.status !== 'Accepted' ? (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <input 
                                type="text" 
                                placeholder="e.g. 10:00 AM" 
                                className="form-input" 
                                style={{ width: '120px', padding: '4px 8px', fontSize: '0.8rem' }}
                                value={timeInputs[item.id] || ""}
                                onChange={(e) => setTimeInputs({...timeInputs, [item.id]: e.target.value})}
                              />
                              <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleAccept(item.id)}>Accept & Send Offer</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Confirmed</span>
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
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>Doctor {isLoginMode ? 'Login' : 'Registration'}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '2rem', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
          {message && <div className={`alert alert-${msgType}`} style={{ marginBottom: '1rem' }}>{message}</div>}
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={loading} style={{ background: '#10b981' }}>
            {loading ? '...' : isLoginMode ? 'Sign In' : 'Register'}
          </button>

          <button className="btn btn-ghost btn-full" style={{ marginTop: '1rem' }} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;