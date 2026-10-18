'use client';

export default function ProfileModal() {
  return (
    <div className="auth-overlay" id="profileOverlay">
      <div className="auth-modal">
        <button className="close-btn" id="closeProfile">
          <i className="fa-solid fa-xmark"></i>
        </button>{' '}
        <div className="auth-logo">
          <div className="logo-icon">
            <i className="fa-regular fa-user"></i>
          </div>
          <div>
            <h2 id="profileOverlayTitle">My Profile</h2>{' '}
            <span id="profileOverlaySub">Manage your account details</span>
          </div>
        </div>
        {/* My Profile */}
        <div id="profileSection">
          <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#FF8A00,#FF5E2E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '32px',
                color: '#fff',
                fontWeight: '700',
                fontFamily: "'Poppins',sans-serif",
              }}
              id="profileDisplayAvatar"
            >
              J
            </div>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", color: '#1a1a2e' }} id="profileDisplayName">
              John Doe
            </h3>
            <p
              style={{ color: '#6B7280', fontFamily: "'Poppins',sans-serif", fontSize: '14px' }}
              id="profileDisplayEmail"
            >
              john@example.com
            </p>
            <p
              style={{
                color: '#9ca3af',
                fontFamily: "'Poppins',sans-serif",
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              Member since 2026
            </p>
          </div>
        </div>
        {/* Change Name */}
        <div id="changeNameSection" className="profile-settings-section" style={{ display: 'none' }}>
          <div className="form-group">
            <label>Current Name</label>{' '}
            <div className="input-wrapper">
              <i className="fa-regular fa-user"></i> <input type="text" id="currentNameDisplay" disabled />
            </div>
          </div>
          <div className="form-group">
            <label>New Name</label>{' '}
            <div className="input-wrapper">
              <i className="fa-regular fa-pen-to-square"></i>{' '}
              <input type="text" placeholder="Enter new name" id="newNameInput" />
            </div>
          </div>
          <button className="submit-btn" onClick={() => window.updateName()}>
            <i className="fa-regular fa-check" style={{ marginRight: '10px' }}></i>
            {' Update Name'}
          </button>
        </div>
        {/* Change Password */}
        <div id="changePasswordSection" className="profile-settings-section" style={{ display: 'none' }}>
          <div className="form-group">
            <label>Current Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input type="password" placeholder="Enter current password" id="currentPasswordInput" />
            </div>
          </div>
          <div className="form-group">
            <label>New Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input type="password" placeholder="Enter new password" id="newPasswordInput" />
            </div>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input type="password" placeholder="Confirm new password" id="confirmPasswordInput" />
            </div>
          </div>
          <button className="submit-btn" onClick={() => window.updatePassword()}>
            <i className="fa-solid fa-key" style={{ marginRight: '10px' }}></i>
            {' Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
