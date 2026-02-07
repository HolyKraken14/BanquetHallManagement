import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiBase } from '../lib/api'
import { Eye, EyeOff } from "lucide-react"

const Login = () => {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credential || !password) {
      setMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${getApiBase()}/api/auth/login`, {
        credential,
        password,
      });
      const { token, role, userId } = response.data;

      // Enforce success only when all auth fields are present
      if (!token || !role || !userId) {
        setMessage("Error: Invalid login response.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "manager") {
        navigate("/manager-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      } else {
        setMessage("Error: Unknown role.");
      }
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Error: Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Login to access your account</p>
        </div>

        {/* Back to Home */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="items-center space-x-2 px-4 py-3 rounded-xl 
                bg-gradient-to-r from-[#9B1A33] to-[#9B1A33] text-white-700 
                hover:from-[#7a1529] hover:to-[#7a1529] transition-all duration-200 font-medium shadow-lg hover:shadow-xl0"
          >
            ← Back to Home
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-white absolute focus:border-transparent w-10 right-1 top-1 bottom-1 flex items-center pr-3 hover:bg-gray-100 transition-all duration-200"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`items-center space-x-2 px-4 py-3 rounded-xl 
                bg-gradient-to-r from-[#9B1A33] to-[#9B1A33] text-white-700 
                hover:from-[#7a1529] hover:to-[#7a1529] transition-all duration-200 font-medium shadow-lg hover:shadow-xl0
                ${
                  loading
                    ? "bg-red-600 cursor-not-allowed"
                    : "bg-red-800 hover:bg-red-900"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800
                transform transition-all duration-200 ease-in-out hover:scale-[1.02]`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-red-700 hover:text-red-900 
                    transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;