// import React from "react";

const ConditionsBoard = ({ message, onCancel, onConfirm }) => (
  <>
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25rem] bg-sky-900 p-8 shadow-md z-50 rounded-lg">
      <div className="flex flex-col items-stretch">
        <h1 className="text-white text-4xl font-bold mb-2 text-center">Player Conditions</h1>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-white p-3">Type</th>
              <th className="text-white p-3">Min</th>
              <th className="text-white p-3">Max</th>
              <th className="text-white p-3">Current</th>
              <th className="text-white p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {message.map((line, index) => {
              const [type, min, max, current, status] = line.split(',');
              return (
                <tr key={index}>
                  <td className="p-3">{type}</td>
                  <td className="p-3">{min}</td>
                  <td className="p-3">{max}</td>
                  <td className="p-3">{current}</td>
                  <td className={`p-3 ${status === '✅' ? 'text-green-500' : 'text-red-500'}`}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-around mt-1">
          <button onClick={onCancel} className=" text-xl mt-4 px-3 py-1 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer"> Back </button>
          <button onClick={onConfirm} className="text-xl mt-4 px-3 py-1 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer"> Confirm </button>
        </div>
      </div>
    </div>
  </>
);

export default ConditionsBoard;

