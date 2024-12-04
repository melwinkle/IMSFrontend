// src/pages/ChangePassword.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { changePassword,logout } from '../store/slices/authSlice'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const ChangePassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await dispatch(changePassword({ oldPassword: oldPassword, newPassword: newPassword }));
            if (changePassword.fulfilled.match(response)) {
                setSuccess('Password changed successfully. You will be logged out.');
                // Log out the user after successful password change
                // Assuming you have a logout action
                dispatch(logout());
                navigate('/login'); // Redirect to login page or wherever appropriate
            } else {
                setError(response.payload as string); // Set error message from response
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;