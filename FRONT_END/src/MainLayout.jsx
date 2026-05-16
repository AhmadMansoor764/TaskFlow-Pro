import React from "react";
import Sidebar from "./Sidebar"; // ✅ Capital S
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
