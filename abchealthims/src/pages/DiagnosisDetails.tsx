import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Edit, Trash2, Download, FileText, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { DiagnosisData } from '../types/diagnosis';
import { fetchDiagnosisById, archiveDiagnosis } from '../store/slices/diagnosisSlice';
import { fetchUsers } from '../store/slices/authSlice';

export default function DiagnosisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, users } = useAppSelector((state) => state.auth);
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';
  const { diagnosis } = useAppSelector((state) => state.diagnosis);
  const diagnosisRef = useRef(false);
  const userRef = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!diagnosisRef.current) {
      diagnosisRef.current = true;
      dispatch(fetchDiagnosisById(id as string));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userRef.current) {
      userRef.current = true;
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  const handleEdit = () => {
    navigate(`/diagnosis/${id}/edit`);
  };

  const handleArchiveRestore = async () => {
    const newStatus = diagnosis?.status === 'Archive' ? 'Saved' : 'Archive';
    const confirmationMessage = newStatus === 'Archive' 
      ? 'Are you sure you want to archive this diagnosis?' 
      : 'Are you sure you want to restore this diagnosis?';

    if (window.confirm(confirmationMessage)) {
      try {
        dispatch(archiveDiagnosis({ diagnosisId: id as string, diagnosisData: { status: newStatus } }));
      } catch (error) {
        console.error(`Failed to ${newStatus === 'Archive' ? 'archive' : 'restore'} diagnosis:`, error);
      }
    }
  };

  const getPatientName = (patientId: any) => {
    const patient = users?.find((user) => user.id === patientId);
    return patient?.username || null; // Return null if not found
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Section - keeping your existing header */}
      {/* go back button */}
      <button onClick={() => navigate(-1)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 inline-flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go Back
      </button>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnosis Details</h1>
          <p className="text-gray-500 mt-1">Created on {diagnosis?.date}</p>
        </div>
        {isDoctor && (
          <div className="space-x-3">
            <button
              onClick={handleEdit}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 inline-flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleArchiveRestore}
              className={`px-4 py-2 rounded-md transition-colors duration-200 inline-flex items-center ${diagnosis?.status === 'Archive' ? 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100' : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {diagnosis?.status === 'Archive' ? 'Restore' : 'Archive'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-8">
          {/* Patient/Doctor Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-indigo-50 rounded-full p-3">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {isPatient ? "Diagnosed By" : "Patient Information"}
                </h2>
                <p className="text-lg font-semibold text-gray-900">
                  {isPatient ? diagnosis?.doctor_name : getPatientName(diagnosis?.patient)}
                </p>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Diagnosis Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {diagnosis?.content}
            </p>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Prescription Card */}
          {diagnosis?.prescription_image && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prescription</h2>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                {diagnosis?.prescription_image && (
                  <img src={typeof diagnosis.prescription_image === 'string' ? diagnosis.prescription_image : undefined} />
                )}
              </div>
            </div>
          )}

          {/* Important Notice Card */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Important Notice</h3>
                <p className="text-sm text-amber-700 mt-1">
                  This diagnosis information is confidential and should be discussed with your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}