import Card from "./Card";
// import React from "react"; // Don't forget to import React

const CaptaincyPopup = ({ message, onCancel, onConfirm, playerCards }) => {
  // Create a Set to store unique player names
  const uniquePlayers = new Set();

  // Iterate through playerCards to add unique players to the Set
  playerCards.forEach(player => {
    uniquePlayers.add(player.playerName);
  });

  // Convert the Set back to an array to render unique cards
  const uniquePlayerCards = Array.from(uniquePlayers);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-900 p-8 shadow-md z-50 rounded-lg">
        <div className="flex flex-col items-stretch">
          <div className="flex items-center justify-around">
            {uniquePlayerCards.map((playerName, index) => (
              // Assuming each player card has a unique identifier (key)
              <Card key={index} data={playerCards.find(player => player.playerName === playerName)} /> 
            ))}
          </div>
          <p className="text-white text-2xl">{message}</p>
          <div className="flex items-center justify-around">
            {<button onClick={onCancel} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
              Cancel
            </button>}
            <button onClick={onConfirm} className="mt-4 px-4 py-2 rounded bg-gray-100 text-sky-700 hover:bg-gray-200 border-none cursor-pointer">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaptaincyPopup;

