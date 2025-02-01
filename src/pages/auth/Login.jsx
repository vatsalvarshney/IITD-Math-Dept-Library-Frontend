import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';


const Login = () => {
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [staffLogin, setStaffLogin] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    // if (!credentials.password) {
    //   newErrors.password = 'Password is required';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const user = await login(credentials);
      // If login successful, redirect to the return URL
      if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({
          general: 'Invalid username or password'
        });
      } else {
        setErrors({
          general: 'An error occurred. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to Mathematics Department Library
          </p>
        </div>

        <div className="flex justify-center max-w-xs items-center mx-auto">
          <button
            type="button"
            className={`${
              staffLogin ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer' : 'bg-primary text-white'
            } w-1/2 py-2 rounded-l-md`}
            onClick={() => setStaffLogin(false)}
          >
            Student
          </button>
          <button
            type="button"
            className={`${
              staffLogin ? 'bg-primary text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer'
            } w-1/2 py-2 rounded-r-md`}
            onClick={() => setStaffLogin(true)}
          >
            Staff
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <Input
              label={staffLogin? "Username" : "IITD Kerberos ID (E.g. mt1240999)"}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={credentials.username}
              onChange={handleChange}
              error={errors.username}
            />

            {staffLogin && (
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                // required
                value={credentials.password}
                onChange={handleChange}
                error={errors.password}
              />
            )}
          </div>

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;