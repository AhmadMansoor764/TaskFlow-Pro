import React from "react";

const categories = ["All", "Pending", "Completed", "Failed"];

const Filter = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex gap-2 mt-5 sm:gap-3 justify-center font-semibold">
      {categories.map((category) => (
        <button
          key={category}
          ss
          onClick={() => setActiveCategory(category)}
          className={`px-3 py-1 rounded-[5px] transition sm:px-5 md:px-6 md:text-lg
            ${
              activeCategory === category
                ? "bg-blue-600 text-white"
                : "bg-[var(--bg-card)] hover:bg-blue-400"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Filter;
