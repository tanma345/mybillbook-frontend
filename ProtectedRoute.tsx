import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Import Auth Context

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;