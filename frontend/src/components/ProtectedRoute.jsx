import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingState } from "./Common";
export function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState text="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/customer"}
        replace
      />
    );
  return <Outlet />;
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState text="Checking your session..." />;
  if (user) {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin/dashboard"
            : "/customer/tickets/create"
        }
        replace
      />
    );
  }
  return children;
}
