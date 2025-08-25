import React from 'react'

function CollegeClosedComponent() {
return (
      <div className="bg-white rounded-lg shadow-md border border-blue-300 overflow-hidden w-full">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <div className="w-24 h-24 bg-amber-900 rounded-full flex items-center justify-center relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-amber-900"></div>
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-300 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-amber-300 rounded-full"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-amber-300 font-bold text-lg">CLOSE</span>
                <div className="w-16 h-0.5 bg-amber-300 mt-1"></div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800">College Closed</h3>
        </div>
      </div>
    );
}

export default CollegeClosedComponent
