import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Activity, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

const mockTasks = [
  {
    id: '1',
    patientName: 'Alice Johnson',
    radiologistName: 'Dr. Ray',
    doctorName: 'Dr. Smith',
    date: '2024-02-15',
    description: 'Chest X-ray required',
    status: 'pending',
  },
  {
    id: '2',
    patientName: 'Bob Wilson',
    radiologistName: 'Dr. Ray',
    doctorName: 'Dr. Smith',
    date: '2024-02-14',
    description: 'MRI scan of left knee',
    status: 'completed',
    images: ['image1.jpg', 'image2.jpg'],
  },
];

export default function Tasks() {
  const { user } = useAppSelector((state) => state.auth);
  const isRadiologist = user?.role === 'radiologist';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Radiology Tasks</h1>
        {isRadiologist && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Upload Images
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          {mockTasks.map((task) => (
            <div key={task.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Activity className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium text-gray-900">{task.patientName}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {task.date}
                      </div>
                      <div className={`flex items-center ${
                        task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        {task.status}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    {task.images && (
                      <div className="flex space-x-2">
                        {task.images.map((image, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded-md text-sm text-gray-600">
                            {image}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {isRadiologist && task.status === 'pending' && (
                  <button className="text-indigo-600 hover:text-indigo-800">Complete Task</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}