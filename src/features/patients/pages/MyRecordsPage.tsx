import { useQuery } from "@apollo/client/react";
import { GET_MY_XRAYS } from "../graphql/records.queries";
import { useAuth } from "../../../context/AuthContext";
import { FileText, Calendar as CalendarIcon } from "lucide-react";

interface XRay {
  id: string;
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

export const MyRecordsPage = () => {
  const { user } = useAuth();

  if (user?.role !== "PATIENT") {
    return (
      <div className="p-8 text-amber-600">This page is only for patients.</div>
    );
  }
  const patientId = user?.id;
  const { data, loading, error } = useQuery<{ getPatientXRays: XRay[] }>(
    GET_MY_XRAYS,
    {
      variables: { patientId },
      skip: !patientId || user?.role !== "PATIENT", // Don't run the query until we have a user ID
    },
  );

  if (!patientId) {
    return (
      <div className="p-8 text-amber-600">
        Patient profile is not linked to this account yet.
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading medical records...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">
        My Medical Records
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data?.getPatientXRays.map((xray) => {
          console.log("Raw X-Ray Data:", xray);
          return (
            <div
              key={xray.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <img
                src={xray.imageUrl}
                alt="X-Ray"
                className="w-full h-64 object-cover border-b border-gray-100"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <CalendarIcon size={16} />
                  <span>
                    Uploaded on{" "}
                    {new Date(parseInt(xray.uploadedAt)).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="text-brand-500 mt-1" size={20} />
                  <p className="text-gray-700 leading-relaxed">
                    {xray.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data?.getPatientXRays.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">
            No medical images have been uploaded to your profile yet.
          </p>
        </div>
      )}
    </div>
  );
};
