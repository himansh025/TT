import React, { useState, useEffect } from "react";
import { Book, Laptop, Coffee, ChevronDown, Utensils, Users, Calendar, X } from "lucide-react";
import axiosInstance from "../Config/apiconfig.js";
import {
  IoLocationOutline,
  IoBook,
  IoTimeOutline,
} from "react-icons/io5";

// Initialize departments structure
const initialDepartments = {
  ET: { name: "Engineering & Technology", classes: [] },
};

const LiveLectures = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState("ET");
  const [selectedClass, setSelectedClass] = useState("BCA-1A");
  const [isBlocksOpen, setIsBlocksOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCollegeClosed, setIsCollegeClosed] = useState(false);


  // Load departments and classes from localStorage or API
  useEffect(() => {
    const loadDepartmentsAndClasses = async () => {
      try {
       
        await fetchAllClasses();

        // Try to get departments from localStorage first
        // const storedDepartments = localStorage.getItem("departments");

        // if (storedDepartments) {
        //   // If data exists in localStorage, use it
        //   const parsedDepartments = JSON.parse(storedDepartments);
        //   setDepartments(parsedDepartments);
        // } else {
        //   // If not in localStorage, fetch from API
        //   await fetchAllClasses();
        // }
      } catch (error) {
        // console.error("Error loading departments:", error);
      }
    };

    loadDepartmentsAndClasses();
  }, []);

  // Function to fetch all classes from API
  const fetchAllClasses = async () => {
    try {
      const response = await axiosInstance.get(`/api/classes/getAll`);

      if (response.status !== 200) {
        alert("No Classes Received From Database!");
        return;
      }

      const classes = response.data.result;
      const newDepartments = {
        ET: { name: "Engineering & Technology", classes: [] },
      };

      classes.forEach((clsObj) => {
        if (clsObj["block"].includes("ET")) {
          newDepartments["ET"].classes.push(clsObj.name);
        }
      });

      // Save to state and localStorage
      setDepartments(newDepartments);
      localStorage.setItem("departments", JSON.stringify(newDepartments));
      // console.log("Departments stored in localStorage.");
    } catch (error) {
      // console.error("Classes fetch failed:", error);
    }
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    setSelectedClass(departments[dept].classes[0] || "");
    setIsBlocksOpen(false);
  };

  // Safe string check function - converts any value to string or returns empty string
  const safeString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value); // Convert any value to string safely
  };
  
  // Safe toLowerCase function that handles non-string values
  const safeLowerCase = (value) => {
    const str = safeString(value);
    return str.toLowerCase();
  };

  const getLecture = async (clsname) => {
    if (!clsname) return;

    setLoading(true);
    setIsCollegeClosed(false);
    try {
      const response = await axiosInstance.post(`/live`, { cls: clsname });
      console.log(response.data);
      if (response.status !== 200) {
        alert(response.data.message);
        return;
      }
      // Check if college is closed by examining the data - using safeLowerCase
      const isClosedStatus = response.data.some(lecture =>
        safeLowerCase(lecture.subject).includes("closed") ||
        safeLowerCase(lecture.teacher).includes("closed") ||
        safeLowerCase(lecture.venue).includes("closed") ||
        safeLowerCase(lecture.type).includes("closed")
      );

      setIsCollegeClosed(isClosedStatus);
      setData(response.data);
      // setData(dummy);

    } catch (error) {
      alert("Lecture Data Load failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the appropriate icon based on lecture type - using safeLowerCase
  const getLectureIcon = (type) => {
    switch (safeLowerCase(type)) {
      case "lecture":
        return <Book className="h-6 w-6 text-gray-700" />;
      case "lab":
        return <Laptop className="h-6 w-6 text-gray-700" />;
      case "major_project":
        return <Laptop className="h-6 w-6 text-gray-700" />;
      case "lunch":
      case "lunch break":
        return <Utensils className="h-6 w-6 text-gray-700" />;
      case "tea":
      case "tea break":
        return <Coffee className="h-6 w-6 text-gray-700" />;
      case "meeting":
      case "departmental meeting":
      case "friday meeting":
        return <Users className="h-6 w-6 text-gray-700" />;
      case "closed":
        return <X className="h-6 w-6 text-gray-700" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-700" />;
    }
  };

  // Check if a lecture is special (like break, meeting, etc.) - using safeLowerCase
  const isSpecialLecture = (lecture) => {
    const specialTypes = ["lunch", "tea", "break", "meeting", "closed","sunday", "free"];
    return specialTypes.some(type =>
      safeLowerCase(lecture.type).includes(type) ||
      safeLowerCase(lecture.status).includes(type) ||
      safeLowerCase(lecture.subject).includes(type) ||
      safeLowerCase(lecture.teacher).includes(type) ||
      safeLowerCase(lecture.venue).includes(type)
    );
  };

  // Get special lecture title - using safeLowerCase
  const getSpecialLectureTitle = (lecture) => {
    if (safeLowerCase(lecture.subject).includes("free") || safeLowerCase(lecture.teacher).includes("free")) {
      return "Free Lecture";
    } else if (safeLowerCase(lecture.type).includes("lunch") || safeLowerCase(lecture.venue).includes("lunch")) {
      return "Lunch Break";
    }
    else if (safeLowerCase(lecture.status).includes("sunday")) {
      return "Sunday";
    }
      else if (safeLowerCase(lecture.subject).includes("tea") || safeLowerCase(lecture.venue).includes("tea")) {
      return "Tea Break";
    } else if (safeLowerCase(lecture.subject).includes("meeting") || safeLowerCase(lecture.type).includes("meeting")) {
      if (safeLowerCase(lecture.subject).includes("friday")) {
        return "FRIDAY MEETING";
      } else {
        return "DEPARTMENTAL MEETING";
      }
    } else if (safeLowerCase(lecture.subject).includes("closed") || safeLowerCase(lecture.type).includes("closed")) {
      return "College is Closed";
    } else {
      return lecture.subject;
    }
  };

  // Get time range for special lectures
  const getTimeRange = (lecture) => {
    if (lecture.time?.includes("-")) return lecture.time;

    // Estimate end time (add 1 hour to start time)
    const startTime = lecture.time;
    if (!startTime) return "";

    try {
      const [timeStr, period] = startTime.split(" ");
      const [hours, minutes] = timeStr.split(":");
      let hour = parseInt(hours);

      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      let endHour = hour + 1;
      let endPeriod = period;

      if (endHour === 12 && period === "AM") endPeriod = "PM";
      if (endHour > 12) {
        endHour -= 12;
        if (period === "AM") endPeriod = "PM";
      }

      return `${timeStr} - ${endHour}:${minutes} ${endPeriod}`;
    } catch (e) {
      return startTime;
    }
  };

  // College Closed UI Component
  const CollegeClosedComponent = () => {
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
  };

  // Render regular lecture - now handling non-string values safely
  const renderRegularLecture = (lecture, type) => {
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
  };

  // Render special lecture
  const renderSpecialLecture = (lecture, type) => {
    const title = getSpecialLectureTitle(lecture);
    const timeRange = getTimeRange(lecture);

    return (
      <div
        key={lecture.id}
        className=" bg-green-50 border-l-4 border-green-500 rounded-lg  pb-2 shadow-xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
    
         
        <div className="p-4 flex flex-col items-center justify-center text-center h-full py-6">
          <div className="mb-4">
            <div className={`p-2 ${type === "now" ? "bg-green-100" : "bg-gray-100"} rounded-full inline-block`}>
              {getLectureIcon(title.toLowerCase())}
            </div>
          </div>
          {type === "now" && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                NOW
              </span>
            </div>
          )}
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          {lecture.time && type === "now" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-md font-medium bg-green-100 text-green-800">
              {lecture.time}
            </span>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Live Lectures</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Block
            </label>
            <div className="relative">
              <button
                onClick={() => setIsBlocksOpen(!isBlocksOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">
                  {selectedDepartment
                    ? departments[selectedDepartment]?.name
                    : "Select Department"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${isBlocksOpen ? "transform rotate-180" : ""}`}
                />
              </button>

              {isBlocksOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {Object.entries(departments).map(([key, { name }]) => (
                    <button
                      key={key}
                      onClick={() => handleDepartmentChange(key)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${selectedDepartment === key ? "bg-gray-100 font-medium" : ""
                        }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Select Class</option>
              {selectedDepartment && departments[selectedDepartment]?.classes.map(
                (className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Go Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => selectedClass && getLecture(selectedClass)}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={loading || !selectedClass}
          >
            {loading ? "Loading..." : "GO"}
          </button>
        </div>

        {/* College Closed UI */}
        {isCollegeClosed && (
          <div className="mb-8 flex justify-center">
            <CollegeClosedComponent />
          </div>
        )}

        {/* Regular lectures UI - only show if college is not closed */}
        {!isCollegeClosed && data.length > 0 && (
          <>
            {/* Live Lectures Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Live lectures</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.slice(0, 1).map((lecture) => {
                  const isSpecial = isSpecialLecture(lecture);
                  return isSpecial
                    ? renderSpecialLecture(lecture, "now")
                    : renderRegularLecture(lecture, "now");
                })}
              </div>
            </div>

            {/* Next Lectures Section */}
            { data.length>1 &&(
              <div>
  
                <h2 className="text-xl font-semibold mb-4">Next lectures</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  { data.slice(1).map((lecture) => {
                    const isSpecial = isSpecialLecture(lecture);
                    return isSpecial
                      ? renderSpecialLecture(lecture, "next")
                      : renderRegularLecture(lecture, "next");
                  })}
                </div>
              </div>

            )}
          </>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg font-medium text-gray-500">Loading lectures...</div>
          </div>
        )}

        {!loading && selectedClass && data.length === 0 && !isCollegeClosed && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg font-medium text-gray-500">No lectures found. Please select different criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLectures;