// import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Navbar, Card, Powercard, numberConvert, fetchPlayerData } from "../Utils";
import "./DashboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);
const PLAYERTYPES = ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'];

const TeamPlayers = ({ players }) => {
  return (
    <>
      {PLAYERTYPES.map(type => {
        const filteredPlayers = players.filter(player => player.type === type);

        if (filteredPlayers.length === 0) return null;

        return (
          <div className='flex flex-col' key={type}>
            <p className='powercard-text text-xl'>{type.toUpperCase()}</p>
            <div className='flex flex-wrap items-center justify-evenly'>
              {filteredPlayers.map(player => (
                <div className="px-8 py-4" key={player.playerName}>
                  <Card data={player} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

const DashboardPage = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [team, setTeam] = useState(localStorage.getItem("team") || "");
  const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
  const [budget, setBudget] = useState(localStorage.getItem("budget") || "NaN");
  const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")) || []);
  const [powercards, setPowercards] = useState(JSON.parse(localStorage.getItem("powercards")) || []);
  const [playersData, setPlayersData] = useState([]);
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
    socket.on('connect', () => {
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
          setBudget(newBudget);
          return updatedPlayers;
        }
        else if (playerIndex !== -1 && action === "delete") {
          const updatedPlayers = [...prevPlayers.slice(0, playerIndex), ...prevPlayers.slice(playerIndex + 1)];
          localStorage.setItem("players", JSON.stringify(updatedPlayers));
          localStorage.setItem("budget", JSON.stringify(newBudget));
          setBudget(newBudget);
          return updatedPlayers;
        }

        return prevPlayers;
      });
    };

    socket.on(`playerAdded${team}${slot}`, data => handlePlayer(data, "add"));
    socket.on(`playerDeleted${team}${slot}`, data => handlePlayer(data, "delete"));

    const handlePowercard = (data) => {
      const updatedPowercards = data.payload.powercards;
      const newBudget = data.payload.budget;
      setPowercards(updatedPowercards);
      localStorage.setItem("powercards", JSON.stringify(updatedPowercards));
      setBudget(newBudget);
      localStorage.setItem("budget", JSON.stringify(newBudget));
    };

    socket.on(`powercardAdded${team}${slot}`, data => handlePowercard(data));
    socket.on(`usePowerCard${team}${slot}`, data => handlePowercard(data));

    socket.on(`resetBudget${team}${slot}`, (data) => {
      const newBudget = data.payload.budget;
      setBudget(newBudget);
      localStorage.setItem("budget", newBudget);
    });

    socket.on(`teamAllocate${username}${slot}`, (data) => {
      const teamData = data.payload;
      setTeam(teamData.teamName);
      localStorage.setItem("team", teamData.teamName);
      setBudget(teamData.budget);
      localStorage.setItem("budget", teamData.budget);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [username, team, slot]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedPlayers = await Promise.all(players.map(playerID => fetchPlayerData(SERVERURL, playerID)));
        setPlayersData(resolvedPlayers);
      } catch (err) {
        console.error('Error fetching player data: ', err);
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
            <img className="max-h-52 py-6" src={`/images/teamlogo/${team.toLowerCase()}.png`} alt="" />
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

export default DashboardPage;
export { TeamPlayers };
