// import React from 'react';
import { useEffect, useState } from 'react';
import { Navbar, Card, Popup, ConditionsBoard } from '../Utils';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import playerData from './assets/player';
import './CalculatorPage.css';

// TODO: revamp logic for calculating points. ✅
// TODO1: Add player Chemestry logic. 🔃
// TODO2: Add player underdog logic. 🔃
// TODO3: Add min-max no of players logic. ✅
// TODO4: Add one player to multiple stats logic. ✅
// TODO5: Add legendary player logic. ❓
// TODO6: make selectedProp an array of strings to store multiple stats for a player. ✅

const CalculatorPage = () => {

    const [points, setPoints] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);
    const [availablePlayers, setavailablePlayers] = useState(playerData);
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedRadioBox, setSelectedRadioBox] = useState(null);

    const [showScoreboard, setShowScoreboard] = useState(false);
    const [conditionsBoardMessage, setConditionsBoardMessage] = useState('');
    const [conditionsTitle, setConditionsboardTitle] = useState('');

    // Initially set all card counts. Each count represents the number of times a player can be selected.
    useEffect(() => {
        // Initialize counts for player cards
        const updatedPlayerCards = playerData.map(player => ({
            ...player,
            count: (player.type === "All-Rounder") ? 4 : 2 
        }));
        setavailablePlayers(updatedPlayerCards);
    }, []);

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

    const addBonusPoints = () => {
        // Add bonus points if playerCards[] has two players with the same playerChemestry and they are not same players.
        let bonusPoints = 0;
        const selectedProp = getStatProperty();
        let playerChemestry = 0;
        let playerChemestryCount = 0;
        let playerChemestryPlayers = [];
        playerCards.forEach((player) => {
            if (player.selectedProps && player.selectedProps.includes(selectedProp)) {
                playerChemestry = player.playerChemestry;
                playerChemestryCount++;
                playerChemestryPlayers.push(player);
            }
        });
        if (playerChemestryCount === 2 && playerChemestryPlayers[0].playerName !== playerChemestryPlayers[1].playerName) {
            bonusPoints += 5;
        }
        return bonusPoints;
    };

    // Function to validate all conditions and generate a message
    const validateAllConditions = () => {
        const counts = {
            batsman: 0,
            bowler: 0,
            all_rounder: 0,
            wicket_keeper: 0,
            foreign: 0,
            women: 0,
            underdogs: 0,
            legendary: 0
        };

        playerCards.forEach(card => {
            counts[card.type]++;
            if (card.gender === 'female') {
                counts['women']++;
            }
            if (card.gender === 'legendary') {
                counts['legendary']++;
            }
        });

        const conditions = {
            batsman: { min: 2, max: 4 },
            bowler: { min: 2, max: 4 },
            all_rounder: { min: 2, max: 3 },
            wicket_keeper: { min: 1, max: 1 },
            foreign: { min: 0, max: 4 },
            women: { min: 1, max: 1 },
            underdogs: { min: 1, max: 1 },
            legendary: { min: 1, max: 1 }
        };

        let message = [];
        let allConditionsMet = true;
        for (const type in conditions) {
            const { min, max } = conditions[type];
            const count = counts[type];
            const conditionMet = count >= min && count <= max;
            const status = conditionMet ? '✅' : '❌';
            message.push(`${type}: (${count}/${min}-${max}) ${status}`);
            if (!conditionMet) {
                allConditionsMet = false;
            }
        }

        return { message, allConditionsMet };
    };

    const calculateAndUpdatePoints = (data) => {
        // Decrease the count for the player whose points are updated
        setavailablePlayers(prevPlayers => prevPlayers.map(player => {
            if (player.playerName === data.playerName) {
                return { ...player, count: player.count - 1 };
            }
            return player;
        }));

        // function to validate players: have minimum 2 batsman, 2 bowlers, 2 all-rounder, 1 wicket_keeper, 1 women, 1 underdog, 1 legendary and maxiumum 4 batsman, 4 bowlers, 3 all_rounders, 1 wicket_keeper, 4 foreign, 1 woman, 1 underdog, 1 legendary

        // Get the current selected property
        const selectedProp = getStatProperty();

        // Update points based on the selected property
        handleSetPoints(data[selectedProp] + addBonusPoints());

        // Create the selectedProps array if it doesn't exist
        if (!data.selectedProps) {
            data.selectedProps = [];
        }

        // Push the current selectedProp to the array
        data.selectedProps.push(selectedProp);
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
            if (data.playerName === _data.playerName && data.selectedProp === getStatProperty()) {
                let selStat = data.selectedProp.substring(0, 3) + ' ' + data.selectedProp.substring(4);
                alert(`Player already selected in stat ${selStat}`);
                return true; // Player already exists
            }
            return false;
        })) {
            e.preventDefault();
            return;
        }
        if (_data.count === 0) {
            e.preventDefault();
            setavailablePlayers(prevPlayers => prevPlayers.filter(
                player => player.playerName !== _data.playerName
            ));
            setPlayerCards([...playerCards, _data]);
            return;
        }

        calculateAndUpdatePoints(_data);
        // console.log("Count of " + _data.playerName + ": " + _data.count);
        setPlayerCards([...playerCards, _data]);

    };

    const handleClearCards = () => {
        console.log(playerCards);
        // Reset values.
        const updatedPlayerCards = playerData.map(player => ({
            ...player,
            count: (player.type === "All-Rounder") ? 4 : 2
        }));
        setSelectedBox(null);
        setSelectedRadioBox(null);
        setPoints(0);
        // remove all cards from playerCards[] and put all into availablePlayers[]
        setavailablePlayers(updatedPlayerCards);
        setPlayerCards([]);

    };

    const handleSubmit = () => {
        const { message, allConditionsMet } = validateAllConditions();
        setShowScoreboard(true);
        setConditionsBoardMessage(message);
        setConditionsboardTitle(allConditionsMet ? "All Conditions Met" : "Conditions Not Met");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Popup logic.
    const [showPopup, setShowPopup] = useState(false);
    // const handleShowPopup = () => {setShowPopup(true);};
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleCloseConditionsboard = () => {
        setShowScoreboard(false);
    };


    return (
        <div className="calculator">
            <Navbar />
            {/* TODO: Submit total pts to api when user presses confirm btn */}
            {showPopup && <Popup message={`Are you sure? Your total points are ${points}`} onCancel={handleClosePopup} onConfirm={handleClosePopup} />}
            {showScoreboard && <ConditionsBoard message={conditionsBoardMessage} title={conditionsTitle} onCancel={handleCloseConditionsboard} onConfirm={handleCloseConditionsboard} />}
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
                    playerCards.filter(data => data.selectedProps && data.selectedProps.includes(getStatProperty()))
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


