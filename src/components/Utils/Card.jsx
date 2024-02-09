// import React from 'react'
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import './Card.css';

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
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>

      <Draggable onDragStart={(e) => handleOnDrag(e, 'Card')} onClick={handleFlip}>
        <CardFront playerData={data} />
      </Draggable>

      <Draggable onDragStart={(e) => handleOnDrag(e, 'Card')} onClick={handleFlip}>
        <CardBack playerData={data} />
      </Draggable>

    </ReactCardFlip>
  );
};

export default Card;
