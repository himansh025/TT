import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Admin Sidebar */}
      <div className="md:w-64 z-10 fixed h-full">
       <Sidebar/>
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full overflow-auto ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
