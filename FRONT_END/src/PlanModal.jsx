import React from "react";
import image from "./assets/fourth.jpg";

const PlanModal = ({ setShowModal, fetchPlans }) => {
  const takeDate = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get("title");
    const startDate = formData.get("date");

    if (!title || !startDate) return alert("Please fill all the blanks");
    if (!/[a-zA-Z]/.test(title)) return alert("Please enter a valid title");
    if (title.trim().length < 3) return alert("Please enter longer title");

    const days = Array.from({ length: 30 }, (_, index) => ({
      dayNumber: index + 1,
      task: "",
      completed: false,
    }));

    const res = await fetch(`${import.meta.env.VITE_API_URL}/plan`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        startDate,
        days: days,
      }),
    });

    const reslut = await res.json();

    if (!res.ok) return alert(reslut.message);

    console.log(reslut);

    e.target.reset();
    setShowModal(false);
    fetchPlans();
  };

  return (
    <div
      className="fixed inset-0 h-full w-full p-4 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <form
        onSubmit={takeDate}
        className="flex flex-col gap-10 h-[60%] w-full mx-auto bg-gray-300 p-4 rounded-md py-8 sm:w-[80%] md:w-[50%] md:self-center md:ml-70 lg:w-[60%]"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800 ">Create Plan</h1>
        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-semibold " htmlFor="title">
            Plan Title
          </label>
          <input
            className="p-2 rounded-md border-2 border-gray-100  bg-gray-600"
            type="text"
            name="title"
            id="title"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-semibold " htmlFor="date">
            Plan Start Date
          </label>
          <input
            className="p-2 rounded-md border-2 border-gray-100 bg-gray-600"
            type="date"
            name="date"
            id="date"
          />
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded-md mt-6"
          type="submit"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default PlanModal;
