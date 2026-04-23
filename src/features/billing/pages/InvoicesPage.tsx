import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_INVOICES, PAY_INVOICE } from "../graphql/billing.queries";
import { DollarSign, CheckCircle, Clock, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface Invoice {
  id: string;
  amount: number;
  issueDate: string;
  status: "PAID" | "UNPAID" | "PENDING";
}

export const InvoicesPage = () => {
  const { data, loading, error } = useQuery<{ myInvoices: Invoice[] }>(
    GET_MY_INVOICES,
  );

  const [payInvoice, { loading: paying }] = useMutation(PAY_INVOICE, {
    // Refresh the list after successful payment
    refetchQueries: [{ query: GET_MY_INVOICES }],
    onCompleted: () => toast.success("Invoice paid successfully!"),
    onError: (err) => toast.error(err.message),
  });

  const handlePayment = async (invoiceId: string) => {
    await payInvoice({ variables: { invoiceId } });
  };

  if (loading) return <div className="p-8">Loading your invoices...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const invoices = data?.myInvoices || [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Billing & Invoices
        </h1>
        <p className="text-gray-500">
          View and manage your dental clinic payments.
        </p>
      </header>

      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">You have no invoices on record.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div
                  className={`p-3 rounded-full ${invoice.status === "PAID" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                >
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Invoice #{invoice.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  ${invoice.amount.toFixed(2)}
                </div>

                {invoice.status === "PAID" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg">
                    <CheckCircle size={18} /> Paid
                  </div>
                ) : (
                  <button
                    onClick={() => handlePayment(invoice.id)}
                    disabled={paying}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    <Clock size={18} /> {paying ? "Processing..." : "Pay Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
