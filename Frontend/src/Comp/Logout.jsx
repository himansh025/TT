import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { logout } from "../store/authSlice.js";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });

    toast.success("Logout Successfully", { toastId: "logout-toast" }); // Unique toastId prevents duplicates

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
