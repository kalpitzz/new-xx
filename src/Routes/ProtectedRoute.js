import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log('allowed : ', allowedRoles, auth.role);
  console.log('validity : ', allowedRoles.includes(auth.role));

  return allowedRoles.includes(auth.role) || auth.onboarding_required ? (
    <Outlet />
  ) : auth.user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  // state={{ from: location }} replace <== for browser to remember where we came from
};

export default ProtectedRoute;
