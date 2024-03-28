// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Navbar, Powercard, numberConvert, fetchPlayerData } from "../Utils";
import { TeamPlayers } from "../DashboardPage/DashboardPage";
import "../DashboardPage/DashboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);

const SpectatePage = () => {
  const { teamName } = useParams();
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [team, setTeam] = useState(localStorage.getItem("team") || "");
  const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
  const [budget, setBudget] = useState("NaN");
  const [players, setPlayers] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [powercards, setPowercards] = useState([]);
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
    const fetchData = async () => {
      try {
        const response = await axios.post(`${SERVERURL}/spectate/${teamName.toUpperCase()}`, { slot: slot }, { headers: { "Content-Type": "application/json" } });
        const spectateTeam = response.data.spectateTeam;
        if (spectateTeam) {
          setBudget(spectateTeam.budget);
          setPlayers(spectateTeam.players);
          setPowercards(spectateTeam.powercards);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teamName, slot]);

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

    const handleSpectateTeamPlayer = (data, action) => {
      const newPlayerId = data.payload.playerID;
      const newBudget = data.payload.budget;

      setPlayers(prevPlayers => {
        const playerIndex = prevPlayers.indexOf(newPlayerId);

        if (playerIndex === -1 && action === "add") {
          const updatedPlayers = [...prevPlayers, newPlayerId];
          setBudget(newBudget);
          return updatedPlayers;
        }
        else if (playerIndex !== -1 && action === "delete") {
          const updatedPlayers = [...prevPlayers.slice(0, playerIndex), ...prevPlayers.slice(playerIndex + 1)];
          setBudget(newBudget);
          return updatedPlayers;
        }

        return prevPlayers;
      });
    };

    socket.on(`playerAdded${teamName.toUpperCase()}${slot}`, data => handleSpectateTeamPlayer(data, "add"));
    socket.on(`playerDeleted${teamName.toUpperCase()}${slot}`, data => handleSpectateTeamPlayer(data, "delete"));

    const handleSpectateTeamPowercard = (data) => {
      const updatedPowercards = data.payload.powercards;
      const newBudget = data.payload.budget;
      setPowercards(updatedPowercards);
      setBudget(newBudget);
    };

    socket.on(`powercardAdded${teamName.toUpperCase()}${slot}`, data => handleSpectateTeamPowercard(data));
    socket.on(`usePowerCard${teamName.toUpperCase()}${slot}`, data => handleSpectateTeamPowercard(data));

    socket.on(`resetBudget${teamName}${slot}`, (data) => {
      const newBudget = data.payload.budget;
      setBudget(newBudget);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [username, team, teamName, slot]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedPlayers = await Promise.all(players.map(playerID => fetchPlayerData(SERVERURL, playerID)));
        setPlayersData(resolvedPlayers);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchData();
  }, [players]);

  return (
    showPage && <>
      <div className="dashboard-container">
        {/* Navbar */}
        <nav className="col-span-2">
          <Navbar />
        </nav>

        {/* Team Data */}
        <div className="team-container flex-col px-4">
          {/* Budget Info */}
          <div className="flex flex-col items-center">
            <img className="max-h-52 py-6" src={`/images/teamlogo/${teamName}.png`} alt="" />
            <p className="budget-text text-2xl leading-[0]">CURRENT BUDGET</p>
            <p className="budget-text text-[4rem] leading-[6rem]">{numberConvert(budget)}</p>
            <hr className="w-11/12" />
          </div>

          {/* Powercard Info */}
          <div className="flex flex-col items-center">
            <p className="powercard-text">POWERCARDS</p>
            <div className="powerupcard-container">
              {powercards.map(({ name, isUsed, _id }) => (<Powercard key={_id} name={name} isUsed={isUsed} />))}
            </div>
          </div>
        </div>

        {/* Team Players */}
        <div className="overflow-y-auto m-1/12 p-2 custom-scrollbar">
          <p className='powercard-text text-2xl my-4'> CURRENT TEAM PLAYERS </p>
          <TeamPlayers players={playersData} />
        </div>
      </div>
    </>
  );
};

export default SpectatePage;
