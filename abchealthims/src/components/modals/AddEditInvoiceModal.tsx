import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../components/Modal';
import { Invoice } from '../../types/invoice';
import { User } from '../../types/user';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchImagesByPatient } from '../../store/slices/imageSlice';

interface AddEditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  mode: 'add' | 'edit';
  onSubmit: (data: Invoice) => void;
  users: User[] | null;
}

const initialFormState: Invoice = {
  patient: '',
  amount: 0,
  service_type: '',
  image_id: '',
  due_date: new Date().toISOString().split('T')[0],
  status: 'pending',
};

export const AddEditInvoiceModal: React.FC<AddEditInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  mode,
  onSubmit,
  users,
}) => {
  const [formData, setFormData] = useState<Invoice>(initialFormState);
  const { images } = useAppSelector((state) => state.image);
  const dispatch = useAppDispatch();
  const imageRef = useRef(false);

  useEffect(() => {
    if (mode === 'add') {
      setFormData(initialFormState);
    } else if (invoice && mode === 'edit') {
      setFormData({
        patient: invoice.patient,
        amount: invoice.amount,
        service_type: invoice.service_type,
        image_id: invoice.image_id || '',
        due_date: invoice.due_date,
        status: invoice.status as 'pending' | 'paid',
      });
    }
  }, [invoice, mode, isOpen]);

  useEffect(() => {
    if (formData.patient) {
      dispatch(fetchImagesByPatient(formData.patient));
    }
  }, [dispatch, formData.patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const patientOptions = users?.filter((user) => user.role === 'patient');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'add' ? 'Create New' : 'Edit'} Invoice`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a patient</option>
              {patientOptions?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <input
            type="text"
            value={formData.service_type}
            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <select
            value={formData.image_id}
            onChange={(e) => setFormData({ ...formData, image_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select an image</option>
            {images?.map((image) => (
              <option key={image.id} value={image.id}>
                {image.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 border-t pt-4">
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
            {mode === 'add' ? 'Create Invoice' : 'Update Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};