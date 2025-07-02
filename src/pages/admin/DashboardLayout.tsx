import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './DashboardLayout.css';
import { useState } from 'react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          &#9776; {/* Hamburger Icon */}
        </button>
        <h3>Admin Panel</h3>
      </div>
      <Sidebar />
      <main className="dashboard-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout; 