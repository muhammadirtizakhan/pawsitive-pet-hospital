export default function AuthModal() {
  return (
    <div className="auth-overlay" id="authOverlay">
      <div className="auth-modal">
        <button className="close-btn" id="closeAuth">
          <i className="fa-solid fa-xmark"></i>
        </button>{' '}
        <div className="auth-logo">
         <div className="logo-icon" style={{ overflow: 'hidden', padding: 0 }}>
  <img
    src="https://res.cloudinary.com/djaonuvzx/image/upload/v1792352038/WhatsApp_Image_2026-10-19_at_12.29.45_AM-removebg-preview_zaza5i.png"
    alt="Pawsitive Clinic"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
      display: 'block'
    }}
  />
</div>
          <div>
            <h2>Pawsitive Clinic</h2> <span>Pets Doctor</span>
          </div>
        </div>
        <div className="auth-title">
          <h3 id="authTitle">Welcome Back!</h3>
          <p id="authSubtitle">Sign in to continue to your account</p>
        </div>
        <div className="auth-tabs">
          <button className="active" data-tab="login">
            Login
          </button>
          <button data-tab="register">Register</button>
        </div>
        <form className="auth-form active" id="loginForm">
          <div className="form-group">
            <label>Email Address</label>{' '}
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope"></i>{' '}
              <input type="email" placeholder="you@example.com" id="loginEmail" required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input type="password" placeholder="Enter your password" id="loginPassword" required />
            </div>
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" />
              {' Remember me'}
            </label>
            <a href="#">Forgot password?</a>
          </div>{' '}
          <button type="submit" className="submit-btn" id="loginSubmit">
            <i className="fa-regular fa-circle-user" style={{ marginRight: '10px' }}></i>
            {' Sign In'}
          </button>{' '}
          <div className="switch-text">
            {"Don't have an account? "}
            <span id="switchToRegister">Sign Up</span>
          </div>
        </form>
        <form className="auth-form" id="registerForm">
          <div className="form-group">
            <label>Full Name</label>{' '}
            <div className="input-wrapper">
              <i className="fa-regular fa-user"></i>{' '}
              <input type="text" placeholder="John Doe" id="registerName" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>{' '}
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope"></i>{' '}
              <input type="email" placeholder="you@example.com" id="registerEmail" required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input type="password" placeholder="Create a password" id="registerPassword" required />
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>{' '}
            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>{' '}
              <input
                type="password"
                placeholder="Confirm your password"
                id="registerConfirmPassword"
                required
              />
            </div>
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" required />
              {' I agree to the Terms & Conditions'}
            </label>
          </div>{' '}
          <button type="submit" className="submit-btn" id="registerSubmit">
            <i className="fa-regular fa-user" style={{ marginRight: '10px' }}></i>
            {' Create Account'}
          </button>{' '}
          <div className="switch-text">
            {'Already have an account? '}
            <span id="switchToLogin">Sign In</span>
          </div>
        </form>
      </div>
    </div>
  );
}
