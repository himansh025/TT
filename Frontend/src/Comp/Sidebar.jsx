import { useState } from "react";
import {
  FaUser,
  FaBars,
  FaMapMarkerAlt,
  // FaCalculator,
  FaSearch,
  FaCalendarDay,
  FaPersonBooth,
  FaSchool,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { IoIosRadio } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // fixed import

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClasses = (path) =>
    `flex items-center gap-3 p-2 rounded ${
      currentPath === path ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
    }`;

  const getMobileLinkClasses = (path) =>
    `flex items-center gap-3 p-3 ${
      currentPath === path ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen  p-5 border-r-5 border-r-gray-600 text-white fixed top-0 left-0">
        {/* College Logo and Name Section */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex flex-col items-center">
            <img
              src={logo}
              alt="PCTE Logo"
              className="h-20 w-20 bg-white rounded-lg mb-3 p-2"
            />
            <h1 className="text-xl font-bold text-center">
              Punjab College of Technical Education
            </h1>
          </Link>
        </div>

        <div className="border-t border-gray-700 my-4"></div>

        <nav className="space-y-4">
          {/* Non-Logged-In Users */}
          {!user && (
            <>
            {/* <Link to="home" className={getLinkClasses("/home")}>
                <IoIosRadio />
                <span>Home</span>
              </Link> */}
              <Link to="/" className={getLinkClasses("/")}>
                <IoIosRadio />
                <span>Live Lecture</span>
              </Link>
              <Link to="/weekly" className={getLinkClasses("/weekly")}>
                <FaCalendarDay />
                <span>Weekly Lecture</span>
              </Link>
              <Link to="/venue" className={getLinkClasses("/venue")}>
                <FaMapMarkerAlt />
                <span>Vacant Venue</span>
              </Link>
              <Link to="/locate-teacher" className={getLinkClasses("/locate-teacher")}>
                <FaSearch />
                <span>Locate Teacher</span>
              </Link>
      
            </>
          )}

          {/* Admin Only */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin/add-class" className={getLinkClasses("/admin/add-class")}>
                <FaSchool />
                <span>Add Classes</span>
              </Link>
              <Link to="/admin/add-teacher" className={getLinkClasses("/admin/add-teacher")}>
                <FaPersonBooth />
                <span>Add Teacher</span>
              </Link>
              <Link to="/admin/upload" className={getLinkClasses("/admin/upload")}>
                <FaCalendarDay />
                <span>Upload TT</span>
              </Link>
            </>
          )}

          {user && (
            <Link to="/logout" className={getLinkClasses("/logout")}>
              <FaUser />
              <span>Logout</span>
            </Link>
          )}

          {!user && (
            <>
              <Link to="/admin/login" className={getLinkClasses("/admin/login")}>
                <FaUser />
                <span>Admin</span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Mobile */}
      <div className="md:hidden w-full bg-gray-900 mb-10 text-white fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center z-50 p-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="College Logo"
              className="h-10 w-10 bg-white rounded-md"
            />
            <span className="font-bold text-lg">PCTE</span>
          </Link>

          <button
            className="text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>

          <div
            className={`fixed top-0  left-0 w-full bg-gray-800 transition-transform duration-100 ease-in-out ${
              isOpen ? "translate-y-18" : "-translate-y-full"
            } shadow-lg`}
          >
            <nav className="flex flex-col">
              {!user && (
                <>
                  <Link
                    to="/"
                    className={getMobileLinkClasses("/")}
                    onClick={() => setIsOpen(false)}
                  >
                    <IoIosRadio />
                    <span>Live Lecture</span>
                  </Link>
                  <Link
                    to="/weekly"
                    className={getMobileLinkClasses("/weekly")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaCalendarDay />
                    <span>Weekly Lecture</span>
                  </Link>
                  <Link
                    to="/venue"
                    className={getMobileLinkClasses("/venue")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaMapMarkerAlt />
                    <span>Vacant Venue</span>
                  </Link>
                  <Link
                    to="/locate-teacher"
                    className={getMobileLinkClasses("/locate-teacher")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSearch />
                    <span>Locate Teacher</span>
                  </Link>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin/add-teacher"
                    className={getMobileLinkClasses("/admin/add-teacher")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaPersonBooth />
                    <span>Add Teacher</span>
                  </Link>
                  <Link
                    to="/admin/add-class"
                    className={getMobileLinkClasses("/admin/add-class")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSchool />
                    <span>Add Classes</span>
                  </Link>
                  <Link
                    to="/admin/upload"
                    className={getMobileLinkClasses("/admin/upload")}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaCalendarDay />
                    <span>Upload TT</span>
                  </Link>
                </>
              )}

              {user ? (
                <Link
                  to="/logout"
                  className={getMobileLinkClasses("/logout")}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Logout</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className={getMobileLinkClasses("/admin/login")}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
