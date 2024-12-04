// thunks for diagnosis api
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import diagnosisApi from '../../services/diagnosisApi';
import { DiagnosisData } from '../../types/diagnosis';

interface DiagnosisState {
  diagnoses: DiagnosisData[] | null;
  diagnosis:DiagnosisData|null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DiagnosisState = {
  diagnoses: null,
  diagnosis:null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchAllDiagnosis = createAsyncThunk('diagnosis/fetchAllDiagnosis', async () => {
  const response = await diagnosisApi.getAllDiagnosis();
  return response;
});

export const createDiagnosis = createAsyncThunk('diagnosis/createDiagnosis', async (diagnosisData: any) => {
  const response = await diagnosisApi.createDiagnosis(diagnosisData);
  return response;
});

export const updateDiagnosis = createAsyncThunk('diagnosis/updateDiagnosis', async ({ diagnosisId, diagnosisData }: { diagnosisId: string; diagnosisData: any }) => {
  const response = await diagnosisApi.updateDiagnosis(diagnosisId, diagnosisData);
  return response;
});

export const fetchDiagnosisById = createAsyncThunk('diagnosis/fetchDiagnosisById', async (diagnosisId: string) => {
  const response = await diagnosisApi.getDiagnosisById(diagnosisId);
  return response;
});

export const fetchDiagnosisByPatient = createAsyncThunk('diagnosis/fetchDiagnosisByPatient', async (patientId: string) => {
  const response = await diagnosisApi.getDiagnosisByPatient(patientId);
  return response;
});

export const fetchDiagnosisByDoctor = createAsyncThunk('diagnosis/fetchDiagnosisByDoctor', async () => {
  const response = await diagnosisApi.getDiagnosisByDoctor();
  return response;
});

export const fetchMyDiagnosis = createAsyncThunk('diagnosis/fetchMyDiagnosis', async () => {
  const response = await diagnosisApi.myDiagnosis();
  return response;
});

export const archiveDiagnosis = createAsyncThunk('diagnosis/archiveDiagnosis', async ({ diagnosisId, diagnosisData }: { diagnosisId: string; diagnosisData: any }) => {
  const response = await diagnosisApi.archiveDiagnosis(diagnosisId,diagnosisData);
  return response;
});

const diagnosisSlice = createSlice({
  name: 'diagnosis',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDiagnosis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllDiagnosis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diagnoses = action.payload;
      })
      .addCase(fetchAllDiagnosis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch diagnosis';
      })
      // Add cases for createDiagnosis, updateDiagnosis, fetchDiagnosisById, fetchDiagnosisByPatient, fetchDiagnosisByDoctor, fetchMyDiagnosis similarly
      .addCase(createDiagnosis.fulfilled, (state, action) => {
        state.diagnoses?.push(action.payload); // Add the new diagnosis to the list
      })
      .addCase(createDiagnosis.rejected, (state,action)=>{
        state.error=action.error.message || 'Failed '
      })
      .addCase(updateDiagnosis.fulfilled, (state, action) => {
        const index = state.diagnoses?.findIndex(diagnosis => diagnosis.id === action.payload.id);
        if (index !== undefined && index !== -1) {
          state.diagnoses![index] = action.payload; // Update the existing diagnosis
        }
      })
      .addCase(fetchDiagnosisById.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.diagnosis=action.payload;
      })
      .addCase(fetchDiagnosisByPatient.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.diagnoses=action.payload;
      })
      .addCase(fetchDiagnosisByDoctor.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.diagnoses=action.payload;
      })
      .addCase(fetchMyDiagnosis.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.diagnoses=action.payload;
      })
      .addCase(archiveDiagnosis.fulfilled, (state)=>{
        state.isLoading=false

      })
  },
});

export const { clearError } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;