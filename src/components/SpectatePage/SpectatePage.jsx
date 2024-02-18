// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Navbar, Powercard, numberConvert, fetchPlayerData } from "../Utils";
import { TeamPlayers } from "../DashboardPage/DashboardPage";
import "../DashboardPage/DashboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);

const SpectatePage = () => {
  const { teamName } = useParams();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [team, setTeam] = useState(localStorage.getItem("team"));
  const [slot, setSlot] = useState(localStorage.getItem("slot"));
  const [budget, setBudget] = useState("NaN");
  const [players, setPlayers] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [powercards, setPowercards] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${SERVERURL}/spectate/${teamName.toUpperCase()}`, { slot: slot }, { headers: { "Content-Type": "application/json" } });
        const spectateTeam = response.data.spectateTeam;
        setBudget(spectateTeam.budget);
        setPlayers(spectateTeam.players);
        setPowercards(spectateTeam.powercards);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teamName, slot]);

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
      const tempPlayers = JSON.parse(localStorage.getItem("players"));
      const playerIndex = tempPlayers.indexOf(newPlayerId);

      if (playerIndex === -1 && action === "add") {
        const updatedPlayers = [...tempPlayers, newPlayerId];
        localStorage.setItem("players", JSON.stringify(updatedPlayers));
        localStorage.setItem("budget", JSON.stringify(newBudget));
      }
      else if (playerIndex !== -1 && action === "delete") {
        const updatedPlayers = [...tempPlayers.slice(0, playerIndex), ...tempPlayers.slice(playerIndex + 1)];
        localStorage.setItem("players", JSON.stringify(updatedPlayers));
        localStorage.setItem("budget", JSON.stringify(newBudget));
      }
    };

    socket.on(`playerAdded${team}${slot}`, data => handlePlayer(data, "add"));
    socket.on(`playerDeleted${team}${slot}`, data => handlePlayer(data, "delete"));

    const handlePowercard = (data) => {
      const updatedPowercards = data.payload;
      localStorage.setItem("powercards", JSON.stringify(updatedPowercards));
    };

    socket.on(`powercardAdded${team}${slot}`, data => handlePowercard(data));
    socket.on(`usePowerCard${team}${slot}`, data => handlePowercard(data));

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
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="col-span-2">
        <Navbar />
      </nav>

      {/* Team Data */}
      <div className="team-container flex-col px-4">
        {/* Budget Info */}
        <div className="flex flex-col items-center">
          <img className="max-h-52 py-6" src={`/images/teamlogo/${teamName.toLowerCase()}.png`} alt="" />
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
  );
};

export default SpectatePage;
