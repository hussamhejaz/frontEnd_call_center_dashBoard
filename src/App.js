// App.js

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Providers from './components/Providers';
import ProviderFeedback from './components/ProviderFeedback';
import CustomerFeedback from './components/CustomerFeedback';
import Login from './components/Login';
import Profile from './components/Profile';
import ProviderProfile from './components/ProviderProfile';
import NewEstate from './components/NewEstate';
import EstateDetails from './components/EstateDetails';
import RegisterAdmin from './components/RegisterAdmin';
import AdminSection from './components/AdminSection';
import Posts from './components/Posts'; // Import Posts component
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute'; // Import ProtectedRoute
import CircularLoader from './components/CircularLoader';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedApp />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const ProtectedApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CircularLoader />;
  }

  return isAuthenticated ? (
    <div className="App">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Protected routes using ProtectedRoute */}
          <Route
            path="/providers"
            element={
              <ProtectedRoute
                element={<Providers />}
                allowedRoles={['admin', 'superAdmin']}
              />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={<Users />}
                allowedRoles={['admin', 'superAdmin']}
              />
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute
                element={<CustomerFeedback />}
                allowedRoles={['admin', 'superAdmin']}
              />
            }
          />
          <Route
            path="/new-estate"
            element={
              <ProtectedRoute
                element={<NewEstate />}
                allowedRoles={['admin', 'superAdmin']}
              />
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute
                element={<Posts />} // Posts component
                allowedRoles={['admin', 'superAdmin']} // Allowed roles
              />
            }
          />
          <Route
            path="/provider-feedback"
            element={
              <ProtectedRoute
                element={<ProviderFeedback />}
                allowedRoles={['superAdmin']}
              />
            }
          />
          <Route
            path="/register-admin"
            element={
              <ProtectedRoute
                element={<RegisterAdmin />}
                allowedRoles={['superAdmin']}
              />
            }
          />
          <Route
            path="/admin-section"
            element={
              <ProtectedRoute
                element={<AdminSection />}
                allowedRoles={['superAdmin']}
              />
            }
          />

          {/* Profile routes */}
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/estate/:estateId" element={<ProviderProfile />} />
          <Route path="/estates/details/:estateId" element={<EstateDetails />} />

          {/* Fallback to dashboard if not found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
