import React, { useRef, useState } from "react";
import { Modal } from "../Modal";
import { ImageData } from "../../types/image";
import { createImage, updateImage } from "../../store/slices/imageSlice";
import { useAppDispatch } from "../../store/hooks";
import { User } from "../../types/user";
interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (imageId: string) => void;
  imageToEdit?: ImageData | null;
  users?: User[] | null;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onSuccess,
  imageToEdit,
  users,
}: ImageUploadModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ImageData>>(
    imageToEdit || {
      patient: "",
      image_type: "",
      summary: "",
      category: "",
      name: "",
      image_file: null,
    }
  );

  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    setError(null);
    let updatedata={
      name:formData.name,
      image_type:formData.image_type,
      summary:formData.summary,
      caategory:formData.category
    }

    try {
      //API call here
      if(imageToEdit){
        await dispatch(updateImage({imageId:imageToEdit.id as string,imageData:updatedata}))
        onSuccess(imageToEdit.id as string);

      }else{
      const response = await dispatch(createImage(formData)).unwrap();
      onSuccess(response.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    }
  };

  const patientOptions = users?.filter((user) => user.role === "patient");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={imageToEdit ? "Edit Image" : "Upload New Image"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {!imageToEdit&&
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <select
              value={formData.patient}
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            >
              <option value="">Select a patient</option>
              {patientOptions?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Image Type
            </label>
            <select
              value={formData.image_type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image_type: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Image Type</option>
              <option value="X-Ray">X-Ray</option>
              <option value="CT Scan">CT Scan</option>
              <option value="MRI Scan">MRI Scan</option>
              <option value="Ultrasound Scan">Ultrasound Scan</option>
              <option value="PET Scan">PET Scan</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Image Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, summary: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Radiology">Radiology</option>
              <option value="Pathology">Pathology</option>
              <option value="General">General</option>
            </select>
          </div>

          
          {!imageToEdit&&
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Image File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]; // Get the first file selected by the user
                if (file) {
                    setFormData((prev) => ({
                        ...prev,
                        image_file: file, // Set the file in the form data
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        image_file: null, // Reset to null if no file is selected
                    }));
                }
            }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            />
          </div>
}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {imageToEdit ? "Save Changes" : "Upload"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
