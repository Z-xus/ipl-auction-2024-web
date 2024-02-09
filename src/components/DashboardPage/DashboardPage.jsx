// import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { Navbar, Card, Powercard } from "../Utils";
import "./DashboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);

function numberConvert(number) {
  let num = Math.abs(Number(number));
  let sign = Math.sign(num);

  if (num >= 1e7)
    return `${sign * (num / 1e7).toFixed(1)} CR`;
  else if (num >= 1e5)
    return `${sign * (num / 1e5).toFixed(1)} L`;
  else if (num >= 1e3)
    return `${sign * (num / 1e3).toFixed(1)} K`;
  else
    return (sign * num).toString();
}

const TeamPlayers = ({ type, data }) => {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playerPromises = data.map(async (playerID) => {
          const response = await axios.post(`${SERVERURL}/getPlayer`, { _id: playerID }, { headers: { "Content-Type": "application/json" } });
          return response.data;
        });

        const resolvedPlayers = await Promise.all(playerPromises);
        setPlayersData(resolvedPlayers);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayerData();
  }, [data]);

  if (!playersData.find(player => player.type === type)) return null;

  return (
    <div className='flex flex-col'>
      <p className='powercard-text text-xl'>{type.toUpperCase()}</p>
      <div className='flex flex-wrap items-center justify-evenly'>
        {playersData.map(player => (
          player.type === type &&
          <div className="px-8 py-4" key={player.playerName}>
            <Card data={player} />
          </div>
        )
        )}
      </div>
    </div>
  );
};

TeamPlayers.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

const DashboardPage = ({ teamDetails }) => {
  const playerTypes = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [team, setTeam] = useState(localStorage.getItem("team"));
  const [slot, setSlot] = useState(localStorage.getItem("slot"));
  const [budget, setBudget] = useState(localStorage.getItem("budget"));
  const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")));
  const [powercards, setPowercards] = useState(JSON.parse(localStorage.getItem("powercards")));
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // useEffect is too much pain
    socket.on('connect', () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    if (teamDetails) {
      setTeam(teamDetails.teamName);
      setBudget(teamDetails.buget);
      setPlayers(teamDetails.players);
      setPowercards(teamDetails.powercards);
    }
    else {
      socket.on(`playerAdded${team}${slot}`, (data) => {
        const newPlayerId = data.payload._id;
        const tempPlayers = JSON.parse(localStorage.getItem("players"));

        setPlayers(prevPlayers => {
          if (JSON.stringify(prevPlayers) != JSON.stringify(tempPlayers)) {
            // We are on Spectate Page, Don't update display
            const playerIndex = tempPlayers.indexOf(newPlayerId);
            if (playerIndex === -1) {
              const updatedPlayers = [...tempPlayers, newPlayerId];
              localStorage.setItem("players", JSON.stringify(updatedPlayers));
            }
            return prevPlayers;
          }

          // Return updated players list
          const playerIndex = prevPlayers.indexOf(newPlayerId);
          if (playerIndex === -1) {
            const updatedPlayers = [...prevPlayers, newPlayerId];
            localStorage.setItem("players", JSON.stringify(updatedPlayers));
            return updatedPlayers;
          }

          return prevPlayers
        });
      })

      socket.on(`playerDeleted${team}${slot}`, (data) => {
        const newPlayerId = data.payload._id;
        const tempPlayers = JSON.parse(localStorage.getItem("players"));

        setPlayers(prevPlayers => {
          if (JSON.stringify(prevPlayers) != JSON.stringify(tempPlayers)) {
            // We are on Spectate Page, Don't update display
            const playerIndex = tempPlayers.indexOf(newPlayerId);
            if (playerIndex !== -1) {
              const updatedPlayers = [...tempPlayers.slice(0, playerIndex), ...tempPlayers.slice(playerIndex + 1)];
              localStorage.setItem("players", JSON.stringify(updatedPlayers));
            }
            return prevPlayers;
          }

          // Return updated players list
          const playerIndex = prevPlayers.indexOf(newPlayerId);
          if (playerIndex !== -1) {
            const updatedPlayers = [...prevPlayers.slice(0, playerIndex), ...prevPlayers.slice(playerIndex + 1)];
            localStorage.setItem("players", JSON.stringify(updatedPlayers));
            return updatedPlayers;
          }

          return prevPlayers;
        });
      })

      socket.on(`powercardAdded${team}${slot}`, (data) => {
        const updatedPowercards = data.payload;

        setPowercards(prevPowercards => {
          const tempPowercards = JSON.parse(localStorage.getItem("powercards"));

          if (JSON.stringify(prevPowercards) != JSON.stringify(tempPowercards)) {
            // We are on Spectate Page, Don't update display
            localStorage.setItem("powercards", JSON.stringify(updatedPowercards));
            return prevPowercards;
          }

          // Return updated powercards list
          localStorage.setItem("powercards", JSON.stringify(updatedPowercards));
          return updatedPowercards;
        });
      })

      socket.on(`teamAllocate${username}${slot}`, (data) => {
        console.log(data);
      })

      socket.on(`usePowerCard${team}${slot}`,(data)=>{
        console.log(data);
      })

    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [username, team, slot, teamDetails]);

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
        <p className='powercard-text text-2xl my-2'> CURRENT TEAM PLAYERS </p>
        {playerTypes.map(type => (<TeamPlayers key={type} type={type} data={players} />))}
      </div>
    </div>
  );
};

DashboardPage.propTypes = {
  teamDetails: PropTypes.object
};

export default DashboardPage;
