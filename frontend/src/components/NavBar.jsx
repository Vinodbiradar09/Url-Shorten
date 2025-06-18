import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slice/slice'
import { logoutUser } from "../api/user.api"

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get user name from the user object
  const userName = user?.name || user?.username || user?.email || "User";
  
  const handleLogout = async () => {
    try {
      // Call backend logout API to clear cookies
      await logoutUser();
      
      // If backend logout successful, dispatch Redux logout action
      dispatch(logout());
      
      // Navigate to home page after successful logout
      navigate({ to: '/' });
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      
      // Optionally clear local state even if backend fails
      dispatch(logout());
      navigate({ to: '/' });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - App Name */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              URL Shortener
            </Link>
          </div>
          
          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-gray-700 text-sm">
                  Welcome, <span className="font-medium">{userName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar