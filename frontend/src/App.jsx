import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Tenant Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import MyVisits from './pages/MyVisits';
import MyInquiries from './pages/MyInquiries';
import Profile from './pages/Profile';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyProperties from './pages/owner/MyProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';
import OwnerInquiries from './pages/owner/OwnerInquiries';
import OwnerVisits from './pages/owner/OwnerVisits';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProperties from './pages/admin/ManageProperties';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* General Authenticated Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Tenant-Only Routes */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-visits"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <MyVisits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-inquiries"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <MyInquiries />
                  </ProtectedRoute>
                }
              />

              {/* Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/properties"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <MyProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/add-property"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/edit-property/:id"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/inquiries"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerInquiries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/visits"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerVisits />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/properties"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
