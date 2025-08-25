import React, { useState, useEffect } from "react";
import { Coffee, Users, UtensilsCrossed, Users2, BookCopy } from "lucide-react";
import { MdFastfood, MdPerson3 } from "react-icons/md";
import Button from "../Comp/Button";
import { toast } from "react-toastify";
import axiosInstance from "../Config/apiconfig";
import {IoLocationOutline,IoBook,IoTimeOutline} from "react-icons/io5";
import Loader from "../Comp/Loader";

const sampleBlocks = ["ET Block"];
const sampleClasses = {
  "ET Block": ["BCA 1A", "MCA 3A"],
};
const sampleDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WeeklyLectures = () => {
  const [selectedBlock, setSelectedBlock] = useState("ET Block");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchClassQuery, setSearchClassQuery] = useState("");
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [classes, setClasses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      setClasses(sampleClasses[selectedBlock] || []);
    }
    fetchAllClasses();
  }, [selectedBlock]);

  const fetchAllClasses = async () => {
    try {
      const response = await axiosInstance.get(`/api/classes/getAll`);
      let data = response.data;
      let arr = data.result.map((classObj) => classObj.name);
      setClasses(arr);
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  };

  const transformSchedule = (data) => {
    return data.map((item) => {
      if (item.type === "major_project") return item;
      return {
        ...item,
        title: item.teacher === "Free" ? "Free Lecture" : item.subject,
        type: item.teacher === "Free" ? "FREE" : item.type?.toUpperCase(),
        venue: item.venue !== "Lunch Break" ? item.venue : "",
        instructor: item.teacher !== "Lunch Break" && item.teacher !== "Free" ? item.teacher : "",
      };
    });
  };

  const handleFetch = async () => {
    setShowValidation(true);
    console.log(selectedClass, selectedBlock, selectedDay)
    if (!selectedBlock || !selectedClass || !selectedDay) {
      toast.warning("Please select Block, Class, and Day.");
      return;
    }

    setLoading(true);
    try {
      const payload = { cls: selectedClass, reqday: selectedDay.toLowerCase() };
      const response = await axiosInstance.post(`/weekly`, payload);
      console.log(response.data);
      toast.success("Fetched Weekly Lectures Successfully");
      setSchedule(transformSchedule(response.data));
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  };

 if(loading){
  return(
    <Loader/>
  )}
 
  return (
    <div className="min-h-screen text-gray-800 bg-gray-50 p-6 w-full mx-auto rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Weekly Lectures</h1>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Block */}
        <div>
          <label className="block mb-2 font-semibold">Select Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className={`w-full p-3 rounded-lg bg-white border ${showValidation && !selectedBlock ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
          >
            <option value="">-- Choose Block --</option>
            {sampleBlocks.map((block) => (
              <option key={block} value={block}>
                {block}
              </option>
            ))}
          </select>
          {showValidation && !selectedBlock && (
            <p className="text-sm text-red-500 mt-1">Please select a Block</p>
          )}
        </div>

        {/* Custom Class Combobox */}
        <div className="relative">
          <label className="block mb-2 font-semibold">Select Class</label>
          <input
            type="text"
            value={searchClassQuery}
            onChange={(e) => {
              setSearchClassQuery(e.target.value);
              setShowClassDropdown(true);
            }}
            onFocus={() => setShowClassDropdown(true)}
            onBlur={() => setTimeout(() => setShowClassDropdown(false), 150)}
            placeholder="Type the Class..."
            className={`w-full p-3 rounded-lg bg-white border ${showValidation && !selectedClass ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
          />

          {/* Dropdown Suggestions */}
          {showClassDropdown && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
              {classes
                .filter((cls) =>
                  cls.toLowerCase().includes(searchClassQuery.toLowerCase())
                )
                .map((cls) => (
                  <li
                    key={cls}
                    onMouseDown={() => {
                      setSelectedClass(cls);
                      setSearchClassQuery(cls);
                      setShowClassDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {cls}
                  </li>

                ))}

              {classes.filter((cls) =>
                cls.toLowerCase().includes(searchClassQuery.toLowerCase())
              ).length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No classes found</li>
                )}
            </ul>
          )}

          {/* Validation Message */}
          {showValidation && !selectedClass && (
            <p className="text-sm text-red-500 mt-1">Please select a Class</p>
          )}
        </div>

        {/* Day */}
        <div>
          <label className="block mb-2 font-semibold">Select Day</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={`w-full p-3 rounded-lg bg-white border ${showValidation && !selectedDay ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
          >
            <option value="">-- Choose Day --</option>
            {sampleDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {showValidation && !selectedDay && (
            <p className="text-sm text-red-500 mt-1">Please select a Day</p>
          )}
        </div>
      </div>

      {/* Fetch Button */}
      <div className="text-center">
        <Button
          onClick={handleFetch}
          text={loading&& selectedClass ? "Loading..." : "Get Lectures"}
          className="font-semibold px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
        />
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {schedule.map((item, index) => {
          if (item.type === "major_project") {
            return item.data?.map((domain, idx) => (
              <div
                key={`${index}-${idx}`}
                className={` rounded-xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white border-l-4 border-blue-500 duration-300 w-full max-w-md mx-auto`}
              >
              <h3 className="text-lg font-bold mt-2">Lecture No: {item.id}</h3>

              <div className="flex items-center text-blue-600 font-semibold text-md mb-2">
              <IoTimeOutline className="w-6 h-6 mr-2 text-blue-500" />              {item.time}
            </div>

            <div className=" justify-between text-sm text-gray-700 mb-2">
            <div className="flex ">
            <IoLocationOutline className="w-6 mr-2 h-6 text-blue-500" />
            Venue :
            <span className="font-semibold ml-2">{domain.venue}  </span>
            </div>

            <div className="flex items-center text-lg font-bold  mb-1">
            <IoBook className="w-6 h-6 mr-3 text-yellow-500" />
             Subject : {domain.subject.toUpperCase()}
            </div>
          </div>
            <p className="text-sm text-blue-700 font-semibold">
            Teacher Code: <span className="font-normal">{domain.teacher.toUpperCase()}</span>
           </p>
      
              </div>
            ));
          }

          if (item.type === "LUNCH BREAK" || item.venue === "Break") {
            return (
              <div
                key={item.id}
                className=" bg-green-50 border-l-4 border-green-500 rounded-lg  pb-2 shadow-xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mt-2">Lecture No: {item.id}</h3>
                <div className="p-4 mt-2 bg-amber-100 rounded-full inline-block">
                  <MdFastfood className="h-8  w-8" />
                </div>
                <h3 className="text-md font-bold mt-4">Lunch Break</h3>
                <p className="text-sm bg-blue-900 text-white px-4 py-1 rounded-full mt-2 inline-block">
                  Time: {item.time}
                </p>
              </div>
            );
          }

          if (item.teacher === "Free") {
            return (
              <div
                key={item.id}
                className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="p-3 bg-gray-200 rounded-full inline-block">
                  <MdPerson3 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold mt-2">Lecture is Free</h3>
                <p className="text-sm bg-blue-900 text-white px-4 py-2 rounded-full mt-2 inline-block">
                  Time: {item.time}
                </p>
              </div>
            );
          }

          if (item.subject 
            === "FRIDAY MEETING" || item.subject === "DEPARTMENTAL MEETING" || item.venue==="Meeting") {
            return (
              <div
              key={item.id}
              className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-3 bg-gray-200 rounded-full inline-block">
                <MdPerson3 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mt-2">DEPARTMENTAL Meeting</h3>
              <p className="text-sm bg-blue-900 text-white px-4 py-2 rounded-full mt-2 inline-block">
                Time: {item.time}
              </p>
            </div>
            );
          }

          return (
            <div
              key={item.id}
              className={` rounded-xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white border-l-4 border-blue-500 duration-300 w-full max-w-md mx-auto`}
            >
            <h3 className="text-lg font-bold mt-2">Lecture No: {item.id}</h3>

              {/* Time */}
              <div className="flex items-center text-blue-600 font-semibold text-md mb-2">
                <IoTimeOutline className="w-6 h-6 mr-2 text-blue-500" />              {item.time}
              </div>

              {/* Class and Venue */}
              {item.venue && (
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <div className="flex ">
                    <IoLocationOutline className="w-6 mr-2 h-6 text-blue-500" />
                    Venue :
                    <span className="font-semibold ml-2">{item.venue}  </span>
                  </div>
                </div>
              )}

                       
              <div className="flex items-center text-lg font-bold  mb-1">
              <IoBook className="w-6 h-6 mr-3 text-yellow-500" />
               Subject : {item.subject}
              </div>

              {item.teacher && (
                <p className="text-sm text-blue-700 font-semibold">
                  Teacher Code: <span className="font-normal">{item.teacher}</span>
                </p>
              )}

              {/* Free Lecture Mode */}
              {item.title.toLowerCase().includes("free") && (
                <>
                  <h3 className="text-xl font-bold">Free Lecture</h3>
                  <p className="text-sm text-green-600">No scheduled lecture</p>
                </>
              )}
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default WeeklyLectures;
