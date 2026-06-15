import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';

function AdminDashboard({ onPageChange }) {
  const [stats, setStats] = useState({ doctors: 0, appointments: 0, patients: 0 });
  const isMobile = window.innerWidth < 768;

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

  const adminOptions = [
    {
      id: 'doctors',
      title: 'Doctors Management',
      description: 'Add, update, or remove doctors from the system.',
      icon: '👨‍⚕️',
      color: '#2563eb'
    },
    {
      id: 'patients',
      title: 'Patient Records',
      description: 'View registered patients and their medical history.',
      icon: '🧑‍🤝‍🧑',
      color: '#0891b2'
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Monitor and schedule doctor-patient consultations.',
      icon: '📅',
      color: '#7c3aed'
    },
    {
      id: 'doctor_approvals',
      title: 'Doctor Approvals',
      description: 'Review and approve new doctor account requests.',
      icon: '✅',
      color: '#10b981'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("medicore_admin");
    localStorage.removeItem("role");
    onPageChange('dashboard');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-heading" style={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>Administration Panel</h1>
          <p style={{ color: '#64748b' }}>Welcome back, System Administrator</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: isMobile ? '100%' : 'auto', marginTop: isMobile ? '1rem' : 0, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => onPageChange('portals')}
          >← Back to Portals</button>
          <div style={{ textAlign: 'right', marginRight: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Portal Status</div>
            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '600' }}>● All Systems Operational</div>
          </div>
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
            style={{ padding: '10px 20px' }}
          >
            Logout Session
          </button>
        </div>
      </div>

      {/* System Statistics Overview */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '2.5rem' }}>👨‍⚕️</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Doctors</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.doctors}</div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #7c3aed', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '2.5rem' }}>📅</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booked Appointments</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.appointments}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #0891b2', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '2.5rem' }}>🧑‍🤝‍🧑</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Patients</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.patients}</div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px' 
      }}>
        {adminOptions.map((option) => (
          <div 
            key={option.id}
            onClick={() => onPageChange(option.id)}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = option.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ 
              fontSize: '40px', 
              marginBottom: '20px',
              width: '70px',
              height: '70px',
              backgroundColor: `${option.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>{option.icon}</div>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '10px' }}>{option.title}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;