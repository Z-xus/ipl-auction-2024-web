// import React from "react";

const ConditionsBoard = ({ message, title, onCancel, onConfirm }) => (
  <>
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25rem] bg-sky-900 p-8 shadow-md z-50 rounded-lg">
      <div className="flex flex-col items-stretch">
        <h1 className="text-white text-4xl font-bold my-3 text-center">{title}</h1>
        {/* Mapping over the message array to render each line as a separate paragraph */}
        {message.map((line, index) => (
          <p key={index} className="text-white text-2xl text-center">{line}</p>
        ))}
        <div className="flex items-center justify-around mt-5">
          <button onClick={onCancel} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </>
);

export default ConditionsBoard;

