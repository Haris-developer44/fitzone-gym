import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
    const { currentUser, userRole, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark text-neon">Loading...</div>;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        // Redirect to their respective dashboard if they try to access wrong routes
        return <Navigate to={`/${userRole}/dashboard`} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
