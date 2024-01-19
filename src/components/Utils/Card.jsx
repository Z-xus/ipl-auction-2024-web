// import React from 'react'
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import './Card.css'

const Draggable = ({ onDragStart, onClick, children }) => (
  <div draggable onDragStart={onDragStart} onClick={onClick}>
    {children}
  </div>
);

const Card = ({ data }) => {
  const [isFlipped, setFlip] = useState(false);

  const handleFlip = () => setFlip(!isFlipped);

  const handleOnDrag = (e) => {
    // if (!isDraggable) e.preventDefault(); // FIXME : cant stop dragging even after being put in placeholder.
    e.dataTransfer.setData("Card", JSON.stringify(data));
    console.log("ok.")
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>

      <Draggable onDragStart={(e) => handleOnDrag(e, 'Card')} onClick={handleFlip}>
        <div className='w-32 h-40 m-1 rounded bg-sky-900 flex flex-col justify-center cursor-pointer select-none'>
          <CardFront playerData={data} />
        </div>
      </Draggable>

      <Draggable onDragStart={(e) => handleOnDrag(e, 'Card')} onClick={handleFlip}>
        <CardBack playerData={data} />
      </Draggable>

    </ReactCardFlip>
  );
};

export default Card;