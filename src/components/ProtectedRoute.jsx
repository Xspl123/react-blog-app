import { Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
 
  return isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
