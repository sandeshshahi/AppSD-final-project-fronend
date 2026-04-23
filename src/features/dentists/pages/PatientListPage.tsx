import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_MY_PATIENTS } from "../graphql/dentist.queries";
import { User, FileUp, Search, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  appointments: {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    dentist: { id: string; email: string };
  }[];
}

export const PatientListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const dentistId = user?.id;

  const { data, loading, error } = useQuery<{
    getPatientsForDentist: Patient[];
  }>(GET_MY_PATIENTS, {
    variables: { dentistId },
    skip: !dentistId, // Don't run until we have the dentist's ID
  });

  if (!dentistId) return <div className="p-8">Authenticating...</div>;
  if (loading) return <div className="p-8">Loading your patients...</div>;
  if (error)
    return (
      <div className="p-8 text-red-500">
        Error fetching your patients: {error.message}
      </div>
    );

  const filteredPatients = data?.getPatientsForDentist.filter((p) =>
    `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients?.map((patient) => {
          const relevantApt = patient.appointments
            ?.filter((apt) => apt.dentist?.email === user?.email)
            .sort(
              (a, b) =>
                new Date(a.appointmentDate).getTime() -
                new Date(b.appointmentDate).getTime(),
            )[0];

          return (
            <div
              key={patient.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
              {relevantApt ? (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-6 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Calendar size={16} className="text-brand-500" />
                    {relevantApt.appointmentDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Clock size={16} className="text-brand-500" />
                    {relevantApt.appointmentTime}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg mb-6 border border-gray-100 text-sm text-gray-400 text-center">
                  No upcoming appointments
                </div>
              )}
              <button
                onClick={() => navigate(`/upload-xray/${patient.id}`)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-brand-50 text-brand-700 font-medium rounded-lg transition-colors border border-gray-100"
              >
                <FileUp size={18} /> Upload X-Ray
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
