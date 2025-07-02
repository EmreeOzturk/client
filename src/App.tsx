import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/admin/DashboardLayout';
import UsersPage from './pages/admin/UsersPage';
import OrdersPage from './pages/admin/OrdersPage';
import CorsClientsPage from './pages/admin/CorsClientsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes with new Layout */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="cors-clients" element={<CorsClientsPage />} />
        </Route>

        <Route path="/" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App; 