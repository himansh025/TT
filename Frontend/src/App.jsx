import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Comp/Layout";
import AdminRoute from "./Comp/AdminRoute";
import LiveLectures from "./pages/LiveLectures";
import TimeUpload from "./pages/TimeUpload";
import LocateTeacher from "./Comp/LocateTeacher";
// import CalculateAttendence from "./Comp/CalculateAttendence";
// import Login from "./Comp/Login";
// import Otp from "./Comp/Otp";
import ClassListing from "./Comp/ClassListing";
import AddTeacher from "./Comp/AddTeacher";
import Venue from "./pages/Venue";
import Logout from "./Comp/Logout";
import WeeklyLectures from "./pages/WeeklyLectures";
import AdminLogin from "./Comp/AdminLogin";
import Unauthorized from "./pages/Unauthorized";
import TeamShowcase from "./pages/TeamShowcase";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");
console.log("user",user);
console.log("token",token);

    if (user && token) {
      dispatch(login({ user, token }));
    }
  }, [dispatch]);

  return (
    <Router>
      {/* ToastContainer placed here to ensure it's only rendered once */}
      <ToastContainer position="top-right" autoClose={1000} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LiveLectures />} />
          <Route path="/locate-teacher" element={<LocateTeacher />} />
          <Route path="/venue" element={<Venue />} />
          <Route path="/weekly" element={<WeeklyLectures />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/attendance" element={<CalculateAttendence />} /> */}
          {/* <Route path="/verify-otp" element={<Otp />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
        </Route>

        <Route path="/team" element={<TeamShowcase />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/admin/upload" element={<TimeUpload />} />
            <Route path="/admin/add-class" element={<ClassListing />} />
            <Route path="/admin/add-teacher" element={<AddTeacher />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
