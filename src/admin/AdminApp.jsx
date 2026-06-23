import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/users/UserList';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import BusinessList from './pages/businesses/BusinessList';
import CreateBusiness from './pages/businesses/CreateBusiness';
import EditBusiness from './pages/businesses/EditBusiness';
import IndustryList from './pages/industries/IndustryList';
import CountryList from './pages/countries/CountryList';
import FeaturedList from './pages/featured/FeaturedList';
import InquiryList from './pages/inquiries/InquiryList';
import BulkOperations from './pages/bulk/BulkOperations';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public admin routes */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path="users"
          element={
            <AdminProtectedRoute>
              <UserList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="users/create"
          element={
            <AdminProtectedRoute>
              <CreateUser />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <AdminProtectedRoute>
              <EditUser />
            </AdminProtectedRoute>
          }
        />

        {/* Business Management */}
        <Route
          path="businesses"
          element={
            <AdminProtectedRoute>
              <BusinessList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="businesses/create"
          element={
            <AdminProtectedRoute>
              <CreateBusiness />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="businesses/:id"
          element={
            <AdminProtectedRoute>
              <EditBusiness />
            </AdminProtectedRoute>
          }
        />

        {/* Industries */}
        <Route
          path="industries"
          element={
            <AdminProtectedRoute>
              <IndustryList />
            </AdminProtectedRoute>
          }
        />

        {/* Countries */}
        <Route
          path="countries"
          element={
            <AdminProtectedRoute>
              <CountryList />
            </AdminProtectedRoute>
          }
        />

        {/* Featured */}
        <Route
          path="featured"
          element={
            <AdminProtectedRoute>
              <FeaturedList />
            </AdminProtectedRoute>
          }
        />

        {/* Inquiries */}
        <Route
          path="inquiries"
          element={
            <AdminProtectedRoute>
              <InquiryList />
            </AdminProtectedRoute>
          }
        />

        {/* Bulk Operations */}
        <Route
          path="bulk"
          element={
            <AdminProtectedRoute>
              <BulkOperations />
            </AdminProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}
