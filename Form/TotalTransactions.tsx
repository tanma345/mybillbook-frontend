import React, { useState } from "react";

const TotalTransactions = ({
  totalParties,
  totalToCollect,
  totalToPay,
  onFilterChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleClick = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex justify-between items-center gap-4 mt-4">
      <div
        className={`w-[30%] p-4 rounded-lg text-center font-semibold border cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md 
          ${selectedFilter === "all" ? "bg-blue-200 border-blue-400 text-blue-900 ring ring-blue-300" : "bg-blue-100 border-blue-300 text-blue-800"}`}
        onClick={() => handleClick("all")}
      >
        <h3>All Parties</h3>
        <h2>{totalParties}</h2>
      </div>

      <div
        className={`w-[30%] p-4 rounded-lg text-center font-semibold border cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md 
          ${selectedFilter === "toCollect" ? "bg-green-200 border-green-400 text-green-900 ring ring-green-300" : "bg-green-100 border-green-300 text-green-800"}`}
        onClick={() => handleClick("toCollect")}
      >
        <h3>To Collect</h3>
        <h2>{totalToCollect}</h2>
      </div>

      <div
        className={`w-[30%] p-4 rounded-lg text-center font-semibold border cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md 
          ${selectedFilter === "toPay" ? "bg-red-200 border-red-400 text-red-900 ring ring-red-300" : "bg-red-100 border-red-300 text-red-800"}`}
        onClick={() => handleClick("toPay")}
      >
        <h3>To Pay</h3>
        <h2>{totalToPay}</h2>
      </div>
    </div>
  );
};

export default TotalTransactions;