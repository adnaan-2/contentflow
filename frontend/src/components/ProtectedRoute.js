import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Update import syntax

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isValidToken = (token) => {
    try {
      const decoded = jwtDecode(token); // Use imported jwtDecode
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  if (!token || !isValidToken(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;