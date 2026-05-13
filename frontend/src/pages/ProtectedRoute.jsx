import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import * as s from "../styles/common";

function ProtectedRoute({ children, adminOnly = false, adminForbidden = false }) {
  const { isAuthenticated, isCheckingAuth, currentUser } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className={s.loadingCenter}>
        <div className={s.loadingSpinner}></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) return <Navigate to="/" replace />;
  if (adminOnly && !currentUser.isAdmin) return <Navigate to="/home" replace />;
  if (adminForbidden && currentUser.isAdmin) return <Navigate to="/admin" replace />;

  return children;
}

export default ProtectedRoute;