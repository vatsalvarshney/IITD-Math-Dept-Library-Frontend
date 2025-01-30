import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/public/Landing';
import Books from './pages/public/Books';
import BookDetails from './pages/public/BookDetails';

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
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
          </Route>

          {/* Protected routes will be added here as we create them */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;