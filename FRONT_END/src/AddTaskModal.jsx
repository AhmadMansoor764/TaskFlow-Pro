import React, { useState, useEffect } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import imageBg from "./assets/fourth.jpg";

const AddTaskModal = ({ showModal, setShowModal, editingTask, fetchTasks }) => {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState("Category");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDate(new Date(editingTask.deadline).toISOString().slice(0, 16));
      setSelected(editingTask.category);
    } else {
      setTitle("");
      setDate("");
      setSelected("Category");
    }
  }, [editingTask, showModal]);

  if (!showModal) return null;

  const minDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart("2", "0");
    const day = String(now.getDate()).padStart("2", "0");
    const hours = String(now.getHours()).padStart("2", "0");
    const minutes = String(now.getMinutes()).padStart("2", "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getTaskInfo = async (e) => {
    e.preventDefault();

    const data = {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      deadline: date,
      category: selected,
      status: "Pending",
    };

    const selectedData = new Date(date);
    const now = new Date();

    if (!title || !date || selected === "Category") {
      setError("Please fill all the blanks");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (selectedData <= now) {
      setError("Please choose a future time!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const url = editingTask
        ? `http://localhost:3000/tasks/${editingTask._id}`
        : "http://localhost:3000/tasks";

      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }

      alert(result.message);

      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 h-full w-full p-4 flex items-center md:flex lg:justify-center"
      style={{ backgroundImage: `url(${imageBg})`, backgroundSize: "cover" }}
    >
      <form
        className="flex flex-col gap-10 h-[75%] w-full mx-auto bg-gray-300 p-4 rounded-md py-8 md:w-[50%] md:self-center md:ml-70 lg:w-[60%] xl:h-[85%]"
        onSubmit={getTaskInfo}
      >
        <h1 className="text-3xl font-medium text-gray-800 text-center">
          {editingTask ? "Edit Task" : "Task's Details"}
        </h1>
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-gray-800 font-semibold ">
            Task Title
          </label>

          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="py-1.5 px-2 text-[1.2rem] text-white/90 rounded-md outline-none border-2 border-gray-950 bg-gray-600"
            type="text"
            placeholder="Please write the title here"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-800  text-2xl font-semibold">
            Due Date
          </label>

          <input
            required
            min={minDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-1.5 px-2 text-[1.2rem] text-white/90 rounded-md outline-none border-2 border-gray-950 bg-gray-600"
            type="datetime-local"
          />
        </div>

        <div className="relative">
          <label className="text-gray-800 text-2xl font-semibold ">
            Category
          </label>

          <div
            className="h-10 w-full rounded-md bg-gray-600 flex items-center justify-between px-2 text-[1.2rem] font-semibold cursor-pointer mt-2 "
            onClick={() => setOpen(!open)}
          >
            {selected}
            {open ? (
              <IoIosArrowDropup size={24} />
            ) : (
              <IoIosArrowDropdown size={24} />
            )}
          </div>

          <div
            className={`
              absolute top-12 left-0 w-full bg-white rounded-md flex flex-col gap-2 px-2 z-50
              transition-all duration-300 ease-in-out
              ${
                open
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            {["A", "B", "C"].map((item) => (
              <p
                key={item}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                }}
                className="text-[1.2rem] p-2 cursor-pointer hover:bg-gray-200"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-amber-600 py-2 px-4 text-2xl text-white/90 rounded-md mt-6 hover:bg-amber-700 transition-colors duration-300"
        >
          {editingTask ? "Update Task" : "Save"}
        </button>

        <p className="text-center text-red-400 font-semibold text-2xl">
          {error}
        </p>
      </form>
    </div>
  );
};

export default AddTaskModal;
