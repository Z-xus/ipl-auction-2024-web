import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Card, Popup, ConditionsBoard, CaptaincyPopup } from '../Utils';
import io from 'socket.io-client';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import './CalculatorPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);

const maxCardCapacity = [
    { category: "bat_ppl", capacity: 4 },
    { category: "bat_mo", capacity: 4 },
    { category: "bat_dth", capacity: 3 },
    { category: "bow_ppl", capacity: 3 },
    { category: "bow_mo", capacity: 3 },
    { category: "bow_dth", capacity: 4 }
];

const CalculatorPage = () => {

    // Data
    const [points, setPoints] = useState(0);
    const [playerData, setPlayerData] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [captain, setCaptain] = useState({});
    const [conditionsBoardMessage, setConditionsBoardMessage] = useState('');

    /////////////////////////////////////////////////////////////////////////////////////////////
    // const [pointsMemo, setPointsMemo] = useState({}); // TODO: Stores the points as well as the description of the points why they were added 
    // Categories of Cards
    const [batPplCards, setBatPplCards] = useState([]);
    const [batMoCards, setBatMoCards] = useState([]);
    const [batDthCards, setBatDthCards] = useState([]);
    const [bowPplCards, setBowPplCards] = useState([]);
    const [bowMoCards, setBowMoCards] = useState([]);
    const [bowDthCards, setBowDthCards] = useState([]);

    // Currently dropped cards
    const [droppedCards, setDroppedCards] = useState([]);

    // Array of categories and their corresponding arrays
    const categoryArrayMapping = [
        { category: "bat_ppl", array: batPplCards },
        { category: "bat_mo", array: batMoCards },
        { category: "bat_dth", array: batDthCards },
        { category: "bow_ppl", array: bowPplCards },
        { category: "bow_mo", array: bowMoCards },
        { category: "bow_dth", array: bowDthCards }
    ];
    /////////////////////////////////////////////////////////////////////////////////////////////
    // UI
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedRadioBox, setSelectedRadioBox] = useState(null);
    const [errMessage, setErrMessage] = useState("");
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");
    // Refresh
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")) || []);
    const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
    const [team, setTeam] = useState(localStorage.getItem("team") || "");
    const [isConnected, setIsConnected] = useState(socket.connected);

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
                // setDroppedCards(newPlayerData);
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        };
        fetchPlayerData();

    }, [players]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("connected");
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        const handlePlayer = (data, action) => {
            const newPlayerId = data.payload.playerID;
            const newBudget = data.payload.budget;
            setPlayers(prevPlayers => {
                const playerIndex = prevPlayers.indexOf(newPlayerId);
                if (playerIndex === -1 && action === "add") {
                    const updatedPlayers = [...prevPlayers, newPlayerId];
                    localStorage.setItem("players", JSON.stringify(updatedPlayers));
                    localStorage.setItem("budget", JSON.stringify(newBudget));
                    return updatedPlayers;
                }
                else if (playerIndex !== -1 && action === "delete") {
                    const updatedPlayers = [...prevPlayers.slice(0, playerIndex), ...prevPlayers.slice(playerIndex + 1)];
                    localStorage.setItem("players", JSON.stringify(updatedPlayers));
                    localStorage.setItem("budget", JSON.stringify(newBudget));
                    return updatedPlayers;
                }
                return prevPlayers;
            });
        };

        socket.on(`playerAdded${team}${slot}`, data => handlePlayer(data, "add"));
        socket.on(`playerDeleted${team}${slot}`, data => handlePlayer(data, "delete"));
        socket.on(`teamAllocate${username}${slot}`, (data) => {
            const teamData = data.payload;
            localStorage.setItem("team", teamData.teamName);
            localStorage.setItem("budget", teamData.budget);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, [username, team, slot]);


    const handleBoxSelect = (boxId) => {
        setSelectedBox(boxId);
    };
    const handleRadioBoxSelect = (boxId) => {
        setSelectedRadioBox(boxId);
    };

    const showErrorMessage = (message) => {
        setErrMessage(message);
        setErrShowPopup(true);
    };

    // points is Nan when user drags before clicking on the required bat/bowl and ppl/mo/dth buttons.
    const handleSetPoints = (change) => {
        setPoints(points => points + change);
    };

    // Get the current selected property (category)
    const getStatProperty = () => {
        if (selectedBox === null || selectedRadioBox === null) return null;
        let prop = "";
        if (selectedRadioBox === 1) prop += "bat"
        else if (selectedRadioBox === 2) prop += "bow"
        prop += "_";
        if (selectedBox === 1) prop += "ppl";
        else if (selectedBox === 2) prop += "mo";
        else if (selectedBox === 3) prop += "dth";

        return prop;
    };

    // Optimization possible here...
    const categorySum = ({ category, batPplCards, batMoCards, batDthCards, bowPplCards, bowMoCards, bowDthCards }) => {

        const calculateCategorySum = (category, cards) => {
            let sum = 0;
            cards.forEach(player => {
                sum += player[category];
            });
            return sum;
        };

        const getCategoryCards = (category) => {
            switch (category) {
                case "bat_ppl":
                    return batPplCards;
                case "bat_mo":
                    return batMoCards;
                case "bat_dth":
                    return batDthCards;
                case "bow_ppl":
                    return bowPplCards;
                case "bow_mo":
                    return bowMoCards;
                case "bow_dth":
                    return bowDthCards;
                default:
                    console.warn("Invalid category: " + category);
                    return [];
            }
        };

        const cards = getCategoryCards(category);
        const sum = calculateCategorySum(category, cards);

        return sum;
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

    const hasExceededMaxCards = (category, currentCardsCount) => {
        const foundCategory = maxCardCapacity.find(item => item.category === category);
        if (!foundCategory) {
            return false;
        }
        return currentCardsCount >= foundCategory.capacity;
    };

    function isCardInArray(card, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].playerName === card.playerName) {
                return true;
            }
        }
        return false;
    }


    const handleOnDrop = (e) => {
        let _data = e.dataTransfer.getData("Card");

        if (selectedBox === null || selectedRadioBox === null) {
            showErrorMessage("Please select Bat/Bowl and Ppl/Mo/Dth.");
            e.preventDefault();
            return;
        }

        let data = JSON.parse(_data);

        // Add the card to DroppedCards[] if it doesn't already exist.
        if (!droppedCards.some(player => player.playerName === data.playerName)) {
            setDroppedCards([...droppedCards, data]);
        }

        // Add the card to the corresponding category array using the getStatProperty() function if it doesn't already exist
        const prop = getStatProperty();
        let playerExists = false;
        let maxCardCountReached = false;

        if (prop === "bat_ppl") {
            playerExists = isCardInArray(data, batPplCards);
            maxCardCountReached = hasExceededMaxCards("bat_ppl", batPplCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBatPplCards([...batPplCards, data]);
            }
        } else if (prop === "bat_mo") {
            playerExists = isCardInArray(data, batMoCards);
            maxCardCountReached = hasExceededMaxCards("bat_mo", batMoCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBatMoCards([...batMoCards, data]);
            }
        } else if (prop === "bat_dth") {
            playerExists = isCardInArray(data, batDthCards);
            maxCardCountReached = hasExceededMaxCards("bat_dth", batDthCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBatDthCards([...batDthCards, data]);
            }
        } else if (prop === "bow_ppl") {
            playerExists = isCardInArray(data, bowPplCards);
            maxCardCountReached = hasExceededMaxCards("bow_ppl", bowPplCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBowPplCards([...bowPplCards, data]);
            }
        } else if (prop === "bow_mo") {
            playerExists = isCardInArray(data, bowMoCards);
            maxCardCountReached = hasExceededMaxCards("bow_mo", bowMoCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBowMoCards([...bowMoCards, data]);
            }
        } else if (prop === "bow_dth") {
            playerExists = isCardInArray(data, bowDthCards);
            maxCardCountReached = hasExceededMaxCards("bow_dth", bowDthCards.length);
            if (!playerExists && !maxCardCountReached) {
                setBowDthCards([...bowDthCards, data]);
            }
        } else {
            console.warn("Invalid property");
            setErrMessage("Oops.. There's some unexpected issue. Please contact the administrator.")
            e.preventDefault();
            return;
        }
        if (maxCardCountReached) {
            showErrorMessage("Max cards reached for this category");
            e.preventDefault();
            return;
        }

        if (playerExists) {
            showErrorMessage("Player already selected in this category");
            e.preventDefault();
            return;
        }

        // TODO: Penalty deduction 

        // POINT CALCULATION
        // points = overall points + condition points + captincy points + chemistry points + underdog points
        // We'll recalulate the points for the dropped cards and replace it with the current point to be accurate and avoid edge case handlings.

        setDroppedCards(prevDroppedCards => {
            let total_points = 0;
            let overall_points = 0;
            let conditional_points = 0;
            let chemistry_points = 0;
            let underdog_points = 0;
            let captaincy_points = 0;

            // OVERALL POINTS
            prevDroppedCards.forEach(player => {
                overall_points += player.overall;
            });

            // CONDITION POINTS
            maxCardCapacity.forEach(row => {
                const { category, capacity } = row;
                let sumStat = categorySum({
                    category: category,
                    batPplCards: batPplCards,
                    batMoCards: batMoCards,
                    batDthCards: batDthCards,
                    bowPplCards: bowPplCards,
                    bowMoCards: bowMoCards,
                    bowDthCards: bowDthCards
                });
                // HACK: Add the current card's stat to the sum, because it isn't updated in the state.
                if (category === prop) sumStat += data[prop];
                let percentage = sumStat / (capacity * 10);
                if (percentage > 0.9 && percentage <= 1) {
                    conditional_points += 5;
                } else if (percentage > 0.8 && percentage <= 0.9) {
                    conditional_points += 3;
                } else if (percentage > 0.7 && percentage <= 0.8) {
                    conditional_points += 1;
                }
            });

            // CHEMISTRY POINTS
            prevDroppedCards.forEach((player, index) => {
                for (let i = index + 1; i < prevDroppedCards.length; i++) {
                    if (player.playerChemistry === prevDroppedCards[i].playerChemistry) {
                        chemistry_points += 5;
                    }
                }
            });

            // CAPTAINCY POINTS
            prevDroppedCards.forEach(player => {
                if (player.playerName === captain.playerName) {
                    captaincy_points += player.captaincyRating;
                }
            });

            total_points = overall_points + conditional_points + chemistry_points + underdog_points + captaincy_points;
            console.log("Total Points " + total_points + " Overall Points: " + overall_points + " Conditional Points: " + conditional_points + " Chemistry Points: " + chemistry_points + " Underdog Points: " + underdog_points + " Captaincy Points: " + captaincy_points);
            setPoints(total_points);

            // Decreement the count of the player.
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

            return prevDroppedCards;
        });
    };

    const underdogCalculation = () => {
        let underdog_points = 0;
        const underdogPlayers = droppedCards.filter(player => player.gender === 'underdog');
        underdogPlayers.forEach(player => {
            underdog_points += player.underdogPts;
        });
        return underdog_points;
    };


    const handleClearCards = () => {
        setSelectedBox(null);
        setSelectedRadioBox(null);
        setPoints(0);
        setAvailablePlayers(playerData);
        setDroppedCards([]);
        setBatPplCards([]);
        setBatMoCards([]);
        setBatDthCards([]);
        setBowPplCards([]);
        setBowMoCards([]);
        setBowDthCards([]);
    };

    const handleSubmit = async () => {
        setShowPopup(true);
        let u_points = underdogCalculation();
        setPoints(prev => prev + u_points);
        console.log("Underdog Points: " + u_points);
        if (u_points === 0) setSubmitMsg(`Your total points are ${points}\nAre you sure you want to submit?`);
        else setSubmitMsg(`Your bonus points are ${u_points} Your total points are ${points} Are you sure you want to submit?`);
        try {
            const response = await axios.post(`${SERVERURL}/calculator`, {
                teamName: team,
                slot: parseInt(slot),
                score: points
            });
            console.log("Username: " + username, " Team: " + team, " Slot: " + slot, " Points: " + points);
            console.log(response.data);
            if (response.data.message === "Score updated successfully") 
               console.log("Score updated successfully");
            else 
               console.log("There was an error updating score.");
        } catch (error) {
            console.error('Error submitting data:', error);
        }
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
    };

    const handleConfirmCaptain = (player) => {
        setCaptain(player);
        console.log("Captain Player points: ", player.captaincyRating);
        setShowCapPopup(false);
    };


    return (
        <div className="calculator">
            <Navbar />
            {
                // TODO: Refine the UI/UX.
            }
            {showErrPopup && <Popup message={errMessage} isOK={true} onCancel={null} onConfirm={handleCloseErrPopup} />}

            {showPopup && <Popup message={submitMsg} isOK={false} onCancel={handleClosePopup} onConfirm={handleClosePopup} />}

            {showScoreboard && <ConditionsBoard message={conditionsBoardMessage} onCancel={handleCloseConditionsboard} onConfirm={handleCloseConditionsboard} />}

            {showCapPopup && <CaptaincyPopup playerCards={droppedCards} onCancel={handleCloseCapPopup} onConfirm={handleConfirmCaptain} />}

            <div className="main-title flex justify-between px-4 py-4 items-center">
                <div className="total-points text-2xl inline py-4 px-6">
                    {
                        // PERF: react-flip-numbers library?
                    }
                    Total Points: {points}
                </div>
                {
                    // NOTE: not important
                    // TODO: What to do with this?..
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
                {
                    // NOTE: not important
                    // FIXME: not working (sometimes) when there is 0 elements in the array
                    // no cards dropped yet or no buttons pressed yet.
                    (categoryArrayMapping.find(item => item.category === getStatProperty()) &&
                        categoryArrayMapping.find(item => item.category === getStatProperty()).array.length === 0) ||
                    getStatProperty() === null && (
                        <span className="placeholder-text text-xl mx-4 flex">Drop your cards here!</span>
                    )
                }

                {
                    getStatProperty() === 'bat_ppl' && batPplCards.length > 0 && (
                        batPplCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
                {
                    getStatProperty() === 'bat_mo' && batMoCards.length > 0 && (
                        batMoCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
                {
                    getStatProperty() === 'bat_dth' && batDthCards.length > 0 && (
                        batDthCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
                {
                    getStatProperty() === 'bow_ppl' && bowPplCards.length > 0 && (
                        bowPplCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
                {
                    getStatProperty() === 'bow_mo' && bowMoCards.length > 0 && (
                        bowMoCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
                {
                    getStatProperty() === 'bow_dth' && bowDthCards.length > 0 && (
                        bowDthCards.map((data, index) => (
                            <Card key={index} data={data} />
                        ))
                    )
                }
            </div>
            <CardContainer cardData={availablePlayers} />
        </div>
    );
};
export default CalculatorPage;

