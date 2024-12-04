import React, { useState, useEffect } from 'react';
import { BillingStaffUser, User } from '../../types/user';

interface BillingStaffFormProps {
  initialData?: User;
  onSubmit: (data: User) => void;
  mode: 'add' | 'edit';
}

export const BillingStaffForm: React.FC<BillingStaffFormProps> = ({
  initialData,
  onSubmit,
  mode
}) => {
  const [formData, setFormData] = useState<BillingStaffUser>({
    username: '',
    email: '',
    role: 'billing_staff',
    status: 'active',
    department: 'Billing',
    name: ''
  });

  useEffect(() => {
    if (initialData && mode === 'edit' && initialData.role === 'billing_staff') {
      setFormData(initialData);
    }
  }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const insuranceCompanyOptions = [
    { value: 'aetna', label: 'Aetna' },
    { value: 'bluecross', label: 'Blue Cross Blue Shield' },
    { value: 'cigna', label: 'Cigna' },
    { value: 'humana', label: 'Humana' },
    { value: 'medicare', label: 'Medicare' },
    { value: 'medicaid', label: 'Medicaid' }
  ];

  const certificationOptions = [
    { value: 'cpc', label: 'Certified Professional Coder (CPC)' },
    { value: 'cpb', label: 'Certified Professional Biller (CPB)' },
    { value: 'crcs', label: 'Certified Revenue Cycle Specialist (CRCS)' },
    { value: 'cmrs', label: 'Certified Medical Reimbursement Specialist (CMRS)' }
  ];

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


      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="department"
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
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {mode === 'add' ? 'Save' : 'Update'}
        </button>
      </div>
    </form>
  );
};