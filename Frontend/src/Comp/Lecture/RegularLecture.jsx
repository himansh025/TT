
import {
    IoLocationOutline,
    IoBook,
    IoTimeOutline,
} from "react-icons/io5";

import React from 'react'

function RegularLecture({lecture, type}) {
        // Safe string check function - converts any value to string or returns empty string
  const safeString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value); // Convert any value to string safely
  };

    if (lecture.type === "major_project" && Array.isArray(lecture.data)) {
        return lecture.data.map((domain, idx) => (
            <div
                key={`${lecture.id}-${idx}`}
                className={` rounded-xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white border-l-4 border-blue-500 duration-300 w-full max-w-md mx-auto`}
            >
                <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {type === "now" ? "NOW" : "NEXT"}
                    </span>
                </div>

                <div className="flex items-center text-blue-600 font-semibold text-md mb-2">
                    <IoTimeOutline className="w-6 h-6 mr-2 text-blue-500" />{lecture?.time}
                </div>

                <div className=" justify-between text-sm text-gray-700 mb-2">
                    <div className="flex ">
                        <IoLocationOutline className="w-6 mr-2 h-6 text-blue-500" />
                        Venue :
                        <span className="font-semibold ml-2">{safeString(domain.venue)}  </span>
                    </div>
                    <div className="flex items-center text-lg font-bold  mb-1">
                        <IoBook className="w-6 h-6 mr-3 text-yellow-500" />
                        Subject : {safeString(domain.subject).toUpperCase()}
                    </div>
                </div>

                <p className="text-sm text-blue-700 font-semibold">
                    Teacher Code: <span className="font-normal">{safeString(domain.teacher).toUpperCase()}</span>
                </p>

            </div>
        ));
    }

    return (
        <div
            key={lecture.id}
            className={` rounded-xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white border-l-4 border-blue-500 duration-300 w-full max-w-md mx-auto`}>
            <div className="mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {type === "now" ? "NOW" : "NEXT"}
                </span>
            </div>

            <div className="flex items-center text-blue-600 font-semibold text-md mb-2">
                <IoTimeOutline className="w-6 h-6 mr-2 text-blue-500" />{lecture.time}
            </div>


            <div className=" justify-between text-sm text-gray-700 mb-2">
                <div className="flex ">
                    <IoLocationOutline className="w-6 mr-2 h-6 text-blue-500" />
                    Venue :
                    <span className="font-semibold ml-2">{safeString(lecture.venue)}  </span>
                </div>   <div className="flex items-center text-lg font-bold  mb-1">
                    <IoBook className="w-6 h-6 mr-3 text-yellow-500" />
                    Subject : {safeString(lecture.subject).toUpperCase()}
                    {lecture.type === "lab" ? "- LAB" : ""}
                </div>
            </div>
            <p className="text-sm text-blue-700 font-semibold">
                Teacher Code: <span className="font-normal">{safeString(lecture.teacher).toUpperCase()}</span>
            </p>
        </div>
    );
}

export default RegularLecture
