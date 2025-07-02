import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check for the auth token in localStorage
  const authToken = localStorage.getItem('authToken');

  // If token exists, render child routes, otherwise redirect to login
  if (!authToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 