import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useAuth } from "./stores/authStore";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import HashtagFeed from "./pages/HashtagFeed";
import AdminDashboard from "./pages/AdminDashboard";

function CatchAll() {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  useEffect(() => {
    toast.error("Page not found");
  }, []);
  if (isCheckingAuth) return null;
  return isAuthenticated 
    ? <Navigate to="/home" replace /> 
    : <Navigate to="/" replace />;
}

const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile/:username",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute adminForbidden={true}>
        <Messages />
      </ProtectedRoute>
    )
  },
  {
    path: "/bookmarks",
    element: (
      <ProtectedRoute adminForbidden={true}>
        <Bookmarks />
      </ProtectedRoute>
    )
  },
  {
    path: "/terms",
    element: <Terms />
  },
  {
    path: "/privacy",
    element: <Privacy />
  },
  {
    path: "/cookies",
    element: <Cookies />
  },
  {
    path: "*",
    element: <CatchAll />
  },
  {
    path: "/explore/:tag",
    element: (
      <ProtectedRoute>
        <HashtagFeed />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
]);

function App() {
  // check token when app opens
  const { checkAuth } = useAuth();
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

  return (
    <div>
      <RouterProvider router={routerObj} />
      <Toaster position="top-center" reverseOrder={false}
        toastOptions={{
          style: {
            background: "rgba(22, 24, 28, 0.85)",
            backdropFilter: "blur(12px)",
            color: "#e7e9ea",
            border: "1px solid #2f3336",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#1d9bf0",
              secondary: "#000",
            },
          },
          error: {
            iconTheme: {
              primary: "#f4212e",
              secondary: "#000",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
