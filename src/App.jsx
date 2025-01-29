import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/public/Landing';

// Route guards
const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            {/* Add other public routes here */}
          </Route>

          {/* Protected routes will be added here as we create them */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;