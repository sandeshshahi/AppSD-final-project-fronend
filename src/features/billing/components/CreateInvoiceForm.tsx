import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_INVOICE, GET_ALL_INVOICES } from "../graphql/billing.queries";
import { GET_CLINIC_STATS } from "../../analytics/graphql/analytics.queries"; // If you want to update stats too
import { Receipt, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface CreateInvoiceResponse {
  createInvoice: {
    id: string;
    amount: number;
    status: string;
  };
}
interface CreateInvoiceVariables {
  appointmentId: string;
  amount: number;
}

export const CreateInvoiceForm = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [amount, setAmount] = useState("");

  const [createInvoice, { loading }] = useMutation<
    CreateInvoiceResponse,
    CreateInvoiceVariables
  >(CREATE_INVOICE, {
    // Automatically refresh the Admin table and Analytics after creating!
    refetchQueries: [{ query: GET_ALL_INVOICES }, { query: GET_CLINIC_STATS }],
    onCompleted: (data) => {
      toast.success(
        `Invoice #${data.createInvoice.id} generated successfully!`,
      );
      // Clear the form
      setAppointmentId("");
      setAmount("");
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert the string input to a float for GraphQL
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    await createInvoice({
      variables: {
        appointmentId: appointmentId,
        amount: parsedAmount,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
          <Receipt size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Generate New Bill</h2>
          <p className="text-sm text-gray-500">
            Attach an invoice to a completed appointment.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment ID
          </label>
          <input
            type="text"
            required
            placeholder="e.g., 10"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="190.00"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          {loading ? "Generating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};
