import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import billingApi from '../../services/billingApis';
import { Invoice } from '../../types/invoice';

interface BillingState {
  bills: Invoice[] | null;
  bill:Invoice[]|null;
  isLoading: boolean;
  error: string | null;
  invoicePdf:string|null;
}

const initialState: BillingState = {
  bills: null,
  bill:null,
  isLoading: false,
  error: null,
  invoicePdf:null,
};

// Async Thunks
export const fetchAllBills = createAsyncThunk('billing/fetchAllBills', async () => {
  const response = await billingApi.getAllBills();
  return response;
});

export const createBill = createAsyncThunk('billing/createBill', async (billData: any) => {
  const response = await billingApi.createBill(billData);
  return response;
});

export const updateBill = createAsyncThunk('billing/updateBill', async ({ billId, billData }: { billId: string; billData: any }) => {
  const response = await billingApi.updateBill(billId, billData);
  return response;
});

export const fetchBillById = createAsyncThunk('billing/fetchBillById', async (billId: string) => {
  const response = await billingApi.getBillById(billId);
  return response;
});

export const fetchBillsByStaff = createAsyncThunk('billing/fetchBillsByStaff', async () => {
  const response = await billingApi.getBillsByStaff();
  return response;
});

export const fetchBillsByPatient = createAsyncThunk('billing/fetchBillsByPatient', async (patientId: string) => {
  const response = await billingApi.getBillsByPatient(patientId);
  return response;
});

export const fetchMyBills = createAsyncThunk('billing/fetchMyBills', async () => {
  const response = await billingApi.getMyBills();
  return response;
});

export const deleteBill = createAsyncThunk('billing/deleteInvoice', async (invoiceId: string) => {
  const response = await billingApi.deleteBill(invoiceId);
  return response;
});

export const getInvoicePdf = createAsyncThunk('billing/getInvoicePdf', async (invoiceId: string) => {
  const response = await billingApi.getInvoicePdf(invoiceId);
  return response;
});

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload;
      })
      .addCase(fetchAllBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch bills';
      })
      // Add cases for createBill, updateBill, fetchBillById, fetchBillsByStaff, fetchBillsByPatient, fetchMyBills similarly
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills?.push(action.payload); // Add the new bill to the list
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        const index = state.bills?.findIndex(bill => bill.id === action.payload.id);
        if (index !== undefined && index !== -1) {
          state.bills![index] = action.payload; // Update the existing bill
        }
      })
      .addCase(fetchBillById.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.bill=action.payload;
      })
      .addCase(fetchBillsByStaff.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.bills=action.payload;
      })
      .addCase(fetchBillsByPatient.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.bills=action.payload;
      })
      .addCase(fetchMyBills.fulfilled, (state, action)=>{
        state.isLoading=false;
        state.bills=action.payload;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        const index = state.bills?.findIndex(bill => bill.id === action.payload.id);
        if (index !== undefined && index !== -1) {
          state.bills!.splice(index, 1); // Remove the bill from the list
        }
      })
      .addCase(getInvoicePdf.fulfilled, (state, action) => {
        state.isLoading=false;
        state.invoicePdf=action.payload;
      })

  },
});

export const { clearError } = billingSlice.actions;
export default billingSlice.reducer;