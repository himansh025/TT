  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import Logo from '../assets/pcte_ludhiana_cover.jpeg';
  import Button from '../Comp/Button';

  const Otp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOtpChange = (index, value) => {
      if (value.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value.length === 1 && index < 5) {
          const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
          if (nextInput) nextInput.focus();
        }
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle password update logic here
    };

    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center p-4 bg-gray-100">
        {/* Main Container */}
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section (Form) */}
            <div className="w-full md:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                {/* <Logo /> */}
                <img src={Logo} alt="" srcset="" />
                <h1 className="text-3xl font-bold text-center my-8 text-gray-900">
                  Forgot Password ?
                </h1>
                <p className="text-sm text-gray-600 text-center mb-4">
                  OTP sent on: Email ka******2@gmail.com
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-black text-center">
                      Enter OTP
                    </label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          name={`otp-${index}`}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    <Button text={"Verify Otp"}/>
                    <Link
                      to="/forgotpass"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors text-center block"
                    >
                      Resend OTP
                    </Link>
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter New Password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button text="Submit" />
                </form>
              </div>
            </div>

            {/* Right Section (Image) */}
            <div className="hidden md:block md:w-1/2 p-8">
              <img
                src="../src/assets/image.png"
                alt="OTP Verification"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <footer className="mt-8 text-center text-sm text-gray-600">
          © 2025 PCTE ALL RIGHTS RESERVED
        </footer> */}
      </div>
    );
  };

  export default Otp;
