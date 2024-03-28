// TODO: FIX POPUPS. - Submit and Error
// TODO: Highlight the current Captain.
// TODO: Show conditional Board.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Card, Popup, ConditionsBoard, CaptaincyPopup } from '../Utils';
import io from 'socket.io-client';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import './CalculatorPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);
const PENALTY_PER_VIOLATION = 100;

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
    const [showConditionsBoard, setShowConditionsBoard] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");
    // Refresh
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")) || []);
    const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
    const [team, setTeam] = useState(localStorage.getItem("team") || "");
    const [showPage, setShowPage] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);

    const navigate = useNavigate();

    useEffect(() => {
        if (!username)
            navigate("/");
    }, [username, navigate]);

    useEffect(() => {
        async function checkScoreSubmit() {
            const response = await axios.post(`${SERVERURL}/checkScoreSubmit`, { teamName: team, slot: slot }, { headers: { "Content-Type": "application/json" } });
            const isScoreSubmitted = response.data.isSubmitted;
            if (isScoreSubmitted)
                navigate('/leaderboard');
            else
                setShowPage(true);
        }

        checkScoreSubmit();
    }, [slot, team, navigate]);

    useEffect(() => {
        (async () => {
            try {
                const playerPromises = players.map(async (playerID) => {
                    const response = await axios.post(`${SERVERURL}/getPlayer`, { _id: playerID }, { headers: { "Content-Type": "application/json" } });
                    return response.data;
                });

                const resolvedPlayers = await Promise.all(playerPromises);

                const newPlayerData = resolvedPlayers.map(player => ({
                    ...player,
                    count: (player.type === "All Rounder") ? 4 : 2
                }));
                setAvailablePlayers(newPlayerData);
                setPlayerData(newPlayerData);
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        })();

    }, [players]);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        const handlePlayer = (data) => {
            const newBudget = data.payload.budget;
            localStorage.setItem("budget", JSON.stringify(newBudget));
        };

        socket.on(`playerAdded${team}${slot}`, data => handlePlayer(data));
        socket.on(`playerDeleted${team}${slot}`, data => handlePlayer(data));

        const handlePowercard = (data) => {
            const updatedPowercards = data.payload.powercards;
            const newBudget = data.payload.budget;
            localStorage.setItem("powercards", JSON.stringify(updatedPowercards));
            localStorage.setItem("budget", JSON.stringify(newBudget));
        };

        socket.on(`powercardAdded${team}${slot}`, data => handlePowercard(data));
        socket.on(`usePowerCard${team}${slot}`, data => handlePowercard(data));

        socket.on(`resetBudget${team}${slot}`, (data) => {
            const newBudget = data.payload.budget;
            localStorage.setItem("budget", newBudget);
        });

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
        if (selectedRadioBox === 1) prop += "bat";
        else if (selectedRadioBox === 2) prop += "bow";
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

        playerData.forEach(card => {
            counts[card.type]++;
            if (card.gender === 'female') {
                counts['women']++;
            }
            if (card.gender === 'legendary') {
                counts['legendary']++;
            }
            if (card.gender === 'underdog') {
                counts['underdogs']++;
            }
            if (card.flag !== "ind") {
                counts['foreign']++;
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
        let penalty = 0;
        for (const type in conditions) {
            const { min, max } = conditions[type];
            console.log(type, min, max, counts[type]);
            const count = counts[type];
            const conditionMet = count >= min && count <= max;
            const minConditionMet = count >= min;
            penalty += minConditionMet ? 0 : PENALTY_PER_VIOLATION; // TODO: Log this in pointsMemo
            const status = conditionMet ? '✅' : '❌';
            message.push(`${type}:,${min},${max},${count},${status}`);
            if (!conditionMet) {
                allConditionsMet = false;
            }
        }

        return { message, allConditionsMet, penalty };
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
            setErrMessage("Oops.. There's some unexpected issue. Please contact the administrator.");
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

            prevDroppedCards.forEach((player, index) => {
                // OVERALL POINTS

                // CHEMISTRY POINTS
                for (let i = index + 1; i < prevDroppedCards.length; i++) {
                    let sameChemistry = player.playerChemistry === prevDroppedCards[i].playerChemistry;
                    let undefinedChemistry = player.playerChemistry === undefined || prevDroppedCards[i].playerChemistry === undefined;
                    let samePlayer = player.playerName === prevDroppedCards[i].playerName;
                    if (sameChemistry && !undefinedChemistry && !samePlayer) {
                        chemistry_points += 5;
                        console.log(player.playerName + " and " + prevDroppedCards[i].playerName + " have chemistry points " + player.playerChemistry);
                    }
                }
                // CAPTAINCY POINTS
                if (player.playerName === captain.playerName) {
                    captaincy_points += player.captaincyRating;
                }
            });

            playerData.forEach(player => { overall_points += player.overall; });

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
        setShowSubmitPopup(true);
        // Show the conditions board.
        setSubmitMsg(`Your total points are ${points}\nAre you sure you want to submit?`);
        const { message, allConditionsMet, penalty } = validatePlayerConditions();
        console.log(penalty);
        try {
            const response = await axios.post(`${SERVERURL}/calculator`, {
                teamName: team,
                slot: parseInt(slot),
                score: points,
                penalty: penalty
            });
            // console.log("Username: " + username, " Team: " + team, " Slot: " + slot, " Points: " + points, " Penalty: " + penalty);
            // TODO: Display these in popups.
            if (response.data.message === "Score updated successfully") {
                console.log("Score updated successfully");
                navigate('/leaderboard');
            }
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
    const [showSubmitPopup, setShowSubmitPopup] = useState(false);
    const [showErrPopup, setErrShowPopup] = useState(false);
    const [showCapPopup, setShowCapPopup] = useState(false);
    // const handleShowPopup = () => {setShowPopup(true);};
    const handleClosePopup = () => {
        setShowSubmitPopup(false);
    };
    const handleCloseErrPopup = () => {
        setErrShowPopup(false);
    };
    const handleCloseCapPopup = () => {
        setShowCapPopup(false);
    };

    const handleCloseConditionsboard = () => {
        setShowConditionsBoard(false);
    };

    const handleConfirmCaptain = (player) => {
        setCaptain(player);
        console.log("Captain Player points: ", player.captaincyRating);
        // I know this is not the best way to do this, but I'm running out of luck this time.
        // We'll recalculate, extracting calculation logic into a function breaks it, because, react.
        let total_points = 0;
        let overall_points = 0, conditional_points = 0, chemistry_points = 0, underdog_points = 0, captaincy_points = 0;

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
            // Hack is not needed here, because the card is already added to the state.
            let percentage = sumStat / (capacity * 10);
            if (percentage > 0.9 && percentage <= 1) {
                conditional_points += 5;
            } else if (percentage > 0.8 && percentage <= 0.9) {
                conditional_points += 3;
            } else if (percentage > 0.7 && percentage <= 0.8) {
                conditional_points += 1;
            }
        });

        // OVERALL POINTS
        playerData.forEach(player => { overall_points += player.overall; });
        droppedCards.forEach((player, index) => {
            // CHEMISTRY POINTS
            for (let i = index + 1; i < droppedCards.length; i++) {
                let sameChemistry = player.playerChemistry === droppedCards[i].playerChemistry;
                let undefinedChemistry = player.playerChemistry === undefined || droppedCards[i].playerChemistry === undefined;
                let samePlayer = player.playerName === droppedCards[i].playerName;
                if (sameChemistry && !undefinedChemistry && !samePlayer) {
                    chemistry_points += 5;
                }
            }
        });

        // CAPTAINCY POINTS - no need to loop through the dropped cards.
        captaincy_points = player.captaincyRating;

        total_points = overall_points + conditional_points + chemistry_points + underdog_points + captaincy_points;
        // console.log("Total Points " + total_points + " Overall Points: " + overall_points + " Conditional Points: " + conditional_points + " Chemistry Points: " + chemistry_points + " Underdog Points: " + underdog_points + " Captaincy Points: " + captaincy_points);
        setPoints(total_points);
        setShowCapPopup(false);
    };


    return (
        showPage && <>
            <div className="calculator">
                <Navbar />
                {
                    // TODO: Refine the UI/UX.
                }
                {showErrPopup && <Popup message={errMessage} isOK={true} onCancel={null} onConfirm={handleCloseErrPopup} />}

                {showSubmitPopup && <Popup message={submitMsg} isOK={false} onCancel={handleClosePopup} onConfirm={handleClosePopup} />}

                {showConditionsBoard && <ConditionsBoard message={conditionsBoardMessage} onCancel={handleCloseConditionsboard} onConfirm={handleCloseConditionsboard} />}

                {showCapPopup && <CaptaincyPopup playerCards={droppedCards} currentCaptain={captain} onCancel={handleCloseCapPopup} onConfirm={handleConfirmCaptain} />}

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
        </>
    );
};
export default CalculatorPage;

