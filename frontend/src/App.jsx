import React, { useState } from "react";
import nativeHotelImg from "./assets/Native-Hotel.jpg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SeminarHallDetails from "./components/SeminarHallDetails";
import SeminarHallDetailsAdmin from "./components/SeminarHallDetailsAdmin";
import BookingTab from "./components/BookingTab";
import BookingDetailsManager from "./components/BookingDetailsManager"
import BookingDetailsAdmin from "./components/BookingDetailsAdmin"
import BookingDetailsUser from "./components/BookingDetailsUser"
import Logo from "./components/Logo.jpg"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const Home = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#9B1A33] to-[#7a1529] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="shrink-0">
                  <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center">
                    <div className="mt-2 text-center">
                      <img src={Logo} alt="Native Inn" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="text-white">
                  <h3 className="text-sm font-light mb-1 tracking-wide opacity-90">By HEDA HOSPITALITY</h3>
                  <h1 className="text-4xl font-bold mb-2 tracking-tight">Hotel Native Inn</h1>
                  <p className="text-base opacity-90 mb-1">
                    Khanapur Road, Belgaum - 590016
                  </p>
                  <p className="text-sm opacity-90">Experience Luxury & Comfort</p>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs font-semibold bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                      Premium Banquet Halls
                    </span>
                    <span className="text-xs font-semibold bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                      Fine Dining
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-3xl font-bold border-b-2 border-white/30 pb-2 mb-2">Where Memories</div>
                <div className="text-xl font-light opacity-90">Begin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* About Native Inn Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-[#9B1A33]">
            <h2 className="text-4xl font-bold text-[#9B1A33] mb-6">About Hotel Native Inn</h2>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  Welcome to Hotel Native Inn, a premier luxury hotel in Belgaum offering world-class 
                  hospitality and amenities. Located on Khanapur Road, our hotel is perfectly positioned 
                  for both business and leisure travelers, with easy access to the Western Ghats viewpoint 
                  and railway station.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Experience our elegant banquet halls perfect for weddings, corporate events, and celebrations. 
                  Enjoy fine dining at our restaurant, unwind at N Lounge & Bar, and stay in our premium 
                  accommodations featuring modern amenities and exceptional service.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#9B1A33] to-[#7a1529] p-5 rounded-lg text-white shadow-lg">
                    <div className="font-bold text-2xl mb-1">Premium</div>
                    <div className="text-sm opacity-90">Banquet Halls</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#9B1A33] to-[#7a1529] p-5 rounded-lg text-white shadow-lg">
                    <div className="font-bold text-2xl mb-1">Luxury</div>
                    <div className="text-sm opacity-90">Accommodations</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#9B1A33] to-[#7a1529] p-5 rounded-lg text-white shadow-lg">
                    <div className="font-bold text-2xl mb-1">Fine</div>
                    <div className="text-sm opacity-90">Dining & Bar</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#9B1A33] to-[#7a1529] p-5 rounded-lg text-white shadow-lg">
                    <div className="font-bold text-2xl mb-1">Modern</div>
                    <div className="text-sm opacity-90">Amenities</div>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="p-10 bg-gradient-to-br from-[#9B1A33] to-[#7a1529] h-96 flex items-center justify-center">
                  <img 
                  src={nativeHotelImg} 
                  alt="RVCE Logo" 
                  className="h-80 w-110 border-4 border-white shadow-md"
                />
                </div>
              </div>
            </div>
          </div>

          {/* Banquet Hall System Section */}
          <div className="bg-gradient-to-br from-[#9B1A33] to-[#7a1529] rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-4xl font-bold mb-6">Banquet Hall Management System</h2>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-2/3">
                <p className="text-lg leading-relaxed mb-6 opacity-95">
                  Our Banquet Hall Management System provides a seamless platform to book and manage 
                  our premium banquet halls for your special occasions. Whether it's a wedding, corporate event, 
                  or celebration, enjoy real-time availability, instant confirmations, and transparent booking records 
                  to make your event planning effortless.
                </p>
                <Link to="/login">
                  <button className="bg-white text-[#9B1A33] px-8 py-4 rounded-lg font-bold text-lg
                    hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                    Login to Book Your Event
                  </button>
                </Link>
              </div>
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/15 p-5 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-2xl font-bold mb-1">Instant</div>
                    <div className="text-sm opacity-90">Booking</div>
                  </div>
                  <div className="bg-white/15 p-5 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-2xl font-bold mb-1">Real-time</div>
                    <div className="text-sm opacity-90">Availability</div>
                  </div>
                  <div className="bg-white/15 p-5 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-2xl font-bold mb-1">Secure</div>
                    <div className="text-sm opacity-90">Payments</div>
                  </div>
                  <div className="bg-white/15 p-5 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-2xl font-bold mb-1">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#9B1A33] mb-8 text-center">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-[#9B1A33]/20 hover:border-[#9B1A33] transition-all">
                <h3 className="text-xl font-bold text-[#9B1A33] mb-2">Wedding Events</h3>
                <p className="text-gray-600">Celebrate your special day in our elegant banquet halls with exceptional service and cuisine.</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-[#9B1A33]/20 hover:border-[#9B1A33] transition-all">
                <h3 className="text-xl font-bold text-[#9B1A33] mb-2">Corporate Events</h3>
                <p className="text-gray-600">Host conferences, seminars, and business meetings with state-of-the-art facilities.</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-[#9B1A33]/20 hover:border-[#9B1A33] transition-all">
                <h3 className="text-xl font-bold text-[#9B1A33] mb-2">Fine Dining</h3>
                <p className="text-gray-600">Experience culinary excellence at our restaurant and N Lounge & Bar.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#9B1A33] bg-white inline-block px-3 py-1 rounded">NATIVE INN</h3>
                <p className="text-gray-400 text-sm">Khanapur Road, Belgaum - 590016</p>
                <p className="text-gray-400 text-sm mt-2">Experience luxury hospitality</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Contact</h4>
                <p className="text-gray-400 text-sm">Phone: +91-9513509124/25</p>
                <p className="text-gray-400 text-sm">Email: bqt@nativehotels.co.in</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                Designed and Developed by{" "}
                <span className="font-semibold text-white">Vrushabh Brahmbhatt, Sithij Shetty</span>
                {" "}&{" "}
                <span className="font-semibold text-white">Anjali Heda</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">© 2025 Hotel Native Inn. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/seminar-hall/user/:id" element={<SeminarHallDetails />} />
        <Route path="/seminar-hall/admin/:id" element={<SeminarHallDetailsAdmin />} />
        <Route path="/book/:seminarHallId" element={<BookingTab />} />
        <Route path="/booking-details/:bookingId/manager" element={<BookingDetailsManager />} />
        <Route path="/booking-details/:bookingId/admin" element={<BookingDetailsAdmin />} />
        <Route path="/booking-details/:bookingId/user" element={<BookingDetailsUser />} />
        
        


        <Route path="/booking-details/:bookingId/user" element={<BookingDetailsUser />} />
      
        
      </Routes>
    </Router>
  );
};

export default App;