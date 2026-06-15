import React from 'react';

function PortalSelection({ onPageChange }) {
  const portals = [
    {
      id: 'admin_login',
      title: 'Admin Portal',
      description: 'Access hospital administration, staff management, and system settings.',
      icon: '🔐',
      accent: '#4f46e5'
    },
    {
      id: 'doctor_login',
      title: 'Doctor Portal',
      description: 'Manage your patient list, view schedules, and update medical records.',
      icon: '🩺',
      accent: '#0891b2'
    },
    {
      id: 'patient_login',
      title: 'Patient Portal',
      description: 'Book appointments, view your medical history, and contact your doctor.',
      icon: '👤',
      accent: '#059669'
    }
  ];

  return (
    <div className="portal-selection-page">
      <div className="portal-selection-hero">
        <h1 className="portal-selection-title">MediCore Systems</h1>
        <p className="portal-selection-subtitle">
          Select a portal to access your dashboard
        </p>
      </div>

      <div className="portals-grid">
        {portals.map((portal, idx) => (
          <div
            key={portal.id}
            className="portal-card"
            data-accent={portal.accent}
            style={{ ['--portal-accent']: portal.accent, ['--portal-delay']: `${idx * 0.08}s` }}
            onClick={() => onPageChange(portal.id)}

            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? onPageChange(portal.id) : null)}
          >
            <div className="portal-card-glow" />

            <div className="portal-icon" aria-hidden="true">
              {portal.icon}
            </div>
            <h2 className="portal-card-title">{portal.title}</h2>
            <p className="portal-card-desc">{portal.description}</p>

            <div className="portal-card-foot">
              <span className="portal-card-cta">Enter portal</span>
              <span className="portal-card-arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="portal-selection-back">
        <button className="portal-back-btn" onClick={() => onPageChange('dashboard')}>
          ← Back to Main Dashboard
        </button>
      </div>
    </div>
  );
}

export default PortalSelection;

