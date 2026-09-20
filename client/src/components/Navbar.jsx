import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="nav-logo">⚡</div>
        <div>
          <div className="nav-name">UserVault</div>
          <div className="nav-sub">MERN CRUD App</div>
        </div>
      </Link>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          👤 Users
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive }) => `nav-link cta ${isActive ? 'active' : ''}`}
        >
          ➕ Add User
        </NavLink>
      </div>

      <div className="nav-status">
        <div className="status-dot" />
        MongoDB Connected
      </div>
    </nav>
  );
}

export default Navbar;
