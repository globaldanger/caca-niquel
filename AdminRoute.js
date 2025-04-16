import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser?.isAdmin ? children : <Navigate to="/" />;
}