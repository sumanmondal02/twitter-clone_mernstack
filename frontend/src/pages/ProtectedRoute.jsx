import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import * as s from "../styles/common";

function ProtectedRoute({ children }) {

  const { isAuthenticated, isCheckingAuth, currentUser } = useAuth();

  if (isCheckingAuth) {
    return (
        <div className={s.loadingCenter}>
            <div className={s.loadingSpinner}></div>
        </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;