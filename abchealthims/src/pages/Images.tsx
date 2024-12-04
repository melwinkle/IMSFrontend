import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector,useAppDispatch} from '../store/hooks';
import { Image, User, Calendar, Upload, Search } from 'lucide-react';
import { ImageData } from '../types/image';
import { useNavigate } from 'react-router-dom';
import ImageUploadModal from '../components/modals/ImageUploadModal';
import Pagination from '../components/Pagination';
import { archiveImage, fetchImagesByRadiologist,fetchMyImages } from '../store/slices/imageSlice';
import { fetchUsers } from '../store/slices/authSlice';


export default function Images() {
  const { user,users } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isRadiologist = user?.role === 'radiologist';
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const {images}=useAppSelector((state)=>state.image)
  const dispatch = useAppDispatch();
  const imageRef=useRef(false);
  const userRef=useRef(false)



  useEffect(()=>{
    if(!imageRef.current && isRadiologist){
      imageRef.current=true;
      dispatch(fetchImagesByRadiologist())
    

    }
  },[dispatch,isRadiologist]);


  useEffect(()=>{
    if(!imageRef.current && user?.role=="patient"){
      imageRef.current=true;
      dispatch(fetchMyImages())

    }
  },[dispatch,isRadiologist]);


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
  // Filter function
  const filteredImages = images?.filter(image => {
    const patientName = getPatientName(image.patient);
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = isRadiologist 
      ? (patientName && patientName.toLowerCase().includes(searchLower.toLowerCase()))
      : image.staff?.toLowerCase().includes(searchLower.toLowerCase());
    return nameMatch;
  })||[];

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredImages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  const handleImageClick = (imageId: string) => {
    navigate(`/images/${imageId}`);
  };

  const handleUploadSuccess = (newImageId: string) => {
    setIsUploadModalOpen(false);
    navigate(`/images/${newImageId}`);
  };

  const [error, setError] = useState<string | null>(null);

  const handlearchive=async(imageId:string)=>{
    try{
      await dispatch(archiveImage({imageId:imageId,imageData:{status:"Archive"}}))

    }
    catch(err) {
      setError(err instanceof Error ? err.message : "Failed to archive image");
    }
  }




  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Radiology Images</h1>
        {isRadiologist && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Image
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={isRadiologist ? "Search by patient name or date..." : "Search by radiologist name or date..."}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden" >
            <img
              src={typeof image?.image_file === 'string' ? image.image_file : undefined}
              alt={`${image.image_type} for ${getPatientName(image.patient)}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="font-medium text-gray-900">{getPatientName(image.patient)}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {image.uploaded_at}
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Image className="h-4 w-4 mr-1" />
                {image.image_type}
              </div>
            
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm" onClick={() => handleImageClick(image.id as string)}>View Full</button>
                  {isRadiologist && ( <button onClick={()=>handlearchive(image.id as string)} className="text-red-600 hover:text-red-800 text-sm">
                    {image.status==="Saved"?"Archive":"Restore"}
                    </button>
                        )}
                </div>
          
            </div>
          </div>
        ))}
      </div>
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
/>

      {isUploadModalOpen && (
        <ImageUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
          users={users}
        />
      )}
    </div>
  );
}