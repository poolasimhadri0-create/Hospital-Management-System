import { useState } from "react";
import BASE_URL from "../services/api";

function Login({ onPageChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role] = useState("admin"); 
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const saved = localStorage.getItem("medicore_admin");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user data", e);
      return null;
    }
  });

  const roleColors = {
    admin: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    doctor: 'linear-gradient(135deg, #10b981, #059669)',
    patient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  };

  const roleIcons = {
    admin: '🔑',
    doctor: '👨‍⚕️',
    patient: '🧑‍🤝‍🧑',
  };

  const roleLabels = {
    admin: 'Admin',
    doctor: 'Doctor',
    patient: 'Patient',
  };

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
          onPageChange('admin_dashboard');
          setMessage(null);
        } else {
          showMsg(data.message || data.detail || "Login failed", "error");
        }
      } else {
        showMsg(data.message || data.detail || "Account created successfully! You can now log in.", response.ok ? "success" : "error");
        if (response.ok) {
           // Automatically switch back to login mode after successful registration
           setTimeout(() => {
             setIsLoginMode(true);
             setMessage(null);
             setPassword("");
           }, 2000);
        }
      }
    } catch {
      showMsg(`Backend connection failed. Is the server running?`, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage(null);
    setPassword("");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("medicore_admin");
    localStorage.removeItem("role");
    setUsername("");
    setPassword("");
    setMessage(null);
  };

  if (loggedInUser && loggedInUser.role === 'admin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{
            background: roleColors[loggedInUser.role] || 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '20px 20px 0 0',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            color: '#fff',
          }}>
            <div className="avatar" style={{
              width: 72, height: 72, fontSize: '1.75rem', margin: '0 auto 1rem',
              background: '#fff', color: 'var(--green)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {loggedInUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {loggedInUser.username}!</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: 4 }}>
              You are securely logged into the {roleLabels[loggedInUser.role]} Portal.
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
             <span className="badge" style={{ 
               background: loggedInUser.role === 'admin' ? '#dbeafe' : loggedInUser.role === 'doctor' ? '#dcfce7' : '#f3e8ff',
               color: loggedInUser.role === 'admin' ? '#1e40af' : loggedInUser.role === 'doctor' ? '#166534' : '#6b21a8',
               fontWeight: 'bold',
               textTransform: 'uppercase',
               letterSpacing: '0.05em'
             }}>
               Role: {loggedInUser.role}
             </span>
          </div>
          <div style={{ 
            background: '#fff',
            borderRadius: '0 0 20px 20px',
            padding: '2rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
            textAlign: 'center'
          }}>
            <button className="btn btn-primary btn-full btn-lg" style={{ marginBottom: '1rem' }} onClick={() => onPageChange('admin_dashboard')}>
              🚀 Go to Dashboard
            </button>
            <button className="btn btn-ghost btn-full btn-lg" onClick={handleLogout}>
              🚪 &nbsp;Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header card */}
        <div style={{
          position: 'relative',
          background: roleColors[role],
          borderRadius: '20px 20px 0 0',
          padding: '2rem',
          textAlign: 'center',
          color: '#fff',
        }}>
          <button 
            onClick={() => onPageChange('portals')}
            style={{
              position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.2)', 
              border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '4px 8px', fontSize: '0.8rem'
            }}
          >← Back</button>
          <div style={{
            width: 56, height: 56,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 0.75rem',
            backdropFilter: 'blur(8px)',
          }}>{isLoginMode ? roleIcons[role] : '✨'}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {isLoginMode ? `${roleLabels[role]} Login` : 'Create Account'}
          </div>
          <div style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: 4 }}>
            MediCore Hospital Management System
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background: '#fff',
          borderRadius: '0 0 20px 20px',
          padding: '2rem',
          boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
        }}>
          {message && (
            <div className={`alert alert-${msgType}`} style={{ marginBottom: '1.25rem' }}>
              {msgType === 'success' ? '✅' : msgType === 'error' ? '❌' : 'ℹ️'} {message}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPwd ? "text" : "password"}
                placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: '3rem' }}
                autoComplete={isLoginMode ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#94a3b8',
                }}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="submit-btn"
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? <span className="spin">⏳</span> : (isLoginMode ? '🔓' : '✨')} &nbsp;
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </button>

          <div className="login-divider">or</div>

          <button
            id="toggle-mode-btn"
            className="btn btn-ghost btn-full"
            onClick={toggleMode}
            disabled={loading}
          >
            {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Sign in"}
          </button>

          <p style={{
            fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '1.5rem',
          }}>
            🔒 Your credentials are securely encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;