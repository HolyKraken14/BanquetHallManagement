import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getApiBase } from '../lib/api'
import { Eye, EyeOff } from "lucide-react"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const navigate = useNavigate()

  const validatePassword = (pass) => {
    setPasswordStrength({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const rvceEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!rvceEmailRegex.test(email)) {
      setMessage("Enter a valid email address.")
      return
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setMessage("Please ensure your password meets all the criteria.")
      return
    }

    try {
      const response = await axios.post(`${getApiBase()}/api/auth/register`, {
        username,
        email,
        password,
      })

      setMessage(`Registration successful: ${response.data.message}`)

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`)
      } else {
        setMessage("Error: Could not connect to the server.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join the NATIVE community</p>
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

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="your.name@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
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
              <div className="mt-2 space-y-1">
                {Object.entries(passwordStrength).map(([criterion, isValid]) => (
                  <div key={criterion} className="flex items-center space-x-2">
                    <span className={`text-xs ${isValid ? "text-green-500" : "text-red-500"}`}>
                      {isValid ? "✓" : "✗"} {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full items-center space-x-2 px-4 py-3 rounded-xl 
              bg-gradient-to-r from-[#9B1A33] to-[#9B1A33] text-white-700 
              hover:from-[#7a1529] hover:to-[#7a1529] transition-all duration-200 font-medium shadow-lg hover:shadow-xl0
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800
              transform transition-all duration-200 ease-in-out hover:scale-[1.02]"
            >
              Create Account
            </button>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="items-center space-x-2 px-4 py-3 rounded-xl 
                  bg-gradient-to-r from-[#9B1A33] to-[#9B1A33] text-white-700 
                  hover:from-[#7a1529] hover:to-[#7a1529] transition-all duration-200 font-medium shadow-lg hover:shadow-xl0
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800
                  transform transition-all duration-200 ease-in-out hover:scale-[1.02]"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default Register

