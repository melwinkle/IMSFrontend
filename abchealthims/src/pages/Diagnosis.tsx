import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FileText, Calendar, User, Search, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiagnosisData } from '../types/diagnosis';
import Pagination from '../components/Pagination';
import { fetchDiagnosisByDoctor,fetchDiagnosisByPatient, fetchMyDiagnosis } from '../store/slices/diagnosisSlice';
import { fetchUsers } from '../store/slices/authSlice';


export default function Diagnosis() {
  const { user,users} = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isDoctor = user?.role === 'doctor';
  const [searchQuery, setSearchQuery] = useState('');
  const {diagnoses}=useAppSelector((state)=>state.diagnosis)
  const diagnosisRef=useRef(false);
  const userRef=useRef(false);
  const dispatch=useAppDispatch();

  useEffect(()=>{
    if(!diagnosisRef.current&&isDoctor){
      diagnosisRef.current=true;
      dispatch(fetchDiagnosisByDoctor())
    }
    
  },[dispatch,isDoctor]);

  useEffect(()=>{
    if(!diagnosisRef.current&&user?.role=="patient"){
      diagnosisRef.current=true;
      dispatch(fetchMyDiagnosis())
    }
    
  },[dispatch,user]);

  useEffect(()=>{
    if(!userRef.current&&isDoctor){
      userRef.current=true;
      dispatch(fetchUsers())
    }
    
  },[dispatch,user]);

  

  const getPatientName = (patientId: any) => {
    const patient = users?.find((user) => user.id === patientId);
    return patient?.username || null; // Return null if not found
};

  const filteredDiagnoses = diagnoses?.filter(diagnosis => {
    const patientName = getPatientName(diagnosis.patient);
    const searchLower = searchQuery.toLowerCase();
    const dateMatch = diagnosis.date?.includes(searchQuery);
    const nameMatch = isDoctor 
      ? (patientName && patientName.toLowerCase().includes(searchLower.toLowerCase()))
      : diagnosis.doctor_name?.toLowerCase().includes(searchLower);
    return dateMatch || nameMatch;
  })||[];




 

  // Add these state variables at the top of your component
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const totalItems = filteredDiagnoses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiagnoses.slice(indexOfFirstItem, indexOfLastItem);

  const handleNewDiagnosis = () => {
    navigate('/diagnosis/new');
  };

  const handleDiagnosisClick = (id: string) => {
    navigate(`/diagnosis/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Diagnosis Records</h1>
        {isDoctor && (
          <button 
            onClick={handleNewDiagnosis}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            New Diagnosis
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={isDoctor ? "Search by patient name or date..." : "Search by doctor name or date..."}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          {currentItems.map((diagnosis) => (
            <div 
              key={diagnosis.id} 
              className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleDiagnosisClick(diagnosis.id as string)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FileText className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium text-gray-900">
                          {isDoctor ? getPatientName(diagnosis.patient) : diagnosis.doctor_name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {diagnosis.date}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{diagnosis.content}</p>
                    {diagnosis.prescription_image && (
                      <img src={typeof diagnosis.prescription_image === 'string' ? diagnosis.prescription_image : undefined}/>
                      
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
/>
    </div>
  );
}