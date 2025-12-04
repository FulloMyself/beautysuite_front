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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <TenantProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Platform Admin Routes */}
              <Route 
                path="admin/tenants" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <TenantsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/users" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Tenant Dashboard Routes */}
              <Route path="bookings" element={<BookingPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p>Settings page - Coming Soon</p>
                </div>
              } />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;