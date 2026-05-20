import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiNotepadLight } from "react-icons/pi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaRegCircleXmark } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import Footer from "./Footer";
import { CiSaveDown2 } from "react-icons/ci";
import TaskCompletionChart from "./TaskCompletionChart";
import { CiSaveUp2 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [showAchievement, setShowAchievement] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard-data`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        console.log("dashboard response:", data);
        console.log("response ok:", res.ok);

        if (!res.ok) {
          navigate("/login");
          return;
        }

        console.log("Dashboard Data:", data);

        setInfo(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        navigate("/login");
      }
    };

    fetchDashboardData();
  }, []);

  console.log("this is the info", info);

  // here is the loading spinner that i added because of the suggestion :
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] max-h-screen overflow-y-scroll">
      {/* Top section to show the header (name) and (dashboard) */}
      <div className="m-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[#6f7074] font-stretch-expanded ">
            Welcome, {info.user?.name || "Unknown"} 👋
          </p>
        </div>

        {showButtons && (
          <div className="absolute top-16 right-4 bg-white shadow-xl rounded-2xl border border-gray-200 p-3 flex flex-col gap-3 w-56 z-40 animate-dropdown">
            <button
              onClick={() => {
                setShowAchievement(true);
                setShowButtons(false);
              }}
              className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition"
            >
              🏆 <span className="font-semibold">Achievements</span>
            </button>

            <button
              onClick={() => {
                setShowLevels(true);
                setShowButtons(false);
              }}
              className="bg-blue-600 text-white rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-blue-700 transition"
            >
              🚀 View Levels
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button
            className=" lg:hidden"
            onClick={() => setShowButtons(!showButtons)}
          >
            <BsThreeDotsVertical size={22} />
          </button>
          <button
            onClick={() => setShowAchievement(true)}
            className="hidden bg-white border border-gray-200 shadow-md rounded-xl px-5 py-3 lg:flex items-center gap-2 hover:shadow-lg transition "
          >
            🏆 <span className="font-semibold">Achievements</span>
          </button>
          <button
            onClick={() => setShowLevels(true)}
            className="hidden bg-blue-500 border border-gray-200 shadow-md rounded-xl px-5 py-3 lg:flex items-center gap-2 hover:shadow-lg transition"
          >
            View Achievement Levels
          </button>
        </div>

        {showAchievement && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative transform animate-modalPop">
              <button
                onClick={() => setShowAchievement(false)}
                className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-black transition"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🏆 Achievements
              </h2>

              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-xl flex justify-between">
                  <span className="font-medium">Badge</span>
                  <span className="font-bold text-yellow-600">
                    {info.user?.badge || "No Badge"}
                  </span>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl flex justify-between">
                  <span className="font-medium">Task Streak</span>
                  <span className="font-bold text-orange-600">
                    🔥 {info.user?.streak || 0}
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-blue-700 font-medium">
                    {info.user?.achievement || "Start completing tasks 🚀"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*the second model to show all the info about the acheivments  */}
        {showLevels && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-modalPop">
              <button
                onClick={() => setShowLevels(false)}
                className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-black transition"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🚀 Achievement Levels
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-lg">🥉 Bronze</h3>
                  <p className="text-gray-600">Complete 3 tasks in a row</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-lg">🥈 Silver</h3>
                  <p className="text-gray-600">Complete 7 tasks in a row</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-lg">🥇 Gold</h3>
                  <p className="text-gray-600">Complete 15 tasks in a row</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-lg">💎 Diamond</h3>
                  <p className="text-gray-600">Complete 30 tasks in a row</p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-lg">👑 Master</h3>
                  <p className="text-gray-600">Complete 50 tasks in a row</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards section to show the short summery of the tasks and the plans */}
      <div className="grid grid-cols-2 mt-10 mx-4 md:grid-cols-3">
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className=" bg-[#DBEAFE] rounded-md w-10 h-10 flex justify-center items-center">
            <PiNotepadLight size={30} className="text-blue-800 font-bold" />
          </div>
          <h1 className="text-3xl text-blue-800 font-bold">
            {info.tasksSummary?.totalTasks || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Total Tasks</p>
          <p className="text-[#6f7074]">All Tasks Created</p>
        </div>
        {/*2nd card */}
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className="rounded-md h-10 w-10 flex justify-center items-center bg-[#D1FAE5]">
            <IoIosCheckmarkCircle
              size={30}
              className="font-bold text-[#22C55E]"
            />
          </div>
          <h1 className="text-3xl text-[#22C55E] font-bold">
            {info.tasksSummary?.completedTasks || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Completed Tasks</p>
          <p className="text-[#6f7074]">This is Amazing 🎉</p>
        </div>
        {/*3rd card */}
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className=" bg-[#FEF3C7] rounded-md w-10 h-10 flex justify-center items-center">
            <AiOutlineClockCircle
              size={30}
              className="text-[#F59E0B] font-bold"
            />
          </div>
          <h1 className="text-3xl text-[#F59E0B] font-bold">
            {info.tasksSummary?.pendingTasks || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Pending Tasks</p>
          <p className="text-[#6f7074]">Keep Going!</p>
        </div>
        {/*4th card */}
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className=" bg-[#FEE2E2] rounded-md w-10 h-10 flex justify-center items-center">
            <FaRegCircleXmark size={30} className="text-[#EF4444] font-bold" />
          </div>
          <h1 className="text-3xl text-[#EF4444] font-bold">
            {info.tasksSummary?.failedTasks || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Failed Tasks</p>
          <p className="text-[#6f7074]">Don't Give Up!</p>
        </div>
        {/*5th card */}
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className=" bg-[#EDE9FE] rounded-md w-10 h-10 flex justify-center items-center">
            <CiCalendar size={30} className="text-[#885CF6] font-bold" />
          </div>
          <h1 className="text-3xl text-[#885CF6] font-bold">
            {info.plansSummary?.activePlans || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Active Plans</p>
          <p className="text-[#6f7074]">Plans in Prigress</p>
        </div>
        {/*6th card */}
        <div className="bg-white border-2 border-[#E5E7EB] py-4 px-4 flex flex-col gap-2 rounded-md">
          {/* icon */}
          <div className=" bg-[#D1FAE5] rounded-md w-10 h-10 flex justify-center items-center">
            <IoIosCheckmarkCircle
              size={30}
              className="text-[#22C55E] font-bold"
            />
          </div>
          <h1 className="text-3xl text-[#22C55E] font-bold">
            {info.plansSummary?.completedPlans || 0}
          </h1>
          <p className="font-semibold text-[1.2rem]">Completed Plans</p>
          <p className="text-[#6f7074]">Amazing Job Done 🎉</p>
        </div>
      </div>

      {/*Circular Graph and plans linear graph */}
      <div className="flex flex-col gap-4 mt-8 mx-4 lg:flex-row">
        {/*tasks circular graph */}

        <div className="mx-auto flex-1 w-full">
          <TaskCompletionChart
            completedTasks={info.tasksSummary?.completedTasks || 0}
            pendingTasks={info.tasksSummary?.pendingTasks || 0}
            failedTasks={info.tasksSummary?.failedTasks || 0}
          />
        </div>

        {/*plans linear graph section */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Active plans progress
            </h2>
            <p className="text-gray-500 mt-1">
              Tasks progress of your active plans
            </p>
          </div>
          {info.topPlans && info.topPlans.length > 0 ? (
            info.topPlans.map((plan) => {
              const percentage = Math.floor((plan.progress * 100) / 30);

              return (
                <div
                  key={plan._id}
                  className="bg-[#f0f1f3] p-2 px-4 rounded-md flex flex-col mt-4 border-2 border-[#E5E7EB]"
                >
                  <div className="flex justify-between w-full">
                    <p className="text-[1.1rem] font-semibold">{plan.title}</p>

                    <p className="text-blue-600 font-medium">{percentage}%</p>
                  </div>

                  <p className="text-[#6f7074] mb-2">
                    Started on {new Date(plan.startDate).toLocaleDateString()}
                  </p>

                  <div className="h-1.5 w-full bg-gray-400 rounded-md">
                    <div
                      className="h-1.5 bg-blue-600 rounded-md"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-5xl mb-3">📅</div>

              <h3 className="text-xl font-semibold text-gray-700">
                No Active Plans
              </h3>

              <p className="text-gray-500 mt-2">
                Start a 30 days challenge to track your progress 🚀
              </p>

              <button
                onClick={() => navigate("/plans")}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                Create Plan
              </button>
            </div>
          )}
        </div>
        {/*end of linear graph */}
      </div>
      {/*graph section end ☝*/}
      {/*end of dashboard */}
      <Footer />
    </div>
  );
};

export default Dashboard;
