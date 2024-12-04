import React from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Sidebar from './Sidebar';
import { UserCircle, LogOut } from 'lucide-react';
import { logout,fetchUser } from '../store/slices/authSlice';

export default function Layout() {
  const { user,isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  if (!isAuthenticated) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }



  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                ABC Health IMS
              </h1>
              
              <div className="flex items-center space-x-4">
                <NavLink to="/profile">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  </div>
                </NavLink>
                <button
                  onClick={logoutUser}
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}