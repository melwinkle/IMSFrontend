import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Patient } from '../types/user';
import { X, Plus } from 'lucide-react';

interface AddEditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  mode: 'add' | 'edit';
  onSubmit: (data: Patient) => void;
}

const initialFormState = {
    username: '',
    dob: '',
    gender: 'male' as const,
    number: '',
    email: '',
    address: '',
    blood_group: '',
    medical_history: '',
    role: 'patient' as const,
    name: '',
    status: 'active' as const,
    id: '',
    weight:0,
    height:0,
    user: '',
  };

export const AddEditPatientModal: React.FC<AddEditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  mode,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Patient>({
    ...initialFormState,
  });



  useEffect(() => {
    if (mode === 'add') {
      setFormData(initialFormState);
    } else if (patient && mode === 'edit') {
      setFormData({
        ...patient,
        role: 'patient' as const,
        status: 'active' as const
      });
    }
  }, [patient, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  

 

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'add' ? 'Add New' : 'Edit'} Patient`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <select
              value={formData.blood_group}
              onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Blood Type</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>


     

        {/* Medical History */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Medical History</h4>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.medical_history}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add medical condition"
              />
            </div>
            
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {mode === 'add' ? 'Add Patient' : 'Update Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
};