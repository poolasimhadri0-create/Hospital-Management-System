import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';
import ThreeDAnimation from '../components/ThreeDAnimation';

function Dashboard({ onPageChange }) {
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
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'radial-gradient(circle at top right, #f8fafc, #e2e8f0)',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'center',
        padding: isMobile ? '40px 15px' : '80px 20px 40px',
        perspective: '1000px',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '30px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* 3D Animation Background */}
        {/* 3D Animation Background (disabled) */}
        {/* <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <ThreeDAnimation />
        </div> */}

        {/* Content Overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          }}
        >
          {/* Hospital Icon */}
          <div
            style={{
              fontSize: isMobile ? '3.5rem' : '5rem',
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '20px',
              display: 'inline-block',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              animation: 'medicore-bounce 1.4s ease-in-out infinite',
              transformOrigin: '50% 60%',
            }}
          >
            🏥
          </div>

          {/* Welcome Text */}
          <h1
            style={{
              color: '#0f172a',
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: '800',
              marginBottom: '10px',
              textShadow: '0 2px 15px rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'inline-block',
            }}
          >
            Welcome
          </h1>

          {/* Hospital Management System */}
          <h2
            style={{
              color: '#1e40af',
              fontSize: isMobile ? '1.25rem' : '1.75rem',
              fontWeight: '900',
              marginBottom: '16px',
              textShadow: '0 2px 10px rgba(255, 255, 255, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'inline-block',
            }}
          >
            Hospital Management System
          </h2>

          {/* Description */}
          <p
            style={{
              color: '#1e293b',
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              lineHeight: '1.6',
              marginBottom: '40px',
              maxWidth: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              padding: '15px 20px',
              borderRadius: '12px',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Your all-in-one solution for hospital management. Streamlining patient care,
            doctor schedules, and administrative tasks in one secure environment.
          </p>

          {/* Stats Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              gap: isMobile ? '1rem' : '60px',
              marginBottom: '40px',
              padding: isMobile ? '1.5rem' : '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  fontWeight: '900',
                  color: '#2563eb',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {stats.doctors}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                Total Doctors
              </div>
            </div>

            {!isMobile && (
              <div
                style={{
                  width: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '2px',
                }}
              />
            )}

            <div>
              <div
                style={{
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  fontWeight: '900',
                  color: '#7c3aed',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {stats.appointments}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#1e293b',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                Appointments
              </div>
            </div>
          </div>

          {/* Sign-in Message */}
          <div style={{ marginBottom: '30px' }}>
            <span
              style={{
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                color: '#1e40af',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                padding: isMobile ? '10px 18px' : '12px 24px',
                borderRadius: '100px',
                border: '2px solid #2563eb',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                backdropFilter: 'blur(5px)',
              }}
            >
              <span>🔑</span> Please sign in first to access your secure portal
            </span>
          </div>

          {/* Open Login Portals Button */}
          <button
            onClick={() => onPageChange('portals')}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              padding: isMobile ? '12px 28px' : '16px 40px',
              borderRadius: '12px',
              fontSize: isMobile ? '0.95rem' : '1.15rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.6)',
              transform: 'scale(1)',
              zIndex: 50,
              position: 'relative',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.6)';
            }}
          >
            Open Login Portals
          </button>
        </div>
      </div>

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
          <span
            style={{
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              fontWeight: 900,
              color: '#1e293b',
              letterSpacing: '-0.01em',
            }}
          >
            Hospital Management System
          </span>
        </div>
      </div>

      <footer
        style={{
          width: '100%',
          maxWidth: '1000px',
          padding: isMobile ? '30px 10px' : '40px 20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          color: '#64748b',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '20px' : '40px',
            textAlign: 'left',
          }}
        >
          <div style={{ flex: '2', minWidth: '280px' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '12px' }}>MediCore HMS</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Providing a secure, efficient, and user-friendly digital environment for modern hospital
              operations. Our mission is to enhance healthcare delivery through intelligent technology.
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

