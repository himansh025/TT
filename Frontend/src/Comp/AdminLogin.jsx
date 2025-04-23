import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import axiosInstance from "../Config/apiconfig.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  toast } from "react-toastify";

import { 
  faEye, 
  faEyeSlash, 
  faLock, 
  faEnvelope,
  faRightToBracket
} from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError("");
    
    try {
      const response = await axiosInstance.post(`/api/auth/login`, data);
      console.log("admin login data:", response.data);

      const newuser = {
        token: response.data.token,
        msg: response.data.message,
      };
      const user = response.data.user;

      dispatch(login({ user }));
      sessionStorage.setItem("token",  newuser.token);
      toast.success(response?.data?.message|| "Login Successfully")
      
      navigate("/admin/add-teacher");
    } catch (error) {
      console.log("error", error);
      setLoginError(error.response?.data?.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="hidden md:block md:w-1/2 relative bg-indigo-600">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-blue-700/90 z-10"></div>
            <img 
              src="../assets/pcte_ludhiana_cover.jpeg"
              alt="Admin Portal" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 p-8">
              <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
              <p className="text-xl text-center max-w-md opacity-90">
                Access your administrative dashboard to manage operations effectively.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                <p className="text-gray-600">Please sign in to your account</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Enter Email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
               
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
