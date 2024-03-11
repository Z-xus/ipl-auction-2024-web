// TODO: Calculate points.
// TODO: Use a storage to store the points and their descriptions for validation at backend.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Card, Popup, ConditionsBoard, CaptaincyPopup } from '../Utils';
import { RadioBox, CardContainer, Box, Button } from './Utils.jsx';
import './CalculatorPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const maxCardCapacity = [
    { category: "bat_ppl", capacity: 4 },
    { category: "bat_mo", capacity: 4 },
    { category: "bat_dth", capacity: 3 },
    { category: "bow_ppl", capacity: 3 },
    { category: "bow_mo", capacity: 3 },
    { category: "bow_dth", capacity: 4 }
];

const CalculatorTestPage = () => {

    // Data
    const [points, setPoints] = useState(0);
    const [bonusPoints, setBonusPoints] = useState(0);
    // const [penaltyPoints, setPenaltyPoints] = useState(0);
    const [playerData, setPlayerData] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [captainName, setCaptainName] = useState(null);
    const [prevCaptainName, setPrevCaptainName] = useState(null);
    const [conditionsBoardMessage, setConditionsBoardMessage] = useState('');

    /////////////////////////////////////////////////////////////////////////////////////////////
    const [pointsMemo, setPointsMemo] = useState({}); // Stores the points as well as the description of the points why they were added 
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
    // Refresh
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
                // setDroppedCards(newPlayerData);
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

    const categorySum = (category) => {
        let sum = 0;
        if (category === "bat_ppl") {
            batPplCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else if (category === "bat_mo") {
            batMoCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else if (category === "bat_dth") {
            batDthCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else if (category === "bow_ppl") {
            bowPplCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else if (category === "bow_mo") {
            bowMoCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else if (category === "bow_dth") {
            bowDthCards.forEach(player => {
                sum += player[category];
            });
            return sum;
        } else {
            console.warn("Invalid category" + " " + category);
            return 0;
        }
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

        if (prop === "bat_ppl") {
            playerExists = isCardInArray(data, batPplCards);
            if (!playerExists) {
                setBatPplCards([...batPplCards, data]);
            }
        }
        else if (prop === "bat_mo") {
            playerExists = isCardInArray(data, batMoCards);
            if (!playerExists) {
                setBatMoCards([...batMoCards, data]);
            }
        }
        else if (prop === "bat_dth") {
            playerExists = isCardInArray(data, batDthCards);
            if (!playerExists) {
                setBatDthCards([...batDthCards, data]);
            }
        }
        else if (prop === "bow_ppl") {
            playerExists = isCardInArray(data, bowPplCards);
            if (!playerExists) {
                setBowPplCards([...bowPplCards, data]);
            }
        }
        else if (prop === "bow_mo") {
            playerExists = isCardInArray(data, bowMoCards);
            if (!playerExists) {
                setBowMoCards([...bowMoCards, data]);
            }
        }
        else if (prop === "bow_dth") {
            playerExists = isCardInArray(data, bowDthCards);
            if (!playerExists) {
                setBowDthCards([...bowDthCards, data]);
            }
        }
        else {
            console.warn("Invalid property");
            setErrMessage("Oops.. There's some unexpected issue. Please contact the administrator.")
            e.preventDefault();
            return;
        }

        if (playerExists) {
            showErrorMessage("Player already selected in this category");
            e.preventDefault();
            return;
        }


        // console.log("Available Players: ", availablePlayers);
        console.log("Dropped Cards: ", droppedCards);
        // console.log("Data: ", data);

        // console.log("Bat PPL: ", (batPplCards));
        // console.log("Bat Mo: ", (batMoCards));
        // console.log("Bat Dth: ", (batDthCards));
        // console.log("Bow Ppl: ", (bowPplCards));
        // console.log("Bow Mo: ", (bowMoCards));
        // console.log("Bow Dth: ", (bowDthCards));


        // POINT CALCULATION
        // points = overall points + condition points + captincy points + chemistry points + underdog points
        // We'll recalulate the points for the dropped cards and replace it with the current point to be accurate and avoid edge case handlings.

        let overall_points = 0;
        let conditional_points = 0;
        let chemistry_points = 0;
        let underdog_points = 0;
        let captaincy_points = 0;

        // OVERALL POINTS
        // Check if player is being added to playerCards[] for the first time, else we dont add the overall points again.
        if (!playerCards.some(player => player.playerName === _data.playerName)) {
            console.log("Player being added for the first time");
            overall_points = data.overall;
        }

        // CONDITION POINTS
        maxCardCapacity.forEach(row => {
            const { category, capacity } = row;
            const sumStat = categorySum(category);
            let percentage = sumStat / (capacity * 10);
            if (percentage > 0.9 && percentage <= 1) {
                conditional_points += 5;
            } else if (percentage > 0.8 && percentage <= 0.9) {
                conditional_points += 3;
            } else if (percentage > 0.7 && percentage <= 0.8) {
                conditional_points += 1;
            }
        })

        // UNDERDOG POINTS
        const underdogPlayers = droppedCards.filter(player => player.type === 'underdog');
        underdogPlayers.forEach(player => {
            underdog_points += player.underdogPts;
        });

        // CHEMISTRY POINTS
        // Iterate over droppedCards[] and check if two players have the same chemistry, if yes, add 5 points.
        droppedCards.forEach((player, index) => {
            for (let i = index + 1; i < droppedCards.length; i++) {
                if (player.playerChemistry === droppedCards[i].playerChemistry) {
                    chemistry_points += 5;
                }
            }
        });

        // Dunno.. but we'll see..
        // If the current captain is the previous captain as well, then we dont add the captaincy points again.
        // If the current captain is different from the previous captain, then we add the curent captaincy points and subtract the previous captaincy points.
        // If the previous captain is null, then we add the current captaincy points.
        // If the current captain is null, then we subtract the previous captaincy points.

        // Decreement the count of the player.
        setAvailablePlayers(prevPlayers => prevPlayers.map(player => {
            if (player.playerName === data.playerName) {
                console.log(player.count);
                const updatedCount = player.count - 1;
                if (updatedCount === 0) {
                    return null;
                } else {
                    return { ...player, count: updatedCount };
                }
            }
            return player;
        }).filter(Boolean)); // Filter out null values to remove the dropped card

    };

    const handleClearCards = () => {
        setSelectedBox(null);
        setSelectedRadioBox(null);
        setPoints(0);
        setBonusPoints(0);
        setAvailablePlayers(playerData);
        setDroppedCards([]);
        setBatPplCards([]);
        setBatMoCards([]);
        setBatDthCards([]);
        setBowPplCards([]);
        setBowMoCards([]);
        setBowDthCards([]);

    };

    const handleSubmit = () => {
        // addBonusPoints();
        // calculateBonusFromStats();
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
        //  FIXME: Not Working.. no idea why..  says no available players..
        if (!captainName === null) setPrevCaptainName(captainName);
        setCaptainName(player.playerName);
        console.log("Captain: " + JSON.stringify(captainName));
        console.log("Prev Captain: " + JSON.stringify(prevCaptainName));
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
                    {
                        // TODO: Temporary..
                    }
                    Bonus Points: {bonusPoints}
                </div>
                <div className="total-points text-2xl inline py-4 px-6">
                    {
                        // PERF: react-flip-numbers library?
                    }
                    Total Points: {points}
                </div>
                {
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
                    // FIXME: not working when there is 0 elements in the array
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
export default CalculatorTestPage;
