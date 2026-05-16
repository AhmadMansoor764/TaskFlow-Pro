import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // track editing day
  const [editingDay, setEditingDay] = useState(null);

  // fetch single plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/plan/${id}`, {
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok) {
          return alert(result.message);
        }

        setPlan(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // change task input
  const handleTaskChange = (dayNumber, value) => {
    setPlan((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.dayNumber === dayNumber ? { ...day, task: value } : day,
      ),
    }));
  };

  // toggle completed
  const toggleCompleted = (dayNumber) => {
    setPlan((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.dayNumber === dayNumber
          ? { ...day, completed: !day.completed }
          : day,
      ),
    }));
  };

  // save single day
  const saveDay = async (day) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/plan/${id}/day/${day.dayNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            task: day.task,
            completed: day.completed,
          }),
        },
      );

      const updatedPlan = await res.json();

      if (!res.ok) {
        return alert(updatedPlan.message);
      }

      setPlan(updatedPlan);

      // stop editing mode
      setEditingDay(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p className="p-5">Loading...</p>;

  if (!plan) return <p>No plan found</p>;

  const completedDays = plan.days.filter((day) => day.completed).length;

  const progressPercent = Math.floor((completedDays / 30) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/plans")}
          className="border px-4 py-2 rounded-md"
        >
          ← Back
        </button>

        <div className="text-right">
          <h2 className="text-xl font-bold">{completedDays} / 30 Completed</h2>

          <p className="text-gray-500">{progressPercent}% Progress</p>
        </div>
      </div>

      {/* Plan info */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h1 className="text-3xl font-bold">{plan.title}</h1>

        <p className="text-gray-600 mt-2">
          Start Date: {new Date(plan.startDate).toLocaleDateString()}
        </p>

        <p className="mt-2">
          Status:
          <span
            className={`ml-2 font-semibold ${
              plan.status === "completed" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {plan.status}
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-4 rounded-full mt-5">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Days */}
      <div className="grid gap-4 max-h-[55vh] overflow-y-scroll pr-2 lg:grid-cols-2">
        {plan.days.map((day) => (
          <div
            key={day.dayNumber}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition "
          >
            {/* Top Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Day {day.dayNumber}
              </h2>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  day.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {day.completed ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Task Input */}
            <div className="mt-4">
              <input
                type="text"
                value={day.task}
                disabled={editingDay !== day.dayNumber}
                onChange={(e) =>
                  handleTaskChange(day.dayNumber, e.target.value)
                }
                placeholder="Write today's task..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[1rem] outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center mt-5">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={day.completed}
                  onChange={() => toggleCompleted(day.dayNumber)}
                  className="w-4 h-4"
                />
                Mark Complete
              </label>

              {editingDay === day.dayNumber ? (
                <button
                  onClick={() => saveDay(day)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingDay(day.dayNumber)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDetails;
