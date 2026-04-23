import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, useLocation } from "react-router-dom";
import { LOGIN_MUTATION } from "../graphql/auth.queries";
import { useAuth, type User } from "../../../context/AuthContext";
import toast from "react-hot-toast";

interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}
interface LoginVariables {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Setup Apollo Mutation hook
  const [loginMutation, { loading, error }] = useMutation<
    LoginResponse,
    LoginVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      //  Extract data and update global state
      const { token, user } = data.login;
      login(user, token);

      toast.success(`Welcome back, ${user.firstName}!`);

      // Redirect back to where they were trying to go, or the dashboard
      if (user.role === "OFFICE_MANAGER") {
        navigate("/admin/stats", { replace: true });
      } else if (user.role === "DENTIST") {
        navigate("/patients", { replace: true });
      } else {
        navigate("/dashboard", { replace: true }); // Default for patients
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation({ variables: { email, password } });
    } catch (err) {
      // Errors are handled by the 'error' object from useMutation
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ADS Dental
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enterprise Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error.message}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
