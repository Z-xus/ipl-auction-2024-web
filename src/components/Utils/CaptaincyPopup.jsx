import { useState } from "react";
import CardFront from "./CardFront";

const CaptaincyPopup = ({ message, onCancel, onConfirm, playerCards, currentCaptain }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSelectCard = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleConfirm = () => {
    if (selectedCard)
      onConfirm(selectedCard); // Pass the selected card data to the onConfirm function
  };

  // Filter unique cards based on playerName
  const uniquePlayerCards = Array.from(
    new Set(playerCards.map((player) => player.playerName))
  ).map((playerName) =>
    playerCards.find((player) => player.playerName === playerName)
  );

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent backdrop-blur-lg p-8 shadow-lg border-fancy-blue border-4 z-50 rounded-lg">
        <h2 className="text-white text-3xl text-center mb-5 font-bold">Select Captain</h2>
        <div className="flex flex-col items-stretch">
          <div className="flex items-center justify-around pt-4">
            {uniquePlayerCards.length === 0 && (
              <p className="text-white text-2xl">No players available</p>
            )}
            {uniquePlayerCards.map((player, index) => (
              <div key={index} className="z-50 relative">
                <CardFront
                  key={index}
                  playerData={player}
                  isSelected={player === selectedCard}
                  onSelect={() => handleSelectCard(player)}
                />
                {player.playerName === currentCaptain.playerName && (
                  <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
                    <img src={`/images/icons/arrow.svg`} className="w-10 h-10 relative text-red left-16 bottom-3" alt="White Arrow" />
                  </div>
                )}
                {player === selectedCard && (
                  <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
                    <img src={`/images/icons/arrow-colored.svg`} className="w-10 h-10 relative left-16 text-white bottom-3" alt="Blue Arrow" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-white text-2xl">{message}</p>
          <div className="flex items-center justify-around">
            {<button onClick={onCancel} className="mt-4 px-4 py-2 rounded font-bold bg-gray-100 text-indigo-700 hover:bg-gray-200 border-none cursor-pointer">
              Cancel
            </button>}
            <button onClick={handleConfirm} className="mt-4 px-4 py-2 rounded font-bold bg-gray-100 text-indigo-700 hover:bg-gray-200 border-none cursor-pointer">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaptaincyPopup;

