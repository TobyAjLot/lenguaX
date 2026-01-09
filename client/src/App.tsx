import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { initialize, user, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading spinner while initializing auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/auth"} replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
