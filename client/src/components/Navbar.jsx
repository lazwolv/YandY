import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // TODO: Implement i18n language switching
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/images/LOGO-DEF-POS.png" alt="Y&Y Beauty Salon" width="100" height="58" />
      </Link>

      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        onClick={toggleMenu}
      >
        <span className="burger-icon"></span>
      </button>

      <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/book">Book Now</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>

      <select
        id="languageSelect"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </nav>
  );
};

export default Navbar;
