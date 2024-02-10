// import React from "react";

const Popup = ({ message, onCancel, onConfirm, isOK }) => (
  <>
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-900 p-8 shadow-md z-50 rounded-lg">
      <div className="flex flex-col items-stretch">
        <p className="text-white text-2xl">{message}</p>
        <div className="flex items-center justify-around">
          {!isOK && <button onClick={onCancel} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
            Cancel
          </button>}
          <button onClick={onConfirm} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
            { !isOK ? "Confirm" : "OK"}
          </button>
        </div>
      </div>
    </div>
  </>
);

export default Popup;
