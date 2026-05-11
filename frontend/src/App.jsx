import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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

function App() {
  // check token when app opens
  const { checkAuth } = useAuth();
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

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
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      )
    },
    {
      path: "/bookmarks",
      element: (
        <ProtectedRoute>
          <Bookmarks />
        </ProtectedRoute>
      )
    },
  ]);

  return (
    <div>
      <RouterProvider router={routerObj} />
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  );
}

export default App;
