import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>로딩중...</div>;

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
