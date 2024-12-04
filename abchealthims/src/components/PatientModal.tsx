import React from 'react';
import { Modal } from './Modal';
import { Patient } from '../types/user';
import { User, Calendar, Phone, Mail, MapPin, Heart, FileText } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const isDoctor = user?.role === 'doctor';
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Details"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-gray-500">Patient ID: {patient.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Calendar} label="Date of Birth" value={patient.dob} />
            <InfoItem icon={Heart} label="Blood Type" value={patient.blood_group} />
            <InfoItem icon={Phone} label="Contact Number" value={patient.number} />
            <InfoItem icon={Mail} label="Email" value={patient.email} />
            <InfoItem icon={MapPin} label="Address" value={patient.address} className="md:col-span-2" />
          </div>
        </div>


        {/* Medical Information */}
        {isDoctor && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-600" />
            Medical Information
          </h4>
          
         

          {/* Medical History */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Medical History</h5>
            <div className="flex flex-wrap gap-2">
              {patient.medicalHistory.map((condition, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {condition}
                </span>
              ))}
            </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

interface InfoItemProps {
  icon?: React.FC<any>;
  label: string;
  value: string;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-start space-x-2 ${className}`}>
    {Icon && <Icon className="h-5 w-5 text-gray-400 mt-0.5" />}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);