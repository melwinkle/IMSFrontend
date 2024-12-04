import React from 'react';
import { Modal } from './Modal';
import { DoctorForm } from './forms/DoctorForm';
import { MedicalStaffForm } from './forms/MedicalStaffForm';
import { RadiologistForm } from './forms/RadiologistForm';
import { BillingStaffForm } from './forms/BillingStaffForm';
import { User, UserRole } from '../types/user';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  user?: User;
  mode: 'add' | 'edit';
  onSubmit: (userData: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose,
  role,
  user,
  mode,
  onSubmit
}) => {
  const handleFormSubmit = (formData: User) => {
    console.log(formData)
    onSubmit(formData);
    onClose();
  };

  const renderForm = () => {
    const commonProps = {
      initialData: user,
      onSubmit: handleFormSubmit,
      mode
    };

    switch (role) {
      case 'doctor':
        return <DoctorForm {...commonProps} />;
      case 'medical_staff':
        return <MedicalStaffForm {...commonProps} />;
      case 'radiologist':
        return <RadiologistForm {...commonProps} />;
      case 'billing_staff':
        return <BillingStaffForm {...commonProps} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'add' ? 'Add New' : 'Edit'} ${role.replace('_', ' ').charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}`}
    >
      {renderForm()}
    </Modal>
  );
};