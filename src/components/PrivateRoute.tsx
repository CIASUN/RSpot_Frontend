import { Navigate, Outlet } from 'react-router-dom';

function getUserRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (
      payload["role"] ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  } catch {
    return null;
  }
}

const PrivateRoute = ({ requiredRole }: { requiredRole?: string }) => {
  const token = localStorage.getItem('token');
  const role = getUserRoleFromToken(token);

  if (!token) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default PrivateRoute;
