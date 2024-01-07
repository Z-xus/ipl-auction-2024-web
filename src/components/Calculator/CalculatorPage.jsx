import { useState } from 'react';
import NavBar from "../Utils/Navbar"
import "./style.css";
import { RadioBox, CardContainer, Box, Card } from "./Utils.jsx";
import  playerData  from "./assets/player";


// dummy user.
const user = {
    points: 144,
    no_of_cards: 0,
    avail_players: 5
};

// TODONEWS1: join <Card /> with the json data.
// 2: take up the data from cards and add up to the total.
// TODO0: Create drag and drop functionality using html5 api.
// 0.1: create a state to carry information.
// TODO1: Hold the card in the placeholder. 
// TODO2: Add them into the user's total.
// TODO3: Calculate the summation correctly using the user properties and selected options.

const Calculator = () => {

    const total_pts = 0;
    // To save the cards which are dragged into placeholder.
    const [playerCards, setPlayerCards] = useState([]);


    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedRadioBox, setSelectedRadioBox] = useState(null);
    const handleBoxSelect = (boxId) => {
        setSelectedBox(boxId);
    };
    const handleRadioBoxSelect = (boxId) => {
        setSelectedRadioBox(boxId);
    };

    const handleOnDrop = (e) => {
        let _data = e.dataTransfer.getData("Card");
        console.log("type: ", _data);
        console.log(playerCards);
        _data = JSON.parse(_data);
        // TODO : extract the data and add to the total
        setPlayerCards([...playerCards, _data]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="calculator">
            <NavBar />
            <div className="main-title flex justify-between px-4 py-4 items-center">
                <div className="total-points text-2xl inline py-4 px-6">
                    Total Points: {user.points}
                </div>
                <h1 className="font-bold uppercase underline text-4xl inline">Calculator</h1>
                <div className="btns flex flex-row gap-3">
                    {
                        // <button className="btn py-4 px-6 text-2xl rounded bat-btn">Bat</button>
                        // <button className="btn py-4 px-6 text-2xl rounded ball-btn">Ball</button>
                    }
                    <RadioBox id={1} label="Bat" isSelected={selectedRadioBox === 1} onSelect={handleRadioBoxSelect} />
                    <RadioBox id={2} label="Bowl" isSelected={selectedRadioBox === 2} onSelect={handleRadioBoxSelect} />
                </div>
            </div>
            <div className="drag-in-container flex justify-evenly">
                <Box id={1} label="PPL:" isSelected={selectedBox === 1} onSelect={handleBoxSelect} />
                <Box id={2} label="MO:" isSelected={selectedBox === 2} onSelect={handleBoxSelect} />
                <Box id={3} label="DTH:" isSelected={selectedBox === 3} onSelect={handleBoxSelect} />
            </div>
            <div className="card-placeholder h-40 flex justify-center items-center my-10"
                onDrop={handleOnDrop} onDragOver={handleDragOver}
            >
                {!playerCards.length && <span className="placeholder-text text-xl mx-4 flex gap-2">Drop your cards here!</span>}
                {
                    playerCards.map((data, index) => (
                        // <div className="dropped" key={index}>
                        //     {data.playerName}
                        // </div>
                        <Card key={index} data={data} style={{tansform : 'scale(0.9)'}} />
                    ))
                }
            </div>
            <CardContainer cardData={playerData} />
        </div>
    );
};
export default Calculator;
