import React, { useState, useEffect } from "react";
import { IoHome } from "react-icons/io5";
import { BiTask, BiLogOut } from "react-icons/bi";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { VscLayoutSidebarRightDock } from "react-icons/vsc";
import { CiCircleRemove } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/loginmaterial (3).png";

const Sidebar = () => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      setShowSidebar(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* open button mobile */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden fixed bottom-3 left-3 z-50 bg-[#212d47] text-white p-2 rounded-lg shadow-lg"
        >
          <VscLayoutSidebarRightDock size={32} />
        </button>
      )}

      {/* overlay */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          showSidebar
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-[#212d47] p-4 flex flex-col gap-10 text-white
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-52
        `}
      >
        {/* logo + close */}
        <div className="flex flex-row-reverse justify-center relative">
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden absolute right-0 top-0"
          >
            <CiCircleRemove size={34} />
          </button>

          <img className="w-32 h-32 object-contain" src={logo} alt="logo" />
        </div>

        <Link
          onClick={() => setShowSidebar(false)}
          to="/dashboard"
          className="flex gap-2 items-center text-[1.1rem] font-semibold hover:text-blue-300 transition-colors"
        >
          <IoHome size={28} />
          Dashboard
        </Link>

        <Link
          onClick={() => setShowSidebar(false)}
          to="/tasks"
          className="flex gap-2 items-center text-[1.1rem] font-semibold hover:text-blue-300 transition-colors"
        >
          <BiTask size={28} />
          Tasks
        </Link>

        <Link
          onClick={() => setShowSidebar(false)}
          to="/plans"
          className="flex gap-2 items-center text-[1.1rem] font-semibold hover:text-blue-300 transition-colors"
        >
          <BsCalendar2WeekFill size={21} />
          Plans
        </Link>

        {/* logout button */}
        <button
          onClick={handleLogout}
          className="flex gap-2 items-center text-[1.1rem] font-semibold hover:text-red-300 transition-colors mt-auto"
        >
          <BiLogOut size={25} />
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
