import React, { useState, useLayoutEffect } from "react";
import {
  IoLocationOutline,
  IoBook,
  IoCalendarOutline,
  IoSchoolOutline,
  IoTimeOutline,
  IoPerson,
} from "react-icons/io5";
import axiosInstance from "../Config/apiconfig.js";
import { useEffect } from "react";

const LocateTeacher = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setselectedDay] = useState("monday");
  const [teachers, setTeachers] = useState([]);
  const [lectures, setLectures] = useState([]);

  const getAllTeachers = async () => {
    const response = await axiosInstance.get(`/api/teachers/getAll`);
    let data = response.data;
    setTeachers(data.result || []);
  };

  let timingArr = [
    "09:00 - 10:00",
    "10:05 - 11:05",
    "11:25 - 12:25",
    "12:30 - 01:30",
    "01:35 - 02:35",
    "02:40 - 03:40",
    "03:40 - 04:40",
  ];

  let dayArr = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const getTeacherTimeTable = async (tcode, sday) => {
    // console.log(tcode,selectedDay);
    const payload = { req_day: sday, teacherCode: tcode };
    const response = await axiosInstance.post(`/teacher_timetable`, payload);
    let data = await response.data;
        console.log(data);

    const arrayValues = Object.values(data);
    setLectures(arrayValues);
  };

  useLayoutEffect(() => {
    getAllTeachers();
  }, []);

  useEffect(() => {
    getTeacherTimeTable(selectedTeacher, selectedDay);
  }, [selectedTeacher, selectedDay]);

  return (
    <div className=" min-h-screen mt-5 md:mt-10 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10 flex items-center justify-center gap-4">
          <IoSchoolOutline className="text-blue-600" />
          Teacher Locator
        </h1>

        {/* Selection Boxes */}
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => {
                // console.log(e.target.value, selectedDay);

                setSelectedTeacher(e.target.value);
                getTeacherTimeTable(e.target.value, selectedDay);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="">Choose a Teacher</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.nameCode}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => {
                console.log(selectedTeacher, e.target.value);

                setselectedDay(e.target.value);
                getTeacherTimeTable(selectedTeacher, e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="">Choose a Day</option>
              {dayArr.map((day, index) => (
                <option key={index} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lecture List */}
        {lectures.length > 0 && selectedTeacher && (
          <section className="w-full">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center flex items-center justify-center gap-3">
              <IoCalendarOutline /> Lecture Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture, index) => {
                return (
                  <LectureCard
                    key={index}
                    lecture={lecture}
                    timeslot={timingArr[index]}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const LectureCard = ({ lecture, timeslot }) => {
  const isFree = lecture[3] === "Free" || lecture[3] === null;

  return (
    <div
      className={`
      transform transition-all duration-300 ease-in-out 
      hover:-translate-y-2 hover:shadow-2xl 
      rounded-xl overflow-hidden 
      ${
        isFree
          ? "bg-green-50 border-l-4 border-green-500"
          : "bg-white border-l-4 border-blue-500 shadow-md"
      }
    `}
    >
      <div className="p-4">
        {isFree ? (
          <div className="text-center text-green-600">
            <h3 className="text-xl font-bold">{timeslot}</h3>
            <IoBook className="mx-auto mb-3 w-12 h-12 text-green-500" />
            <h3 className="text-xl font-bold">Free Lecture</h3>
            <p className="text-green-400">No scheduled lecture</p>
          </div>
        ) : lecture[3]=="Meeting" ?(
          <>
        <div className="text-center ">
            <h3 className="text-xl text-gray-700 font-bold">{timeslot}</h3>
            <IoPerson className="mx-auto mb-3 w-12 h-12 text-greered-500" />
            <h3 className="text-xl text-gray-700 font-bold">Departmental Meeting</h3>
          </div>
          </>
        ): (
          <>
            <div className="flex items-center gap-3 mb-3">
              <IoTimeOutline className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 font-medium text-lg">
                {timeslot}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-700 font-medium text-lg">
                Class : {lecture[0]}
              </span>
              <IoLocationOutline className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 font-medium text-lg">
                Venue: {lecture[3]}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <IoBook className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-800">{lecture[1]}</h3>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="font-semibold text-blue-500">Teacher Code:</span>
              {lecture[2]}
            </div>
          </>
        )
        }
      </div>
    </div>
  );
};

export default LocateTeacher;
