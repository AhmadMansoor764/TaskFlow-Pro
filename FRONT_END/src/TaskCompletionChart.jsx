import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TaskCompletionChart = ({ completedTasks, pendingTasks, failedTasks }) => {
  const data = [
    {
      name: "Completed",
      value: completedTasks,
      color: "#22C55E",
    },
    {
      name: "Pending",
      value: pendingTasks,
      color: "#FACC15",
    },
    {
      name: "Failed",
      value: failedTasks,
      color: "#EF4444",
    },
  ];

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  // keep all items for legend
  const legendData = data;

  // only graph items with value > 0
  const chartData = data.filter((item) => item.value > 0);

  const singleTaskType = chartData.length === 1;

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (singleTaskType) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">
      {/* heading */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Task Completion Overview
        </h2>
        <p className="text-gray-500 mt-1">Visual breakdown of your tasks</p>
      </div>

      {/* chart */}
      <div className="relative w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={singleTaskType ? 0 : 3}
              stroke={singleTaskType ? "none" : "white"}
              strokeWidth={singleTaskType ? 0 : 3}
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-5xl font-bold text-gray-900">{totalTasks}</h1>
          <p className="text-gray-500 text-lg mt-1">Total Tasks</p>

          {singleTaskType && (
            <p className="text-lg font-bold mt-2 text-green-600">100%</p>
          )}
        </div>
      </div>

      {/* legend */}
      <div className="space-y-4 mt-4">
        {legendData.map((item, index) => {
          const percentage =
            totalTasks === 0 ? 0 : ((item.value / totalTasks) * 100).toFixed(1);

          return (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>

                <span className="text-gray-700 font-medium">
                  {item.name} ({item.value})
                </span>
              </div>

              <span className="font-semibold" style={{ color: item.color }}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCompletionChart;
