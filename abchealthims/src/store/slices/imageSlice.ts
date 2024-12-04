// image slice for images api
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import imageApi from '../../services/imageApis';
import { ImageData } from '../../types/image';

interface ImageState {
  images: ImageData[] | null;
  image:ImageData|null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: null,
  image:null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchAllImages = createAsyncThunk('image/fetchAllImages', async () => {
  const response = await imageApi.getAllImages();
  return response;
});

export const createImage = createAsyncThunk('image/createImage', async (imageData: any) => {
  const response = await imageApi.createImage(imageData);
  return response;
});

export const updateImage = createAsyncThunk('image/updateImage', async ({ imageId, imageData }: { imageId: string; imageData: any }) => {
  const response = await imageApi.updateImage(imageId, imageData);
  return response;
});

export const fetchImageById = createAsyncThunk('image/fetchImageById', async (imageId: string) => {
  const response = await imageApi.getImageById(imageId);
  return response;
});

export const fetchImagesByPatient = createAsyncThunk('image/fetchImagesByPatient', async (patientId: string) => {
  const response = await imageApi.getImageByPatient(patientId);
  return response;
});

export const fetchImagesByRadiologist = createAsyncThunk('image/fetchImagesByRadiologist', async () => {
  const response = await imageApi.getImageByRadiologist();
  return response;
});

export const fetchMyImages = createAsyncThunk('image/fetchMyImages', async () => {
  const response = await imageApi.myImages();
  return response;
});

export const archiveImage = createAsyncThunk('image/archiveImage', async ({ imageId, imageData }: { imageId: string; imageData: any }) => {
  const response = await imageApi.archiveImage(imageId,imageData);
  return response;
});

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
      })
      .addCase(fetchAllImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch images';
      })
      // Add cases for createImage, updateImage, fetchImageById, fetchImagesByPatient, fetchImagesByRadiologist, fetchMyImages similarly
      .addCase(createImage.fulfilled, (state, action) => {
        state.images?.push(action.payload); // Add the new image to the list
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.images?.findIndex(image => image.id === action.payload.id);
        if (index !== undefined && index !== -1) {
          state.images![index] = action.payload; // Update the existing image
        }
      })
      .addCase(fetchImageById.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.image=action.payload;
      })
      .addCase(fetchImagesByPatient.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.images=action.payload;
      })
      .addCase(fetchImagesByRadiologist.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.images=action.payload;
      })
      .addCase(fetchMyImages.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.images=action.payload;
      })
      .addCase(archiveImage.fulfilled, (state)=>{
        state.isLoading=false

      })
  },
});

export const { clearError } = imageSlice.actions;
export default imageSlice.reducer;
