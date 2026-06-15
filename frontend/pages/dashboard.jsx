import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';

function Dashboard({ setActivePage, onPageChange }) {
  const [stats, setStats] = useState({ doctors: 0, appointments: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) { console.error("Failed to fetch stats", err); }
    };
    fetchStats();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'radial-gradient(circle at top right, #f8fafc, #e2e8f0)',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: isMobile ? '40px 15px' : '80px 20px 40px',
      perspective: '1000px'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        backgroundColor: '#fff',
        padding: isMobile ? '2rem 1.25rem' : '60px',
        borderRadius: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05)',
        transform: isMobile ? 'none' : 'rotateX(2deg)',
        transition: 'transform 0.5s ease',
        border: '1px solid rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        marginBottom: '30px'
      }}>
        <div style={{ 
          fontSize: isMobile ? '3.5rem' : '5rem', 
          marginBottom: '20px',
          filter: 'drop-shadow(0 10px 10px rgba(37, 99, 235, 0.2))'
        }}>🏥</div>
        <h1 style={{ color: '#1e293b', fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
          Welcome
        </h1>
        <h2 style={{ color: '#2563eb', fontSize: isMobile ? '1.25rem' : '1.75rem', fontWeight: '900', marginBottom: '16px' }}>
          Hospital Managment System
        </h2>
        <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.15rem', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Your all-in-one solution for hospital management. Streamlining patient care,
          doctor schedules, and administrative tasks in one secure environment.
        </p>

        
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center', 
          gap: isMobile ? '1rem' : '60px', 
          marginBottom: '40px',
          padding: isMobile ? '1.5rem' : '24px',
          background: 'linear-gradient(145deg, #f1f5f9, #ffffff)',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'inset 5px 5px 10px #e2e8f0, inset -5px -5px 10px #ffffff'
        }}>
          <div>
            <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '900', color: '#2563eb', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>{stats.doctors}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Doctors</div>
          </div>
          {!isMobile && <div style={{ width: '2px', backgroundColor: '#cbd5e1', borderRadius: '2px' }}></div>}
          <div>
            <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '900', color: '#7c3aed', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>{stats.appointments}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Appointments</div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <span style={{ 
            fontSize: isMobile ? '0.8rem' : '0.9rem', 
            color: '#1e40af', 
            fontWeight: '600', 
            backgroundColor: '#dbeafe', 
            padding: isMobile ? '6px 15px' : '8px 20px', 
            borderRadius: '100px',
            border: '1px solid #bfdbfe',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <span>🔑</span> Please sign in first to access your secure portal
          </span>
        </div>

        <button 
          onClick={() => (setActivePage ? setActivePage('portals') : onPageChange('portals'))}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.5)',
            transform: 'translateZ(20px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateZ(30px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(37, 99, 235, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateZ(20px) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(37, 99, 235, 0.5)';
          }}
        >
          Open Login Portals
        </button>
      </div>

      {/* Simple centered nav/title bar placed below the hero card */}
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          justifyContent: 'center',
          margin: isMobile ? '26px 0 10px' : '40px 0 10px',
        }}
      >
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(8,145,178,0.08))',
            border: '1px solid rgba(226,232,240,1)',
            borderRadius: '16px',
            padding: isMobile ? '14px 16px' : '18px 22px',
            boxShadow: '0 12px 30px rgba(2,6,23,0.06)',
            textAlign: 'center',
          }}
        >
          <span style={{
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            fontWeight: 900,
            color: '#1e293b',
            letterSpacing: '-0.01em',
          }}>
            Hospital Management System
          </span>
        </div>
      </div>

      <footer style={{
        width: '100%',
        maxWidth: '1000px',
        padding: isMobile ? '30px 10px' : '40px 20px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: isMobile ? '20px' : '40px', textAlign: 'left' }}>
          <div style={{ flex: '2', minWidth: '280px' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '12px' }}>MediCore HMS</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Providing a secure, efficient, and user-friendly digital environment for modern 
              hospital operations. Our mission is to enhance healthcare delivery through 
              intelligent technology.
            </p>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <h4 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '12px' }}>Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Patient Access</li>
              <li>Staff & Doctor Login</li>
              <li>Admin Control Panel</li>
            </ul>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <h4 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '12px' }}>Support</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>support@medicore.com</p>
            <p style={{ fontSize: '0.9rem', margin: '4px 0 0' }}>+1 (555) 123-4567</p>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          © 2024 MediCore Hospital Management System. Secure Digital Healthcare.
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;