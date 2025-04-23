import { useState } from "react";
import CryptoJS from "crypto-js";
import { Lock, Mail, User, Calculator, Eye, EyeOff } from "lucide-react";

// const secretKey = import.meta.env.VITE_SECRET_KEY;
const secretKey = "feebank_pcte5824586";

export default function CalculateAttendance() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    option: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const encryptData = (data) => {
    if (!secretKey) {
      console.error("Secret key is missing!");
      return null;
    }
    return CryptoJS.AES.encrypt(data.toString(), secretKey).toString();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.option) {
      setError("Please select a semester");
      return;
    }

    console.log(formData);

    setLoading(true);
    setError("");

    try {
      const encryptedData = {
        username: encryptData(formData.username),
        email: encryptData(formData.email),
        password: encryptData(formData.password),
        option: encryptData(formData.option),
      };

      console.log("encrypted Data", encryptedData);

      const res = await fetch("http://38.137.14.116:3000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(encryptedData),
        timeout: 60000,
      });

      const responseData = await res.json();
      console.log("Response:", responseData);

      if (!res.ok) {
        setError(responseData.error);
        setSuccess(false);
        alert(responseData.error)

      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-800 p-4 text-white text-center">
          <div className="flex justify-center mb-2">
            <Calculator size={32} />
          </div>
          <h2 className="text-2xl font-bold">Calculate Attendance</h2>
          <p className="text-blue-100 text-sm">
            Get your attendance details instantly
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              Success! Your attendance calculation has been sent to your email.
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  username: "",
                  password: "",
                  option: "",
                  email: "",
                });
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            >
              Calculate Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                FeeBank Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Roll Number"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                FeeBank Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Semester
              </label>
              <div className="grid grid-cols-4 gap-2">
                <select
                  value={formData.option}
                  id="option"
                  name="option"
                  className="p-2  border rounded-lg text-center transition duration-200 w-100 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  onChange={handleChange}
                >
                  <option value="0">--Select--</option>
                  <option value="724">SEMESTER - VIII (24-25)</option>
                  <option value="723">SEMESTER - VI (24-25)</option>
                  <option value="722">SEMESTER - IV (24-25)</option>
                  <option value="721">SEMESTER - II (24-25)</option>
                  <option value="710">SEM-VII (24-25)</option>
                  <option value="709">SEM-V (24-25)</option>
                  <option value="708">SEM-III (24-25)</option>
                  <option value="707">SEM-I (24-25)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex justify-center items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Calculate Attendance"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
