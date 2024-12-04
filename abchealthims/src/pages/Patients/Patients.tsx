import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { User as UserIcon,Calendar, Phone, MapPin, Search } from 'lucide-react';
import { PatientModal } from '../../components/PatientModal';
import { AddEditPatientModal } from '../../components/AddEditPatientModal';
import { Patient,User as UserType } from '../../types/user';
import Pagination from '../../components/Pagination';
import { fetchUsers,fetchUser, register, updateProfile } from '../../store/slices/authSlice';


function isPatient(user: UserType): user is Patient {
  return user.role === 'patient';
}

export default function Patients() {
  const { user,users } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const dispatch = useAppDispatch();
  const patientsRef = useRef(false);

  const canAddPatients = ['admin', 'medical_staff'].includes(user?.role || '');
  const patientRef=useRef(false)
  // is doctor

  // useEffect to fetch patients from backend
  useEffect(() => {
    // fetch patients from backend
    if (patientsRef.current) return;
    patientsRef.current = true;
    dispatch(fetchUsers());
  }, [dispatch]);



// filter role = patient
const filteredPatients = users?.filter((user): user is Patient => 
  isPatient(user) &&
  (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
) || []; // Ensure it's always an array



useEffect(() => {
  if (filteredPatients && filteredPatients.length > 0&& !patientRef.current) { // Check if filteredPatients is defined
    filteredPatients.forEach((patient:any) => {
      dispatch(fetchUser(patient.id)); // Fetch full information for each patient
    });
    patientRef.current = true;
  }
}, [filteredPatients, dispatch]);


  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredPatients?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handleAddNew = () => {
    setSelectedPatient(null);
    setModalMode('add');
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setIsAddEditModalOpen(true);
  };

  const handleClose = () => {
    setIsAddEditModalOpen(false);
    setSelectedPatient(null); // Clear selected patient when closing
    setModalMode('add'); // Reset mode to add
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handlePatientSubmit = async(userData: Patient) => {
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

      if (selectedPatient) {
        try {
          await dispatch(updateProfile({ userId: selectedPatient.id as string, userData })).unwrap();
          console.log('User updated successfully:', userData);
        } catch (error) {
          console.error('Failed to update user:', error);
        }
      }

    }
    // Handle add/edit logic here
    setIsAddEditModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        {canAddPatients && (
          <button 
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Patient
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                     placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                     focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          {currentItems.map((patient) => (
            <div key={patient.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    {/* account icon */}
                    
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.username}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                          {patient?.dob}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient?.number}
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {patient?.address}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleView(patient)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >View Details
                  </button>
                  {canAddPatients && (
                    <button 
                      onClick={() => handleEdit(patient)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {currentItems.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No patients found
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
      {/* View Patient Modal */}
      <PatientModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        patient={selectedPatient}
      />

      {/* Add/Edit Patient Modal */}
      <AddEditPatientModal
      isOpen={isAddEditModalOpen}
      onClose={handleClose}
      patient={selectedPatient}
      mode={modalMode}
      onSubmit={handlePatientSubmit}
    />
    </div>
  );
}