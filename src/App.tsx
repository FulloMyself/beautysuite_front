import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import DashboardPage from './modules/platform-admin/DashboardPage';
import TenantsPage from './modules/platform-admin/TenantsPage';
import UsersPage from './modules/platform-admin/UsersPage';
import BookingPage from './modules/booking-calendar/BookingPage';
import CustomersPage from './modules/customer-management/CustomersPage';
import ProductsPage from './modules/product-catalog/ProductsPage';
import StaffPage from './modules/staff-management/StaffPage';
import AnalyticsDashboard from './modules/platform-admin/AnalyticsDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />

              {/* Platform Admin Routes */}
              <Route path="admin/tenants" element={
                <ProtectedRoute requiredRole="super_admin">
                  <TenantsPage />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute requiredRole="super_admin">
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />

              {/* Tenant Dashboard Routes */}
              <Route path="bookings" element={<BookingPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="settings" element={
                <div className="p-6">Settings - Coming Soon</div>
              } />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;