import { useQuery } from "@apollo/client/react";
import { GET_ALL_INVOICES } from "../graphql/billing.queries";
import { useState } from "react";
import { Search } from "lucide-react";
import { CreateInvoiceForm } from "../components/CreateInvoiceForm";

interface AdminInvoice {
  id: string;
  amount: number;
  issueDate: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const AdminBillingPage = () => {
  const { data, loading, error } = useQuery<{ getAllInvoices: AdminInvoice[] }>(
    GET_ALL_INVOICES,
  );
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div className="p-8">Loading clinic finances...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const filteredInvoices = data?.getAllInvoices.filter((inv) =>
    `${inv.patient?.firstName} ${inv.patient?.lastName} ${inv.patient?.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Accounts
            </h1>
            <p className="text-gray-500">
              Manage clinic revenue and patient invoices.
            </p>
          </div>
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search patient name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Invoice ID</th>
                <th className="p-4 font-semibold text-gray-600">Patient</th>
                <th className="p-4 font-semibold text-gray-600">Issue Date</th>
                <th className="p-4 font-semibold text-gray-600">Amount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm font-mono text-gray-500">
                    #{invoice.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">
                      {invoice.patient?.firstName} {invoice.patient?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.patient?.email}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        invoice.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
