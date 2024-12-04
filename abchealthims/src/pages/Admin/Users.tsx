import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { User as UserIcon, Mail, Phone, UserCircle, Search } from 'lucide-react';
import { AddUserModal } from '../../components/AddUserModal';
import { User, UserRole, UserStatus } from '../../types/user';
import Pagination from '../../components/Pagination';
import { fetchUser, fetchUsers,register,updateProfile } from '../../store/slices/authSlice';



const tabs: UserRole[] = ['doctor', 'medical_staff', 'radiologist', 'billing_staff'];



export default function Users() {
  const { user, users } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<UserRole>('doctor');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const dispatch = useAppDispatch();
  // useref
  const searchRef = useRef(false);
  const userFetchedRef = useRef<{ [key in UserRole]?: boolean }>({}); // Track fetched users by role

  // useffect to get all users
  useEffect(() => {
    if (!searchRef.current) {
      searchRef.current = true;
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUserSubmit = async (userData: User) => {
    if (modalMode === 'add') {
      // Add user logic
      try {
        await dispatch(register(userData)).unwrap();
        console.log('User registered successfully:', userData);
      } catch (error) {
        console.error('Failed to register user:', error);
      }
    } else {
      // Edit user logic

      if (selectedUser) {
        try {
          await dispatch(updateProfile({ userId: selectedUser.id as string, userData })).unwrap();
          console.log('User updated successfully:', userData);
        } catch (error) {
          console.error('Failed to update user:', error);
        }
      }

    }
    setIsModalOpen(false);
  };

  

  const filteredUsers = users?.filter(u => 
    u.role === activeTab && 
    (u?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  )|| [];

  // useEffect to fetch user details for filtered users based on active tab
  useEffect(() => {
    // Check if users for the active tab have already been fetched
    if (!userFetchedRef.current[activeTab]) {
      const filteredUsers = users?.filter(u => u.role === activeTab) || [];
      
      if (filteredUsers.length > 0) {
        filteredUsers.forEach((user:any) => {
          dispatch(fetchUser(user.id)); // Fetch full information for each user
        });
        userFetchedRef.current[activeTab] = true; // Mark as fetched
      }
    }
  }, [activeTab, users, dispatch]); 

  console.log(filteredUsers)

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem) || [];

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Add User */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                     placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                     focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleAddUser}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New {activeTab.replace('_', ' ')}
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          {currentItems.map((u) => (
            <div key={u.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  <UserCircle className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {u.username}
                    <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600
                  `}>
                      active
                     
                    </span>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {u.email}
                    </div>
                   
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditUser(u)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {currentItems.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>

      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
/>
      <AddUserModal 
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedUser(undefined);
      }}
      role={activeTab}
      user={selectedUser}
      mode={modalMode}
      onSubmit={handleUserSubmit}
    />
    </div>
  );
}