import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

const TimeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("ET Block");
  const [loader, setLoader] = useState(false);

  // Only ET Block is enabled, other options are commented out
  const options = [
    "ET Block", 
    // "MT Block",  
    // "HM Block", 
    // "PH Block", 
    // "Campus 1",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file);
    } else {
      alert("Please upload only .xlsx files");
    }
    e.target.value = null;
  };

  const handleFileClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file);
    } else {
      alert("Please upload only .xlsx files");
    }
  };

  const handleUpdate = async () => {
    if (selectedOption && selectedFile) {
      // console.log("Uploading file:", selectedFile.name, "for block:", selectedOption);
      setLoader(true);
      try {
        // Create FormData for the file upload
        const formData = new FormData();
        formData.append("excel_file", selectedFile);
        formData.append("block", selectedOption);
        
        // Using axios.post which is the correct method for file uploads
        const response = await axios.post(
          'https://timetable-backend-five.vercel.app/upload',
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        // console.log("Upload response:", response);
        
        if (response.status === 200) {
          setLoader(false);
          toast.success(response?.data?.message || "Uploaded successfully");
          setSelectedFile(null);
          alert("Upload successful!");
        }
      } catch (error) {
        setLoader(false);
        // console.error("Upload failed:", error);
        
        
        toast.error("Upload failed. Please try again.");
        alert("Upload failed. Please try again.");
      }
    } else {
      alert("Please select a block and upload a file before submitting.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {loader && (
          <div className="fixed inset-0 bg-blue-950 bg-opacity-50 items-center flex justify-center flex-col z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <h1 className="text-3xl mt-4 text-white">Uploading</h1>
          </div>
        )}

        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Upload Time Table</h1>
          
          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Left Side - Options */}
            <div className="w-full md:w-2/5">
              <h2 className="text-sm font-medium mb-2 text-gray-500">Upload new Time Table</h2>
              
              {/* Scrollable container for blocks */}
              <div className="max-h-64 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                <div className="space-y-2">
                  {options.map((option) => (
                    <div 
                      key={option}
                      className={`px-4 py-2 border rounded-md cursor-pointer flex items-center ${
                        selectedOption === option ? "bg-blue-50 border-blue-500" : "border-gray-300"
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {selectedOption === option && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M6.66675 10.1148L12.7947 3.98608L13.7381 4.92875L6.66675 12.0001L2.42408 7.75742L3.36675 6.81475L6.66675 10.1148Z" fill="#3B82F6"/>
                        </svg>
                      )}
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleUpdate}
                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors font-medium text-base"
              >
                Update
              </button>
            </div>
            
            {/* Right Side - File Upload */}
            <div className="w-full md:w-3/5 mt-6 md:mt-0">
              <h2 className="text-sm font-medium mb-2">Upload Time Table here</h2>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileClick}
                className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[200px] ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                {!selectedFile ? (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-4" />
                    <p className="text-base font-medium text-center mb-1">
                      Choose a file or drag & drop it here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      .xlsx formats only
                    </p>
                    <button className="px-4 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                      Browse File
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <svg className="w-6 h-6 text-green-500 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-base font-medium mb-2">{selectedFile.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  className="hidden"
                  name="excel_file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your global CSS to customize the scrollbar
const globalStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
`;

export default TimeUpload;
