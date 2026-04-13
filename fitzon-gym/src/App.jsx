import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';

// Shared Pages
import AttendancePage from './pages/shared/AttendancePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersPage from './pages/admin/MembersPage';
import AddMemberPage from './pages/admin/AddMemberPage';
import EditMemberPage from './pages/admin/EditMemberPage';
import PaymentsPage from './pages/admin/PaymentsPage';

// Sub Admin Pages
import SubAdminMembersPage from './pages/sub_admin/SubAdminMembersPage';
import SubAdminAddMemberPage from './pages/sub_admin/SubAdminAddMemberPage';
import SubAdminEditMemberPage from './pages/sub_admin/SubAdminEditMemberPage';
import SubAdminPaymentsPage from './pages/sub_admin/SubAdminPaymentsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/attendance" element={<AttendancePage />} />
          <Route path="/admin/members/add" element={<AddMemberPage />} />
          <Route path="/admin/members/edit/:id" element={<EditMemberPage />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
        </Route>

        {/* Sub Admin Protected Routes */}
        <Route path="/sub_admin" element={<Navigate to="/sub_admin/members" replace />} />
        <Route element={<ProtectedRoute allowedRole="sub_admin" />}>
          <Route path="/sub_admin/members" element={<SubAdminMembersPage />} />
          <Route path="/sub_admin/attendance" element={<AttendancePage />} />
          <Route path="/sub_admin/members/add" element={<SubAdminAddMemberPage />} />
          <Route path="/sub_admin/members/edit/:id" element={<SubAdminEditMemberPage />} />
          <Route path="/sub_admin/payments" element={<SubAdminPaymentsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
