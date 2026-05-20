import React from "react";
import { BsFillWalletFill } from "react-icons/bs";
import { IoPlayOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCircleXmark } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { useState } from "react";
import { useEffect } from "react";
import PlanModal from "./PlanModal";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Plan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalPlans = plans.length;
  const activePlans = plans.filter((plan) => plan.status === "active").length;
  const completedPlans = plans.filter(
    (plan) => plan.status === "completed",
  ).length;
  const expiredPlans = plans.filter((plan) => plan.status === "expired").length;

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const fetchPlans = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/plan`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }

      setPlans(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const deletePlan = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plan?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/plan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }

      setPlans((prev) => prev.filter((plan) => plan._id !== id));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin text-blue-600"></div>
      </div>
    );
  }

  return showModal ? (
    <PlanModal setShowModal={setShowModal} fetchPlans={fetchPlans} />
  ) : (
    <div className="bg-[#F8FAFC] h-full">
      {/* Header */}
      <div className="flex justify-between p-2">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">Plans</h1>
          <p>Create and Track your 30 days plan</p>
        </div>

        <button
          className="bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md px-1 text-white py-2"
          onClick={() => toggleModal()}
        >
          + Add Plan
        </button>
      </div>
      {/*Top box to show the number of plans / completed / expired ...*/}
      <div className="grid grid-cols-2 gap-2 p-2 bg-[#EDE9FE] mt-6 lg:grid-cols-4">
        <div className="flex justify-start bg-white px-3 py-3 rounded-md gap-2">
          <div className="p-3 rounded-full bg-[#EFF6FF]">
            <CiCalendar className="text-[#2563EB]" size={30} />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-700">Total Plans</p>
            <p className="font-bold text-[1.2rem]">{totalPlans}</p>
          </div>
        </div>

        <div className="flex justify-start bg-white px-3 py-3 gap-2 rounded-md">
          <div className="p-3 rounded-full bg-[#EFF6FF]">
            <IoPlayOutline className="text-[#16A34A]" size={30} />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-700">Active</p>
            <p className="font-bold text-[1.2rem] text-[#16A34A]">
              {activePlans}
            </p>
          </div>
        </div>

        <div className="flex justify-start bg-white px-3 py-3 gap-2 rounded-md">
          <div className="p-3 rounded-full bg-[#EFF6FF]">
            <IoIosCheckmarkCircleOutline className="text-[#F59E0B]" size={30} />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-700">Completed</p>
            <p className="font-bold text-[1.2rem] text-[#F59E0B]">
              {completedPlans}
            </p>
          </div>
        </div>

        <div className="flex justify-start bg-white px-3 py-3 gap-2 rounded-md">
          <div className="p-3 rounded-full bg-[#EFF6FF]">
            <FaCircleXmark className="text-[#EF4444]" size={30} />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-700">Expired</p>
            <p className="font-bold text-[1.2rem] text-[#EF4444]">
              {expiredPlans}
            </p>
          </div>
        </div>
      </div>
      {/*Plans section*/}
      <div className="p-2 mt-2">
        <h1 className="text-2xl font-medium text-center">My Plans</h1>

        {/*Plans*/}
        <div className="grid grid-cols-1 mt-2 gap-3 overflow-y-scroll max-h-120">
          {plans.length === 0 && (
            <div className="bg-white p-6 rounded-xl text-center mt-5 border">
              <h2 className="text-xl font-semibold">No Plans Yet</h2>

              <p className="text-gray-500 mt-2">
                Start your first 30 days challenge 🚀
              </p>

              <button
                onClick={toggleModal}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Plan
              </button>
            </div>
          )}

          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white border-2 border-[#E5E7EB] rounded-xl p-4 shadow-sm "
            >
              {/* Top Section */}
              <div className="flex justify-between items-start">
                {/* Left */}
                <div>
                  <h1 className="text-[1.1rem] font-semibold">{plan.title}</h1>

                  <p className="text-[#6f7074] text-sm mt-1">
                    {new Date(plan.startDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      plan.status === "active"
                        ? "bg-green-100 text-green-700"
                        : plan.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plan.status}
                  </span>

                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Progress Info */}
              <div className="mt-5 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{plan.progress}</span> / 30
                  Days completed
                </p>

                <p className="text-sm font-semibold text-blue-600">
                  {Math.floor((plan.progress * 100) / 30)}%
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.floor((plan.progress * 100) / 30)}%`,
                  }}
                ></div>
              </div>

              {/* Bottom Arrow */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/plans/${plan._id}`)}
                  className="text-gray-500 hover:text-black transition"
                >
                  <MdKeyboardArrowRight size={30} />
                </button>
              </div>
            </div>
          ))}
          {/*end of each plan*/}
        </div>
      </div>
      <div className="h-12"></div>
      {/*Footer section is here below */}
      <div className="bg-gray-700 h-10 px-4 flex justify-center items-center fixed bottom-0 w-full">
        <p className="text-gray-200 font-medium">
          {" "}
          &copy; 2026 <span className="font-bold text-blue-700">AMO</span> Task
          Manager
        </p>
        {/* <p className="text-gray-200 font-medium">Ahmad Mansoor Omarzai</p> */}
      </div>
    </div>
  );
};

export default Plan;
