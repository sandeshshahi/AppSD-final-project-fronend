import { Link } from "react-router-dom";
import { Calendar, Shield, Clock, ArrowRight } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-2xl">
          <div className="bg-brand-600 text-white p-1 rounded-lg">ADS</div>
          <span>Dental</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-gray-600 font-medium hover:text-brand-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-shadow shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-brand-600 font-bold tracking-widest uppercase text-sm">
            Advanced Dental Solutions
          </span>
          <h1 className="text-6xl font-extrabold text-gray-900 mt-4 leading-tight">
            Digital Dental Care <br />
            <span className="text-brand-600">Simplified.</span>
          </h1>
          <p className="text-gray-500 text-xl mt-6 leading-relaxed">
            Manage your appointments, view medical X-rays, and handle billing
            all in one secure platform.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-brand-700"
            >
              Book Appointment <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="bg-brand-50 rounded-3xl p-12 aspect-square flex items-center justify-center">
          <Calendar size={200} className="text-brand-200" />
        </div>
      </header>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Clock />}
            title="24/7 Booking"
            desc="Schedule your visit anytime from any device."
          />
          <FeatureCard
            icon={<Shield />}
            title="Secure Records"
            desc="Encrypted storage for your X-rays and medical history."
          />
          <FeatureCard
            icon={<Calendar />}
            title="Staff Portal"
            desc="Efficient management for Dentists and Office Managers."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <div className="text-brand-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);
