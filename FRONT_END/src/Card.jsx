import React, { useEffect, useState } from "react";

const Card = ({
  status,
  title,
  deadline,
  createdAt,
  task,
  handleEdit,
  deleteTask,
  markAsDone,
  MarkAsFailed,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-us", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const calculateTimeLeft = () => {
    const difference = new Date(deadline) - new Date();

    if (status === "completed") {
      return "Completed";
    }

    if (difference <= 0) {
      return "Failed";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // if the time or deadline is reached to zero then the status of the task should change to the Failed!
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);

      if (newTime === "Failed" && status === "pending") {
        MarkAsFailed(task._id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, status]);

  const showConditionaly = () => {
    if (status === "completed") {
      return (
        <div className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-md font-semibold">
          Completed
        </div>
      );
    } else if (status === "failed") {
      return (
        <div className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-md font-semibold">
          Failed
        </div>
      );
    } else {
      return (
        <p className="text-sm text-gray-700">
          Remaining Time: <br />
          <span
            className={timeLeft === "Failed" ? "text-red-600" : "text-black"}
          >
            {timeLeft}
          </span>
        </p>
      );
    }
  };

  return (
    <div className="rounded-md bg-gray-300 shadow-md mb-5">
      <div className="border-l-6 border-blue-400 p-2 mx-2">
        <div className="flex justify-between py-1 items-start ">
          <h2 className="max-w-50">{title}</h2>

          {
            // showing the status of the task
            showConditionaly()
          }
        </div>
        <div className="border-t-2 border-gray-400 py-1">
          <p>
            {" "}
            <span className="text-gray-700">Created</span> :{" "}
            {formatDate(createdAt)}
          </p>
          <p>
            <span className="text-gray-700">Deadline</span> :{" "}
            {formatDate(deadline)}
          </p>
        </div>
      </div>

      <div className="flex gap-3 px-2 py-1 border-t-2 border-gray-400 justify-end">
        {status === "pending" && (
          <>
            <button
              onClick={() => handleEdit(task)}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md"
            >
              Edit
            </button>

            <button
              onClick={() => markAsDone(task._id)}
              className="bg-green-600 text-white px-3 py-1 rounded-md"
            >
              Done
            </button>
          </>
        )}

        <button
          onClick={() => deleteTask(task._id)}
          className="bg-red-600 text-white px-3 py-1 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
