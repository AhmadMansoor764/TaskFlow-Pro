import { useState, useEffect } from "react";
import React from "react";
import AddTaskModal from "./AddTaskModal";
import Card from "./Card";
import Filter from "./Filter";
import Footer from "./Footer";

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filterdTasks = tasks.filter((task) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Pending") return task.status === "pending";
    if (activeCategory === "Completed") return task.status === "completed";
    if (activeCategory === "Failed") return task.status === "failed";
    return true;
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }

      setTasks(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const markAsDone = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}/status`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Mark the button as failed if the time or deadline is reached !

  const MarkAsFailed = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}/fail`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const updatedTask = await res.json();
      console.log(updatedTask);

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const categories = ["A", "B", "C"];

  return (
    <div className="p-4 bg-[#efefef] h-full">
      <div className="flex justify-between items-center border-b-2 border-b-gray-700 pb-3">
        <h1 className="text-3xl font-medium">Tasks</h1>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="text-white bg-blue-600 py-1.5 px-3 rounded-md text-[1.2rem] font-medium"
        >
          + Add Task
        </button>
      </div>

      {showModal && (
        <AddTaskModal
          showModal={showModal}
          setShowModal={setShowModal}
          fetchTasks={fetchTasks}
          editingTask={editingTask}
        />
      )}

      <Filter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-h-[85%] overflow-y-scroll">
        {categories.map((category) => {
          const filteredTasks = filterdTasks.filter(
            (task) => task.category === category,
          );

          if (filteredTasks.length === 0) return null;

          filteredTasks.sort(
            (a, b) => new Date(a.deadline) - new Date(b.deadline),
          );

          return (
            <div key={category}>
              <h2 className="text-2xl font-semibold mt-6 mb-3 ">
                {category} Category
              </h2>

              {filteredTasks.map((task) => (
                <Card
                  MarkAsFailed={MarkAsFailed}
                  markAsDone={markAsDone}
                  key={task._id}
                  task={task}
                  title={task.title}
                  deadline={task.deadline}
                  createdAt={task.createdAt}
                  status={task.status}
                  handleEdit={handleEdit}
                  deleteTask={deleteTask}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
