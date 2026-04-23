import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_MY_XRAYS } from "../graphql/records.queries";
import { Calendar, FileText, User, Plus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { AppointmentList } from "../../appointments/components/AppointmentList";

interface XRay {
  id: string;
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

export const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch the X-Rays!
  const { data, loading } = useQuery<{ getPatientXRays: XRay[] }>(
    GET_MY_XRAYS,
    {
      variables: { patientId: user?.id },
      skip: !user?.id || user?.role !== "PATIENT",
    },
  );

  if (user?.role !== "PATIENT") {
    return (
      <div className="p-8 text-amber-600">
        This dashboard is only for patients.
      </div>
    );
  }

  // Grab only the two most recent X-Rays for the dashboard view
  const recentXRays = data?.getPatientXRays?.slice(0, 2) || [];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-500">
          Manage your dental health and upcoming visits.
        </p>
      </header>

      {/* Quick Actions Grid (Keep exactly as you have it) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button
          onClick={() => navigate("/book-appointment")}
          className="flex flex-col items-center p-6 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-md transition-all group"
        >
          <div className="p-3 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="text-lg font-semibold">Book Appointment</span>
          <span className="text-sm opacity-80">
            Find a time that works for you
          </span>
        </button>

        <div className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
            <Calendar size={32} />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            My Schedule
          </span>
          <span className="text-sm text-gray-500 text-center">
            Check your upcoming dental visits
          </span>
        </div>

        <div className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-full mb-4">
            <FileText size={32} />
          </div>
          <span className="text-lg font-semibold text-gray-900">Billing</span>
          <span className="text-sm text-gray-500 text-center">
            View and pay your recent invoices
          </span>
        </div>
      </section>

      {/* 4. 🚀 THE FIX: Dynamic Health Records Section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Health Records
          </h2>
          <button
            onClick={() => navigate("/my-records")}
            className="text-brand-600 text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading records...
          </div>
        ) : recentXRays.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
            <User className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">
              No recent X-Rays or checkup results found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentXRays.map((xray) => (
              <div
                key={xray.id}
                className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50"
              >
                <img
                  src={xray.imageUrl}
                  alt="X-Ray Thumbnail"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-gray-800 line-clamp-1">
                    {xray.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {/* Using a safe date fallback just in case! */}
                    {new Date(
                      parseInt(xray.uploadedAt) || xray.uploadedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <AppointmentList />
      </section>
    </div>
  );
};
