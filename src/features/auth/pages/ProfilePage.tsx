import { useAuth } from "../../../context/AuthContext";
import { User, Mail, Shield, Save } from "lucide-react";
import toast from "react-hot-toast";

export const ProfilePage = () => {
  const { user } = useAuth();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Account Settings</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-brand-600 h-32 flex items-end p-8">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
            <User size={48} className="text-gray-300" />
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 pt-16 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                defaultValue={user?.firstName}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                defaultValue={user?.lastName}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                id="email"
                defaultValue={user?.email}
                className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              Role:{" "}
              <span className="font-bold text-brand-600">{user?.role}</span>
            </div>
            <button className="flex items-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
