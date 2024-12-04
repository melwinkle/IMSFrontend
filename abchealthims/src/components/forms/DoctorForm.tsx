import React, { useState, useEffect } from 'react';
import { DoctorUser,User } from '../../types/user';
interface DoctorFormProps {
    initialData?: User;
    onSubmit: (data: User) => void;
    mode: 'add' | 'edit';
  }
  
  export const DoctorForm: React.FC<DoctorFormProps> = ({
    initialData,
    onSubmit,
    mode
  }) => {
    const [formData, setFormData] = useState<DoctorUser>({
      username: '',
      name:'',
      email: '',
      role: 'doctor',
      status: 'active',
      speciality: '',
      license_number: '',
      department: ''
    });
  
    useEffect(() => {
      if (initialData && mode === 'edit' && initialData.role === 'doctor') {
        setFormData(initialData);
      }
    }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Common fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

    

      {/* Doctor-specific fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          type="text"
          value={formData.speciality}
          onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">License Number</label>
        <input
          type="text"
          value={formData.license_number}
          onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSubmit(formData)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {mode === 'add' ? 'Save' : 'Update'}
        </button>
      </div>
    </form>
  );
};