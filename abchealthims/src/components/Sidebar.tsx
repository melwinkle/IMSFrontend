import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  CreditCard,
  User,
} from 'lucide-react';

const menuItems = {
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Staff' },
    { to: '/patients', icon: User, label: 'Patients' },
    { to: '/invoices', icon: CreditCard, label: 'Invoices' },
  ],
  doctor: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: User, label: 'Patients' },
    { to: '/diagnosis', icon: FileText, label: 'Diagnosis' },
  ],
  radiologist: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: User, label: 'Patients' },
    { to: '/images', icon: Image, label: 'Images' },
  ],
  medical_staff: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: User, label: 'Patients' },
  ],
  billing_staff: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: User, label: 'Patients' },
    { to: '/invoices', icon: CreditCard, label: 'Invoices' },
  ],
  patient: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/diagnosis', icon: FileText, label: 'My Diagnosis' },
    { to: '/invoices', icon: CreditCard, label: 'My Invoices' },
    { to: '/images', icon: Image, label: 'My Images' },
  ],
};

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const items = user ? menuItems[user.role] : [];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="h-16 flex items-center justify-center border-b">
        {/* <Hospital className="h-8 w-8 text-indigo-600 mr-2" /> */}
        <h2 className="text-xl font-bold text-gray-800">ABC Health</h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {items?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}