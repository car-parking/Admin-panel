import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const PrivateRoute: React.FC = () => {
  const { user } = useAuthStore();
  return !user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
