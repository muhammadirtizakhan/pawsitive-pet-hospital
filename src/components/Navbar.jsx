'use client';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">
          <i className="fa-solid fa-paw"></i>
        </div>
        <div className="logo-text">
          <h2>Pawsitive Clinic</h2> <span>Pets Doctor</span>
        </div>
      </div>
      <div className="nav-links" id="navLinks">
        <a href="#" data-page="home" className="active">
          Home
        </a>{' '}
        <a href="#" data-page="about">
          About
        </a>{' '}
        <a href="#" data-page="services">
          Services
        </a>{' '}
       <a href="#" data-page="shop">
  Shop
</a>{' '}
<a href="#" data-page="guide">
  Guide
</a>{' '}
        <a href="#" data-page="contact">
          Contact
        </a>
      </div>
      <div className="right">
        {/* Wishlist Icon */}
        <div
          className="icon wishlist-icon"
          onClick={() => window.showPage('wishlist')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fa-regular fa-heart"></i>
          <div className="badge" id="wishlistBadge" style={{ display: 'none' }}>
            0
          </div>
        </div>
        {/* Cart Icon */}
        <div className="icon cart-icon" onClick={() => window.showPage('cart')} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-bag-shopping"></i>
          <div className="badge" id="cartBadge">
            0
          </div>
        </div>
        {/* Profile / Login */}
        <div className="profile-wrapper" id="profileWrapper">
          {/* Login Button (hidden when logged in) */}
          <button className="login-btn" id="loginBtn" onClick={() => window.openAuth()}>
            <i className="fa-regular fa-circle-user"></i>
            Login
          </button>
          {/* Dashboard Button */}
          <button
            className="dashboard-btn"
            id="dashboardBtn"
            onClick={() => window.handleDashboardClick()}
            style={{ display: 'none' }}
          >
            <i className="fa-solid fa-gauge-high"></i>
            <span id="dashboardName">Dashboard</span>
            <i className="fa-solid fa-chevron-down dashboard-arrow" id="dashboardArrow"></i>
          </button>
          {/* Dropdown */}
          <div className="profile-dropdown" id="profileDropdown">
            <div className="dropdown-header">
              <div className="user-name" id="dropdownName">
                John Doe
              </div>
              <div className="user-email" id="dropdownEmail">
                john@example.com
              </div>
            </div>{' '}
            <button className="dropdown-item" onClick={() => window.showProfileSection('profile')}>
              <i className="fa-regular fa-user"></i>
              My Profile
            </button>{' '}
            <button className="dropdown-item" onClick={() => window.showOrders()}>
              <i className="fa-solid fa-box-open"></i>
              My Orders
            </button>{' '}
            <button className="dropdown-item" onClick={() => window.showProfileSection('change-name')}>
              <i className="fa-regular fa-pen-to-square"></i>
              Change Name
            </button>{' '}
            <button className="dropdown-item" onClick={() => window.showProfileSection('change-password')}>
              <i className="fa-solid fa-lock"></i>
              Change Password
            </button>{' '}
            <div className="dropdown-divider"></div>{' '}
            <button className="dropdown-item logout" onClick={() => window.logoutUser()}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </div>
        <div className="menu-btn" id="menuBtn">
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}
