import React, { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import { Invoice } from "../../types/invoice";
import { FileText, User, Calendar, DollarSign, Download } from "lucide-react";
import { getInvoicePdf } from "../../store/slices/billingSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  patient: String | null;
  staff?: String | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  patient,
  staff,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (invoice?.id) {
      dispatch(getInvoicePdf(invoice.id));
    }
  }, [dispatch, invoice]);

  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice #${invoice.id}`}>
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Invoice Details
              </h3>
              <p className="text-sm text-gray-500">#{invoice.id}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4">
          {user?.role === "admin" ||
            (user?.role === "billing_staff" && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Patient Name
                </label>
                <p className="mt-1 flex items-center text-sm text-gray-900">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {patient}
                </p>
              </div>
            ))}

          {user?.role === "admin" && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Issued By
              </label>
              <p className="mt-1 flex items-center text-sm text-gray-900">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                {staff}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Date</label>
            <p className="mt-1 flex items-center text-sm text-gray-900">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {invoice.due_date}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Amount</label>
            <p className="mt-1 flex items-center text-sm text-gray-900">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />$
              {invoice.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Invoice Items */}

        {/* Invoice Image */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Invoice Document
          </h4>
          <div className="aspect-[8.5/11] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`http://localhost:8001/api/pdf/${invoice?.id}/`}
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
            {/* <iframe src={`http://localhost:8001/${invoice?.invoice_file}`} width="100%" height="100%" frameBorder="0"></iframe> */}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-4">
          <a
            href={`http://localhost:8001/api/pdf/${invoice?.id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </a>
        </div>
      </div>
    </Modal>
  );
};
