import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { CreditCard, User, Calendar, DollarSign, CheckCircle, XCircle, Search,Eye, FileText } from 'lucide-react';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { AddEditInvoiceModal } from '../components/modals/AddEditInvoiceModal';
import Pagination from '../components/Pagination';
import { createBill, fetchAllBills,fetchBillById,fetchBillsByPatient, updateBill,fetchMyBills,deleteBill,fetchBillsByStaff} from '../store/slices/billingSlice';
import { Invoice } from '../types/invoice';
import { fetchUsers } from '../store/slices/authSlice';




export default function Invoices() {
  const { user,users } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const {bills}=useAppSelector((state)=>state.billing);
  const isBillingStaff = user?.role === 'billing_staff';
  const dispatch=useAppDispatch()

  const billsRef=useRef(false);
  const usersRef=useRef(false);

  useEffect(() =>{
    if(!billsRef.current&& (user?.role=="admin")){
      billsRef.current=true;
      dispatch(fetchAllBills());
      
    }

  },[dispatch,user])

  useEffect(() =>{
    if(!billsRef.current&& (user?.role=="billing_staff")){
      billsRef.current=true;
      dispatch(fetchBillsByStaff());
      
    }

  },[dispatch,user])


  useEffect(()=>{
    if(users?.length==0&& (user?.role=="admin"||user?.role=="billing_staff")&&!usersRef.current){
      usersRef.current=true;
      dispatch(fetchUsers())

    }

  },[dispatch,users])

  useEffect(() =>{
    if(!usersRef.current&& user?.role=="patient"){
      usersRef.current=true;
      dispatch(fetchMyBills());
      
    }

  },[dispatch])

  const [patient, setPatient] = useState<string | null>(null);
  const [staff, setStaff] = useState<string | null>(null);
  const getPatientName = (patientId: any) => {
    const patient = users?.find((user) => user.id === patientId);
    return patient?.username || null; // Return null if not found
};

const getStaffName = (staffId: any) => {
    const staff = users?.find((user) => user.id === staffId);
    return staff?.username || null; // Return null if not found
};

  const filteredInvoices = bills?.filter((invoice) => {
    const patientName = getPatientName(invoice.patient);
    const staffName = getStaffName(invoice.staff);
    
    return (
        invoice.due_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patientName && patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staffName && staffName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}) || [];

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
    setPatient(getPatientName(invoice.patient) || null); // Set to null if undefined
    setStaff(getStaffName(invoice.staff) || null);
  };


  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAddNew = () => {
    setSelectedInvoice(null);
    setModalMode('add');
    setIsAddEditModalOpen(true);
  };

  

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('edit');
    setIsAddEditModalOpen(true);
  };

  const handleInvoiceSubmit = async (invoiceData: Invoice) => {
    try {
      if (modalMode === 'add') {
        // Call the createBill thunk
        const resultAction = await dispatch(createBill(invoiceData));
        if (createBill.fulfilled.match(resultAction)) {
          console.log('New invoice created:', resultAction.payload);
        } else {
          throw new Error(resultAction.error.message);
        }
      } else {
        // Call the updateBill thunk
        const resultAction = await dispatch(updateBill({ billId: selectedInvoice?.id as string, billData: invoiceData }));
        if (updateBill.fulfilled.match(resultAction)) {
          console.log('Invoice updated:', resultAction.payload);
        } else {
          throw new Error(resultAction.error.message);
        }
      }
  
      setIsAddEditModalOpen(false);
      setSelectedInvoice(null);
      
      // Optionally show success message
      // toast.success('Invoice saved successfully');
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      // Optionally show error message
      // toast.error('Failed to save invoice');
    }
  };

  const markAsPaid = async (invoiceId: any) => {
    try {
      await dispatch(updateBill({ billId: invoiceId, billData: { status: 'paid' } }));
      // Optionally show success message
      // toast.success('Invoice marked as paid successfully');
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      // Optionally show error message
      // toast.error('Failed to mark invoice as paid');
    }
  };
  const handleDelete = async (invoiceId: any) => {
    try {
      await dispatch(deleteBill(invoiceId));
      // Optionally show success message
      // toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      // Optionally show error message
      // toast.error('Failed to delete invoice');
    }
  };



  // get pateitn name based on id from users
 

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        {isBillingStaff && (
          <button 
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Invoice
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                     placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                     focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by bill number, patient name, or issued by..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
      <div className="grid grid-cols-1 gap-4">
          {currentItems.map((invoice) => (
            <div key={invoice.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FileText className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">#{invoice.id}</span>
                      </div>
                      {
                        user?.role==="admin"|| user?.role==="billing_staff" && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="text-gray-600">{getPatientName(invoice.patient)}</span>
                          </div>
                        )
                      }

                     
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {invoice.due_date}
                      </div>
                      {user?.role==="admin" && (
                        <div className="flex items-center text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {getStaffName(invoice.staff)}
                        </div>
                      )}
                     
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                      </div>
                      <div className={`flex items-center ${
                        invoice.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
        <button
          onClick={() => handleViewInvoice(invoice)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        {isBillingStaff && (
          <>
            <button
              onClick={() => handleEdit(invoice)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(invoice.id)}
              className="text-red-600 hover:text-indigo-800"
            >
              Delete
            </button>
            {invoice.status === 'pending' && (
              <button className="text-green-600 hover:text-green-800" onClick={() => markAsPaid(invoice.id)}>
                Mark as Paid
              </button>
            )}
          </>
        )}
      </div>
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No invoices found
            </div>
          )}

        </div>
      </div>
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
/>
      <InvoiceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        patient={patient}
        staff={staff}
      />

<AddEditInvoiceModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        mode={modalMode}
        onSubmit={handleInvoiceSubmit}
        users={users}
      />
    </div>
  );
}