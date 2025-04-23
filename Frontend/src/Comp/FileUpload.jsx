import React, { useState } from 'react';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
    } else {
      alert('Please upload only .xlsx files');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
    } else {
      alert('Please upload only .xlsx files');
    }
  };

  const handleFileClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        cursor-pointer transition-colors
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
      `}
      onClick={handleFileClick}
    >
      {!selectedFile ? (
        <>
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="text-base text-black font-bold text-center mb-2">
            Choose a file or drag & drop it here
          </p>
          <p className="text-sm text-gray-400 mb-4">
            .xlsx formats only
          </p>
          <button 
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white transition-colors shadow-sm"
          >
            Browse File
          </button>
        </>
      ) : (
        <div className="text-center">
          <svg
            className="w-12 h-12 text-green-500 mb-4 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-base text-black font-bold mb-2">
            {selectedFile.name}
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Remove file
          </button>
        </div>
      )}
      <input 
        type="file" 
        className="hidden" 
        accept=".xlsx"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;