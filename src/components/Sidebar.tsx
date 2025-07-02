import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard/users" className="nav-link">
          Users
        </NavLink>
        <NavLink to="/admin/dashboard/orders" className="nav-link">
          Orders
        </NavLink>
        <NavLink to="/admin/dashboard/cors-clients" className="nav-link">
          CORS Clients
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 