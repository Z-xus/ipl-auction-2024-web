// import React from 'react';
import { useState } from 'react';
import { Navbar, Card, Popup } from '../Utils';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import playerData from './assets/player';
import './CalculatorPage.css';

const CalculatorPage = () => {

    const [points, setPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);
    const [availablePlayers, setavailablePlayers] = useState(playerData);

    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedRadioBox, setSelectedRadioBox] = useState(null);

    const handleBoxSelect = (boxId) => {
        setSelectedBox(boxId);
    };
    const handleRadioBoxSelect = (boxId) => {
        setSelectedRadioBox(boxId);
    };

    // points is Nan when user drags before clicking on the required bat/bowl and ppl/mo/dth buttons.
    const handleSetPoints = (change) => {
        setPoints(points => points + change);
    };

    const getStatProperty = () => {

        let prop = "";
        if (selectedRadioBox === 1) prop += "bat"
        else if (selectedRadioBox === 2) prop += "bow"

        prop += "_";

        if (selectedBox === 1) prop += "ppl";
        else if (selectedBox === 2) prop += "mo";
        else if (selectedBox === 3) prop += "dth";

        return prop;
    };

    const handleOnDrop = (e) => {
        let _data = e.dataTransfer.getData("Card");

        if (selectedBox === null || selectedRadioBox === null) {
            alert("Please select Bat/Bowl and Ppl/Mo/Dth."); // use a toast message for this.
            e.preventDefault();
            return;
        }

        _data = JSON.parse(_data);

        // Check if card already exists in the placeholder.
        if (playerCards.some(data => {
            if (data.playerName === _data.playerName) {
                let selStat = data.selectedProp.substring(0, 3) + ' ' + data.selectedProp.substring(4);
                alert(`Player already selected in stat ${selStat}`);
                return true; // Player already exists
            }
            return false;
        })) {
            // Player already exists, no further action needed
        } else {
            // On Dropping the player, we need to remove it from the availablePlayers array.
            let stat = getStatProperty();
            handleSetPoints(_data[stat]);
            _data.selectedProp = stat;
            setavailablePlayers(prevPlayers => prevPlayers.filter(
                player => player.playerName !== _data.playerName
            ))
            setPlayerCards([...playerCards, _data]);
        }
    };

    const handleClearCards = () => {
        // clears all cards.
        // remove all cards from playerCards[] and put all into availablePlayers[]
        setavailablePlayers((prevPlayers) => [...prevPlayers, ...playerCards]);
        setPlayerCards([]);

    };

    const handleSubmit = () => {
        // make a popup confirmation.
        handleShowPopup();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Popup logic.
    const [showPopup, setShowPopup] = useState(false);
    const handleShowPopup = () => {
        setShowPopup(true);
    };
    const handleClosePopup = () => {
        setShowPopup(false);
    };


    return (
        <div className="calculator">
            <Navbar />
            {/* TODO: Submit total pts to api when user presses confirm btn */}
            {showPopup && <Popup message={`Are you sure? Your total points are ${points}`} onCancel={handleClosePopup} onConfirm={handleClosePopup} />}
            <div className="main-title flex justify-between px-4 py-4 items-center">
                <div className="total-points text-2xl inline py-4 px-6">
                    Total Points: {points}
                </div>
                {
                // <h1 className="font-bold uppercase underline text-4xl inline">Calculator</h1>
                }
                <div className="btns flex flex-row gap-3">
                    <RadioBox id={1} label="Bat" isSelected={selectedRadioBox === 1} onSelect={handleRadioBoxSelect} />
                    <RadioBox id={2} label="Bowl" isSelected={selectedRadioBox === 2} onSelect={handleRadioBoxSelect} />
                    <Button text={"Clear"} event={handleClearCards} />
                    <Button text={"Submit"} event={handleSubmit} />
                </div>
            </div>
            <div className="drag-in-container flex justify-evenly">
                <Box id={1} label="PPL:" isSelected={selectedBox === 1} onSelect={handleBoxSelect} />
                <Box id={2} label="MO:" isSelected={selectedBox === 2} onSelect={handleBoxSelect} />
                <Box id={3} label="DTH:" isSelected={selectedBox === 3} onSelect={handleBoxSelect} />
            </div>
            <div className="card-placeholder h-[11.7rem] flex justify-center items-center my-7"
                onDrop={handleOnDrop} onDragOver={handleDragOver}
            >
                {!playerCards.length && <span className="placeholder-text text-xl mx-4 flex">Drop your cards here!</span>}
                {
                    playerCards.filter(data => data.selectedProp === getStatProperty())
                        .map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                }
            </div>
            <CardContainer cardData={availablePlayers} />
        </div>
    );
};
export default CalculatorPage;
