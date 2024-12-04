import React, { useEffect, useState } from 'react';
import { useAppSelector,useAppDispatch } from '../store/hooks';
import { Users, User, FileText, Activity, CreditCard, Image, Settings } from 'lucide-react';
import { fetchUsers} from '../store/slices/authSlice';
import { Patient,User as UserType  } from '../types/user';
import { fetchAllBills,fetchMyBills } from '../store/slices/billingSlice';
import { fetchAllImages,fetchImagesByRadiologist,fetchMyImages } from '../store/slices/imageSlice';
import { ImageData } from '../types/image';
import { fetchDiagnosisByDoctor,fetchMyDiagnosis } from '../store/slices/diagnosisSlice';
import { DiagnosisData } from '../types/diagnosis';








function isPatient(user: UserType): user is Patient {
  return user.role === 'patient';
}

export default function Dashboard() {
  const { user,users } = useAppSelector((state) => state.auth);
  const { bills } = useAppSelector((state) => state.billing);
  const { images } = useAppSelector((state) => state.image);
  const {diagnoses}=useAppSelector((state)=>state.diagnosis)
  const dispatch=useAppDispatch();

  useEffect(() =>{
    if(user?.role!=="patient" && users?.length==0 ){
      dispatch(fetchUsers())

    }

  },[dispatch,users])

  useEffect(() =>{
    if((user?.role=="admin"||user?.role=="billing_staff")&&bills==null){
      dispatch(fetchAllBills())

    }

  },[dispatch,bills])

  useEffect(()=>{
    if(user?.role=="patient"&&bills?.length==null){
      dispatch(fetchMyBills())
    }

  },[dispatch,bills])

  // filter patient outs from users
  const patients=users?.filter((user): user is Patient => 
    isPatient(user));

  // my patients
  // diagnosis made

  // get images by radiologist
  useEffect(() =>{
    if(user?.role=="radiologist"&&images?.length==null){
      dispatch(fetchImagesByRadiologist());
    }

  },[dispatch,user])

  // get al images as admin 
  useEffect(() =>{  
    if(user?.role=="admin"&&images?.length==null){
      dispatch(fetchAllImages());
    }

  },[dispatch,user])

  // get images by patient
  useEffect(() =>{
    if(user?.role=="patient"&&images?.length==null){
      dispatch(fetchMyImages());
    }

  },[dispatch,user])


  // getd diagnosis by doctor
  useEffect(()=>{
    if(user?.role=="doctor"&&diagnoses==null){
      dispatch(fetchDiagnosisByDoctor())
    }
  },[dispatch,user])


  // get diangosis of patietn 
  useEffect(()=>{
    if(user?.role=="patient"&&diagnoses==null){
      dispatch(fetchMyDiagnosis())
    }
  },[dispatch,user])

  // filter images if the sttus is Saved
  const savedImages=images?.filter((image): image is ImageData => 
    image.status === 'saved');


  // filter diagnoses and get the count based on the number of patients that they have seen 
  const countUniquePatients = (diagnoses: DiagnosisData[] | null): number => {
    // If diagnoses is null or an empty array, return 0
    if (!diagnoses || diagnoses.length === 0) {
        return 0;
    }

    // Use a Set to track unique patient names
    const uniquePatients = new Set<string>();

    diagnoses.forEach(diagnosis => {
        uniquePatients.add(diagnosis.patient); // Add the patient name to the Set
    });

    return uniquePatients.size; // Return the number of unique patients
};

// Usage
const patientDiagnosisCount = countUniquePatients(diagnoses);


  
  

  const statCards = {
    admin: [
      { title: 'Total Users', value: users?users.length:0, icon: Users, color: 'bg-blue-500' },
      { title: 'Total Patients', value: patients?patients.length:0, icon: User, color: 'bg-green-500' },
      { title: 'Active Tasks', value: images?images.length:0, icon: Activity, color: 'bg-yellow-500' },
      { title: 'Total Revenue', value: `$${bills?bills.reduce((acc,bill)=>acc+bill.amount,0):0}`, icon: CreditCard, color: 'bg-purple-500' },
    ],
    doctor: [
      { title: 'My Patients', value: patientDiagnosisCount, icon: User, color: 'bg-blue-500' },
      { title: 'Diagnoses Made', value: diagnoses?diagnoses.length:0, icon: FileText, color: 'bg-green-500' },
    ],
    radiologist: [
      { title: 'Total Tasks', value: images?images.length:0, icon: Activity, color: 'bg-yellow-500' },
      { title: 'Images Saved', value: savedImages?savedImages.length:0, icon: Image, color: 'bg-purple-500' },
      { title: 'Patients', value: patients?patients.length:0, icon: User, color: 'bg-blue-500' },
    ],
    medical_staff: [
      { title: 'Total Patients', value: patients?patients.length:0, icon: User, color: 'bg-blue-500' },
      { title: 'New Patients Today', value: patients?patients.length:0, icon: User, color: 'bg-green-500' },
    ],
    billing_staff: [
      { title: 'Total Invoices', value: bills?bills.length:0, icon: CreditCard, color: 'bg-yellow-500' },
      { title: 'Total Revenue', value: `$${bills?bills.reduce((acc,bill)=>acc+bill.amount,0):0}`, icon: CreditCard, color: 'bg-green-500' },
    ],
    patient: [
      { title: 'Total Diagnosis', value: diagnoses?diagnoses.length:0, icon: Activity, color: 'bg-blue-500' },
      { title: 'Total Bills', value: bills?bills?.length:0, icon: CreditCard, color: 'bg-yellow-500' },
      { title: 'Total Tasks', value: images?images.length:0, icon: Settings, color: 'bg-purple-500' },
    ],
  };
  const stats = user ? statCards[user.role] : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <p className="text-gray-600">
                  {user?.role === 'patient'
                    ? 'Doctor Smith updated your diagnosis'
                    : 'New patient registration completed'}
                </p>
                <span className="text-gray-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {user?.role === 'doctor' && (
              <>
                <button className="p-4 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Create New Diagnosis
                </button>
                <button className="p-4 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View Patient Records
                </button>
              </>
            )}
            {user?.role === 'radiologist' && (
              <>
                <button className="p-4 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Upload New Images
                </button>
                <button className="p-4 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Create Task
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}