// import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Card, Popup, ConditionsBoard, CaptaincyPopup } from '../Utils';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import './CalculatorPage.css';

// TODO1: Add player underdog logic. ✅
// TODO2: Add legendary player logic. ✅
// TODO3: Add captaincy points. ✅
// TODO4: Sum bonus logic (90%/80%/70%). ❌
// TODO5: Add penalty points. ❌
// TODO6: submit the points to api. ❌
// TODO7: Add conditions min ppl, mo, dth. ❌

const SERVERURL = import.meta.env.VITE_SERVERURL;

const CalculatorPage = () => {

    const [points, setPoints] = useState(0);
    const [bonusPoints, setBonusPoints] = useState(0);
    const [penaltyPoints, setPenaltyPoints] = useState(0);
    const [playerData, setPlayerData] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedRadioBox, setSelectedRadioBox] = useState(null);
    const [captainName, setCaptainName] = useState(null);
    const [errMessage, setErrMessage] = useState("");

    const [showScoreboard, setShowScoreboard] = useState(false);
    const [conditionsBoardMessage, setConditionsBoardMessage] = useState('');
    // const [conditionsTitle, setConditionsboardTitle] = useState('');
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")) || []);
    const navigate = useNavigate();

    useEffect(() => {
        if (!username)
            navigate("/");
    }, [username, navigate]);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const playerPromises = players.map(async (playerID) => {
                    const response = await axios.post(`${SERVERURL}/getPlayer`, { _id: playerID }, { headers: { "Content-Type": "application/json" } });
                    return response.data;
                });

                const resolvedPlayers = await Promise.all(playerPromises);

                // Initialize counts for player cards
                const newPlayerData = resolvedPlayers.map(player => ({
                    ...player,
                    count: (player.type === "All Rounder") ? 4 : 2
                }));
                setAvailablePlayers(newPlayerData);
                setPlayerData(newPlayerData);
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        };
        fetchPlayerData();

    }, [players]);

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
        let bonusPoints = 0;
        const ChemistryPoints = 5;
        const LegendaryPoints = 10;
        const UnderdogPoints = 5;

        // player chemistry logic
        const playerChemMap = new Map();
        const duplicates = [];
        playerCards.forEach((player) => {
            playerChemMap.set(player.playerName, player.playerChemistry);
        });

        playerCards.forEach((player) => {
            const playerName = player.playerName;
            const playerChemistry = player.playerChemistry;

            if (playerChemMap.has(playerChemistry))
                duplicates.push(playerChemistry);
            else
                playerChemMap.set(playerChemistry, playerName);

        });

        // bonusPoints += duplicates.length * ChemistryPoints;

        // legendary player logic
        const legendaryPlayers = playerCards.filter(player => player.gender === 'legendary');
        console.log("Legendary players: ", legendaryPlayers.length);
        // bonusPoints += legendaryPlayers.length * LegendaryPoints;

        // underdog player logic
        const underdogPlayers = playerCards.filter(player => player.type === 'underdog');
        console.log("Underdog players: ", underdogPlayers.length);
        // bonusPoints += underdogPlayers.length * UnderdogPoints;

        setBonusPoints(bonusPoints);
    };


    // Function to validate all conditions and generate a message
    const validatePlayerConditions = () => {
        const counts = {
            "Batsman": 0,
            "Bowler": 0,
            "All Rounder": 0,
            "Wicket Keeper": 0,
            "foreign": 0,
            "women": 0,
            "underdogs": 0,
            "legendary": 0
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
            "Batsman": { min: 2, max: 4 },
            "Bowler": { min: 2, max: 4 },
            "All Rounder": { min: 2, max: 3 },
            "Wicket Keeper": { min: 1, max: 1 },
            "foreign": { min: 0, max: 4 },
            "women": { min: 1, max: 1 },
            "underdogs": { min: 1, max: 1 },
            "legendary": { min: 1, max: 1 }
        };

        let message = [];
        let allConditionsMet = true;
        for (const type in conditions) {
            const { min, max } = conditions[type];
            const count = counts[type];
            const conditionMet = count >= min && count <= max;
            const status = conditionMet ? '✅' : '❌';
            message.push(`${type}:,${min},${max},${count},${status}`);
            if (!conditionMet) {
                allConditionsMet = false;
            }
        }

        return { message, allConditionsMet };
    };

    const calculateAndUpdatePoints = (data) => {
        // Decrease the count for the player whose points are updated
        setAvailablePlayers(prevPlayers => prevPlayers.map(player => {
            if (player.playerName === data.playerName) {
                const updatedCount = player.count - 1;
                if (updatedCount === 0) {
                    return null;
                } else {
                    return { ...player, count: updatedCount };
                }
            }
            return player;
        }).filter(Boolean)); // Filter out null values to remove the dropped card

        // Check if player is already selected in playerCards[]
        playerCards.forEach(player => {
            if (player.playerName === data.playerName) {
                // console.log("Player already exists in playerCards[]");
            }
        });

        // Check if player is being added to playerCards[] for the first time
        if (!playerCards.some(player => player.playerName === data.playerName)) {
            // console.log("Player being added for the first time");
            handleSetPoints(data.overall)
        }

        const selectedProp = getStatProperty();
        handleSetPoints(data[selectedProp]);

        if (!data.selectedProps) { // Create the selectedProps array if it doesn't exist
            data.selectedProps = [];
        }

        if (!data.selectedProps.includes(selectedProp)) { // Push the current selectedProp to the array if it's not already added
            data.selectedProps.push(selectedProp);
        }

        // console.log("Data: " + JSON.stringify(data));
        // console.log("selectedProps" + JSON.stringify(data.selectedProps));
    };


    const handleOnDrop = (e) => {
        let _data = e.dataTransfer.getData("Card");

        if (selectedBox === null || selectedRadioBox === null) {
            setErrMessage("Please select Bat/Bowl and Ppl/Mo/Dth.");
            setErrShowPopup(true);
            e.preventDefault();
            return;
        }

        _data = JSON.parse(_data);

        // Iterate over playerCards[] to check if the playerCard to be dropped has the same selectedProp.
        // If yes, then alert the user and prevent the drop.
        let playerExists = false;
        playerCards.forEach(player => {
            if (player.playerName === _data.playerName && player.selectedProps[0] === getStatProperty()) {
                let selStat = player.selectedProps[0].substring(0, 3) + ' ' + player.selectedProps[0].substring(4);
                // alert(`Player already selected in stat ${selStat}`);
                setErrMessage(`Player already selected in stat ${selStat}`);
                setErrShowPopup(true);
                e.preventDefault();
                playerExists = true;
            }
        });
        if (playerExists) return; // _data.count++;

        calculateAndUpdatePoints(_data);

        // console.log("Count of " + _data.playerName + ": " + _data.count);
        setPlayerCards([...playerCards, _data]);

    };

    const handleClearCards = () => {
        // Reset values.
        setSelectedBox(null);
        setSelectedRadioBox(null);
        setPoints(0);
        // remove all cards from playerCards[] and put all into availablePlayers[]
        setAvailablePlayers(playerData);
        setPlayerCards([]);

    };

    const handleSubmit = () => {
        addBonusPoints();
        const { message, allConditionsMet } = validatePlayerConditions();
        setShowScoreboard(true);
        setConditionsBoardMessage(message);
        let msg = allConditionsMet ? "All Conditions Met" : "Conditions Not Met";
        console.log(msg); // TODO: do something with validation message
    };

    const handleCaptain = () => {
        setShowCapPopup(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Popup logic.
    const [showPopup, setShowPopup] = useState(false);
    const [showErrPopup, setErrShowPopup] = useState(false);
    const [showCapPopup, setShowCapPopup] = useState(false);
    // const handleShowPopup = () => {setShowPopup(true);};
    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleCloseErrPopup = () => {
        setErrShowPopup(false);
    };
    const handleCloseCapPopup = () => {
        setShowCapPopup(false);
    };

    const handleCloseConditionsboard = () => {
        setShowScoreboard(false);
        setShowPopup(true);
    };

    const handleConfirmCaptain = (player) => {
        setCaptainName(player.playerName);
        console.log("Captain: " + JSON.stringify(captainName));
        // TODO: Add captain bonus points to the total points when sumbitting to the API.
        setShowCapPopup(false);
    };


    return (
        <div className="calculator">
            <Navbar />
            {/* TODO: Submit total pts to api when user presses confirm btn */}
            {showErrPopup && <Popup message={errMessage} isOK={true} onCancel={null} onConfirm={handleCloseErrPopup} />}

            {showPopup && <Popup message={`Are you sure? Your total points are ${points}`} isOK={false} onCancel={handleClosePopup} onConfirm={handleClosePopup} />}

            {showScoreboard && <ConditionsBoard message={conditionsBoardMessage} onCancel={handleCloseConditionsboard} onConfirm={handleCloseConditionsboard} />}

            {showCapPopup && <CaptaincyPopup playerCards={playerCards} onCancel={handleCloseCapPopup} onConfirm={handleConfirmCaptain} />}

            <div className="main-title flex justify-between px-4 py-4 items-center">
                <div className="total-points text-2xl inline py-4 px-6">
                    Total Points: {points}
                </div>
                {
                    // <h1 className="font-bold uppercase underline text-4xl inline">Calculator</h1>
                }
                <div className="btns flex flex-row gap-3">
                    <RadioBox id={1} label="Batting" isSelected={selectedRadioBox === 1} onSelect={handleRadioBoxSelect} />
                    <RadioBox id={2} label="Bowling" isSelected={selectedRadioBox === 2} onSelect={handleRadioBoxSelect} />
                    <Button text={"Captain"} event={handleCaptain} />
                    <Button text={"Clear"} event={handleClearCards} />
                    <Button text={"Submit"} event={handleSubmit} />
                </div>
            </div>
            <div className="drag-in-container flex justify-evenly">
                <Box
                    id={1}
                    label={`Power Play ${selectedRadioBox === 1 ? "Batting" : selectedRadioBox === 2 ? "Bowling" : selectedRadioBox === null ? "Bat/Bowl" : ""}`}
                    isSelected={selectedBox === 1}
                    onSelect={handleBoxSelect}
                />
                <Box
                    id={2}
                    label={`Mid Over ${selectedRadioBox === 1 ? "Batting" : selectedRadioBox === 2 ? "Bowling" : selectedRadioBox === null ? "Bat/Bowl" : ""}`}
                    isSelected={selectedBox === 2}
                    onSelect={handleBoxSelect}
                />
                <Box
                    id={3}
                    label={`Death Over ${selectedRadioBox === 1 ? "Batting" : selectedRadioBox === 2 ? "Bowling" : selectedRadioBox === null ? "Bat/Bowl" : ""}`}
                    isSelected={selectedBox === 3}
                    onSelect={handleBoxSelect}
                />

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


