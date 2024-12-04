import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { NavLink, Navigate } from 'react-router-dom';
import { getProfile} from '../store/slices/authSlice';
import { User, Patient, DoctorUser, MedicalStaffUser, RadiologistUser, BillingStaffUser } from '../types/user';
import admin from '../assets/images/admin.png';
import doctor from '../assets/images/doctor.png';
import patient from '../assets/images/patient.png';
import medical_staff from '../assets/images/medical_staff.png';
import radiologist from '../assets/images/radiologist.png';
import billing_staff from '../assets/images/billing_staff.png';


const avatarMap: { [key: string]: string } = {
    doctor: doctor,
    patient: patient,
    medical_staff: medical_staff,
    radiologist: radiologist,
    billing_staff: billing_staff,
};
const Profile: React.FC = () => {
    const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getProfile());
        }
    }, [dispatch, isAuthenticated, user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!user || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const renderRoleSpecificInfo = (user: User) => {
        switch (user.role) {
            case 'doctor':
                const doctorUser = user as DoctorUser;
                return (
                    <div className="text-sm text-gray-600">
                        <p>Medical License: {doctorUser.license_number}</p>
                        <p>Department: {doctorUser.department}</p>
                    </div>
                );
            case 'patient':
                const patientUser = user as Patient;
                return (
                    <div className="text-sm text-gray-600">
                        <p>Patient Number: {patientUser.number}</p>
                        <p>Address: {patientUser.address}</p>
                        <p>Blood Group: {patientUser.blood_group}</p>
                        <p>Medical History: {patientUser.medical_history?patientUser.medical_history:"No history recorded"}</p>
                        <p>Weight: {patientUser.weight}</p>
                        <p>Height: {patientUser.height}</p>

                    </div>
                );
            case 'medical_staff':
                const medicalStaffUser = user as MedicalStaffUser;
                return (
                    <div className="text-sm text-gray-600">
                        <p>Department: {medicalStaffUser.department}</p>
                    </div>
                );
            case 'radiologist':
                const radiologistUser = user as RadiologistUser;
                return (
                    <div className="text-sm text-gray-600">
                        <p>Department: {radiologistUser.department}</p>
                    </div>
                );
            case 'billing_staff':
                const billingStaffUser = user as BillingStaffUser;
                return (
                    <div className="text-sm text-gray-600">
                        <p>Department: {billingStaffUser.department}</p>
                    </div>
                );
            default:
                return <p className="text-sm text-gray-600">Role information not available</p>;
        }
    };

    
 

  
    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <div className="space-y-4">
                <div className="text-center">
                    <div className="h-24 w-24 rounded-full  mx-auto mb-4 ">
                    <img src={avatarMap[user.role] || admin} alt={`${user.role} Avatar`} className="h-full w-full rounded-full border-red-600" />

                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mt-2">
                        {user.role}
                    </span>
                    
                </div>

                <div className="border-t pt-4">
                    {renderRoleSpecificInfo(user)}
                </div>
            </div>
            {/* Change password link */}
            <div className="mt-4">
                <NavLink to="/change-password" className="text-sm text-red-600 hover:text-red-900">
                    Change Password
                </NavLink>
            </div>
          
        </div>
    );
};

export default Profile;