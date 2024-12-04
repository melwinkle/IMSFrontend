import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Edit, Calendar, User, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import ImageUploadModal from '../components/modals/ImageUploadModal';
import { ImageData } from '../types/image';
import { fetchImageById } from '../store/slices/imageSlice';
import { fetchUsers } from '../store/slices/authSlice';

export default function ImageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user,users } = useAppSelector((state) => state.auth);
  const isRadiologist = user?.role === 'radiologist';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const image=useAppSelector((state)=>state.image.image);
  const imageRef=useRef(false)
  const userRef=useRef(false);
  const dispatch=useAppDispatch()
  
  // Fetch image details based on id
  useEffect(() =>{
    if(!imageRef.current && id){
      imageRef.current=true
      dispatch(fetchImageById(id as string))
    }
  })
  
  const imageSrc = typeof image?.image_file === 'string' ? image.image_file : undefined;


  useEffect(()=>{
    if(isRadiologist&&!userRef.current){
      userRef.current=true
      dispatch(fetchUsers())
    }
  },[dispatch])


  const getPatientName = (patientId: any) => {
    const patient = users?.find((user) => user.id === patientId);
    return patient?.username || null; // Return null if not found
};
  

  return (
    <div className="max-w-4xl mx-auto p-6">
         {/* go back button */}
         <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      <div className="flex justify-between items-center mb-6">
       
        <h1 className="text-2xl font-semibold text-gray-900">Image Details</h1>
        {isRadiologist && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Image
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Image Preview */}
        <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">

                    <img 
                        src={imageSrc} // Use the string URL directly
                        alt="Medical scan" 
                        className="w-full h-full object-contain"
                    />
       
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-gray-900">{image?.uploaded_at}</p>
            </div>
          </div>

          {/* Person Info (conditional based on role) */}
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {isRadiologist ? "Patient Name" : "Radiologist"}
              </h3>
              <p className="text-gray-900">
                {isRadiologist ? getPatientName(image?.patient) : image?.staff}
              </p>
            </div>
          </div>

          {/* Image Type */}
          <div className="flex items-start space-x-3">
            <ImageIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Image Type</h3>
              <p className="text-gray-900">{image?.image_type}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t pt-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                {image?.summary || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

       
      </div>

      {isEditModalOpen && (
        <ImageUploadModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            // Refresh data
          }}
          imageToEdit={image}

        />
      )}
    </div>
  );
}