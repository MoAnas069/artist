import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingState from '../ui/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState message="Authenticating" />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
