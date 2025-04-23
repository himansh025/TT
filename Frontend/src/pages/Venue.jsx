import { MdComputer } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { BsBuilding } from "react-icons/bs";
import axiosInstance from "../Config/apiconfig.js";
function Venue() {
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState("0");
  const [Loader, setLoader] = useState(false);
  const [lecture, setLecture] = useState([]);
  const [lab, setLab] = useState([]);

  const daysArr = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const timeSlots = [
    "09:00 - 10:00",
    "10:05 - 11:05",
    "11:25 - 12:25",
    "12:30 - 1:30",
    "1:30 - 02:30",
    "02:35 - 03:35",
    "03:40 - 04:40",
  ];

  useEffect(() => {
    const dobj = new Date();
    const currentDay = daysArr[dobj.getDay() - 1]; 
  
    if (currentDay) {
      setSelectedDay(currentDay);
      setSelectedTime("0"); // default time index
      fetchVacantClasses(currentDay, "0"); 
    }
  }, []);
  
  const fetchVacantClasses = async (sday, sindex) => {
    setLoader(true);
    try {
      const payload = {
        reqday: sday,
        lectureindex: sindex,
      };
      const response = await axiosInstance.post(`/vacant_venue`, payload);
      // console.log("response", response);
      setLecture(response.data[0] || []);
      setLab(response.data[1] || []);
    } catch (error) {
      console.error("Failed to fetch vacant venues:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="  p-6 w-full mx-auto  shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center"> Vacant Venues</h1>

      <div className=" flex justify-evenly flex-wrap">
        {/* Day Selection */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Select Day:</label>
          <select
            className="p-2 bg-gray-800 text-white rounded-lg"
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              fetchVacantClasses(e.target.value, selectedTime);
            }}
          >
            {daysArr.map((day, indx) => (
              <option key={indx} value={day}>
                {day.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Select Time Slot:</label>
          <select
            className="p-2 bg-gray-800 text-white rounded-lg"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              fetchVacantClasses(selectedDay, e.target.value);
            }}
          >
            {timeSlots.map((time, indx) => (
              <option key={indx} value={indx}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Venue Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Lecture Venues */}
  <div className="p-6 rounded-2xl bg-white shadow-lg transition-transform hover:scale-[1.01] min-h-[200px]">
    <div className="flex items-center gap-3 mb-4">
      <BsBuilding className="text-4xl text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-800">
        Theory Vacant Venues
      </h2>
    </div>
    <div className="space-y-3">
      {Loader ? (
        <p className="text-gray-500 animate-pulse">Loading venues...</p>
      ) : lecture && lecture.length > 0 ? (
        lecture.map((venue, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Time:</strong>{" "}
              {timeSlots[selectedTime]}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Room:</strong> {venue}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No vacant venues available</p>
      )}
    </div>
  </div>

  {/* Lab Venues */}
  <div className="p-6 rounded-2xl bg-white shadow-lg transition-transform hover:scale-[1.01] min-h-[200px]">
    <div className="flex items-center gap-3 mb-4">
      <MdComputer className="text-4xl text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-800">
        Lab Vacant Venues
      </h2>
    </div>
    <div className="space-y-3">
      {Loader ? (
        <p className="text-gray-500 animate-pulse">Loading venues...</p>
      ) : lab && lab.length > 0 ? (
        lab.map((venue, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Time:</strong>{" "}
              {timeSlots[selectedTime]}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Room:</strong> {venue}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No vacant venues available</p>
      )}
    </div>
  </div>
</div>

    </div>
  );
}

export default Venue;
