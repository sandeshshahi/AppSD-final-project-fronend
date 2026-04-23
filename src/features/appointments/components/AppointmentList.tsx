import { useQuery } from "@apollo/client/react";
import { GET_MY_APPOINTMENTS } from "../graphql/my-appointments.queries";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  dentist: {
    firstName: string;
    lastName: string;
  };
  surgery: { id: string; name: string };
}

export const AppointmentList = () => {
  const { user } = useAuth();
  const patientId = user?.id;

  const { data, loading, error } = useQuery<{
    getPatientAppointments: Appointment[];
  }>(GET_MY_APPOINTMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  if (!patientId) return null;

  if (loading) return <LoadingSpinner />;
  if (error) {
    console.error("GraphQL Error Details:", error);
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Failed to load appointments.
      </div>
    );
  }

  const appointments = data?.getPatientAppointments || [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Upcoming Appointments
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">You have no upcoming appointments.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-brand-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {new Date(apt.appointmentDate).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {apt.appointmentTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      Dr. {apt.dentist.firstName} {apt.dentist.lastName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                <MapPin size={14} /> {apt.surgery.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
