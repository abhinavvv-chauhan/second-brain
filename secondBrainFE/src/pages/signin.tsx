import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../icons/Logo';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export function Signin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      alert("Please fill in both username and password");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
        username: formData.username,
        password: formData.password        
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
    } 
    catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Signin failed";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred during signin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="text-center">
            {/* Large Logo */}
            <div className="mb-20 flex justify-center text-white transform scale-[3]">
              <Logo />
            </div>
            
            {/* Site Name */}
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Second Brain
            </h1>
            
            {/* Tagline */}
            <p className="text-xl text-gray-100 font-light leading-relaxed max-w-md">
              Organize your thoughts, amplify your intelligence, and unlock your potential.
            </p>
          </div>
        </div>
      </div>

      {/* Right Half - Signin Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo (only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="transform scale-150 mr-4">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Second Brain</h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your second brain</p>
          </div>

          {/* Signin Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}