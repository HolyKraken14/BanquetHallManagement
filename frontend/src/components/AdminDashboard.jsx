import React, { useEffect, useState } from "react";
import { apiFetch } from '../lib/api';
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, LogOut, Mail } from 'lucide-react';
import AdminHallManagement from './AdminHallManagement';
import Logo from "./Logo.jpg";

const ProfileSection = ({ user, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#9B1A33] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9B1A33] to-[#6f1024] rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <User size={36} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{user?.username || 'N/A'}</h3>
              <p className="text-[#9B1A33] font-medium">{user?.role || 'Admin'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Email Address</h4>
                <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Username</h4>
                <p className="text-gray-800 font-medium">{user?.username || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Role</h4>
                <p className="text-gray-800 font-medium">{user?.role || 'Admin'}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Joined On</h4>
                <p className="text-gray-800 font-medium">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AvailabilityBadge = ({ isAvailable, reason }) => (
  <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg ${
    isAvailable 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  } font-medium text-sm`}>
    {isAvailable ? 'Available' : 'Not Available'}
  </div>
);

// const ContactForm = () => {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Support</h2>
//       <div className="space-y-6">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
//             <Mail size={24} className="text-white" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
//             <p className="text-gray-600">We're here to help</p>
//           </div>
//         </div>
//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//             <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//             <textarea className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
//           </div>
//           <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
//             Send Message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

const AdminDashboard = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [managerApprovedBookings, setManagerApprovedBookings] = useState([]);
  const [adminApprovedBookings, setAdminApprovedBookings] = useState([]);
  const [adminRejectedBookings, setAdminRejectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [bookingTabView, setBookingTabView] = useState("pending");
  const navigate = useNavigate();
  const getDisplayStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'pending':
      case 'approved_by_manager':
        return 'Pending';
      case 'approved_by_admin':
        return 'Confirmed';
      case 'rejected_by_manager':
      case 'rejected_by_admin':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusStyle = (backendStatus) => {
    const baseStyle = "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium";
    
    switch (backendStatus) {
      case 'pending':
      case 'approved_by_manager':
        return `${baseStyle} bg-yellow-100 text-yellow-700`;
      case 'approved_by_admin':
        return `${baseStyle} bg-green-100 text-green-700`;
      case 'rejected_by_manager':
      case 'rejected_by_admin':
        return `${baseStyle} bg-red-100 text-red-700`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-700`;
    }
  };
  const filterBookings = (status) => {
    switch (status) {
      case 'pending':
        return managerApprovedBookings;
      case 'confirmed':
        return adminApprovedBookings;
      case 'rejected':
        return adminRejectedBookings;
      default:
        return [];
    }
  };

  const BookingsList = ({ bookings }) => {
    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-lg">
          <Calendar className="mx-auto h-16 w-16 text-[#9B1A33]" />
          <h3 className="mt-6 text-xl font-bold text-gray-800">No bookings found</h3>
          <p className="mt-3 text-gray-500">No bookings in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
              ${
                booking.status === 'approved_by_admin'
                  ? 'border-green-200 bg-green-50'
                  : booking.status === 'rejected_by_manager' || booking.status === 'rejected_by_admin'
                  ? 'border-red-200 bg-red-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{booking?.seminarHallId?.name || 'Unknown hall'}</h3>
                <div className="mt-3 flex items-center space-x-4">
                  <span className={getStatusStyle(booking.status)}>
                    {getDisplayStatus(booking.status)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
              <Link
                to={`/booking-details/${booking._id}/admin`}
                className="px-4 py-2 bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white rounded-xl 
                  hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchSeminarHalls = async () => {
      try {
        const response = await apiFetch("/api/seminar-halls");
        if (!response.ok) throw new Error("Failed to fetch seminar halls");
        const data = await response.json();
        setSeminarHalls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSeminarHalls();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiFetch("/api/bookings/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setManagerApprovedBookings(data.bookings.filter(booking => booking.status === "approved_by_manager"));
        setAdminApprovedBookings(data.bookings.filter(booking => booking.status === "approved_by_admin"));
        setAdminRejectedBookings(data.bookings.filter(booking => booking.status === "rejected_by_admin"));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        const response = await apiFetch(`/api/users/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user information');
        
        const data = await response.json();
        setUser(data.userDetails);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved_by_manager': 'bg-yellow-50 text-yellow-800 border-yellow-200',
      'approved_by_admin': 'bg-green-50 text-green-800 border-green-200',
      'rejected_by_admin': 'bg-red-50 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderBookings = (bookings) => {
    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-lg">
          <Calendar className="mx-auto h-16 w-16 text-[#9B1A33]" />
          <h3 className="mt-6 text-xl font-bold text-gray-800">No bookings found</h3>
          <p className="mt-3 text-gray-500">There are currently no booking requests in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${getStatusColor(booking.status)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{booking?.seminarHallId?.name || 'Unknown hall'}</h3>
                <div className="mt-3 flex items-center space-x-4">
                  <span
                    className={getStatusStyle(booking.status)}> {getDisplayStatus(booking.status)}
                  
                    
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
              <Link
                to={`/booking-details/${booking._id}/admin`}
                className="px-4 py-2 bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white rounded-xl hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#9B1A33] to-[#6f1024] shadow-xl 
          transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#9B1A33]/30">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="NativeINN logo" className="w-14 h-14 rounded-full border-4 shadow-lg" />
              <span className="text-xl font-bold text-white">NATIVE INN</span>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-4">
            {[
              { id: "Dashboard", icon: Home },
              { id: "Profile", icon: User },
              { id: "Bookings", icon: Calendar }
              
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === id 
                    ? 'bg-white text-[#9B1A33] shadow-lg transform scale-105 hover:text-white/80' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="ml-4 font-medium">{id}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarVisible ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-md">
          <div className="h-20 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="bg-white hover:bg-white"
              >
                <Menu size={23} className="text-[#6f1024]" />
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-[#9B1A33] whitespace-nowrap">Welcome, Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#f6e4e8] rounded-full flex items-center justify-center">
                  <User size={20} className="text-[#9B1A33]" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.username || 'Admin'}</span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl 
                  bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white 
                  hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 max-w-[1920px] mx-auto">
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Banquet Halls</h2>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B1A33] border-t-transparent"></div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-8">
                {seminarHalls.map((hall) => (
                  <div 
                    key={hall._id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                      border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={hall.images[0] || "/placeholder.svg"}
                        alt={hall.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                        ID: {hall.displayId}
                      </div>
                      <AvailabilityBadge 
                        isAvailable={hall.isAvailable} 
                        reason={hall.unavailabilityReason}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{hall.name}</h3>
                      {!hall.isAvailable && hall.unavailabilityReason && (
                        <p className="text-red-600 text-sm mb-4">{hall.unavailabilityReason}</p>
                      )}
                      <div className="space-y-3">
                        <Link
                          to={`/seminar-hall/admin/${hall._id}`}
                          className="block w-full text-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl 
                            hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          View Details
                        </Link>
                        <AdminHallManagement
                          hall={hall}
                          isSidebarVisible={isSidebarVisible}
                          onUpdate={(updatedHall) => {
                            setSeminarHalls(halls => 
                              halls.map(h => h._id === updatedHall._id ? updatedHall : h)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

{activeTab === "Bookings" && (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
        
        {/* Booking Status Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'pending', label: 'Pending', color: 'yellow' },
            { id: 'confirmed', label: 'Confirmed', color: 'green' },
            { id: 'rejected', label: 'Rejected', color: 'red' }
          ].map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setBookingTabView(id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 
                ${bookingTabView === id
                  ? `bg-${color}-100 text-${color}-800 shadow-lg hover:bg-blue-100`
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                } border-2 border-${color}-200`}
            >
              {label}
              <span className="ml-2 px-2 py-1 rounded-lg bg-white text-sm">
                {filterBookings(id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filtered Bookings List */}
        <BookingsList bookings={filterBookings(bookingTabView)} />
      </div>
    </div>
  )}

          {activeTab === "Profile" && (
            <ProfileSection 
              user={user}
              loading={loading}
              error={error}
            />
          )}

          {/* {activeTab === "Contact" && <ContactForm />} */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

