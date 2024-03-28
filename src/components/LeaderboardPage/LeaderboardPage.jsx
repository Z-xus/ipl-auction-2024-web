// import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Navbar } from "../Utils";
import "./LeaderboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);
const TEAMS = {
  csk: "Chennai Super Kings", dc: "Delhi Capitals", gt: "Gujarat Titans",
  kkr: "Kolkata Knight Riders", lsg: "Lucknow Supergiants", mi: "Mumbai Indians", pbks: "Punjab Kings",
  rcb: "Royal Challengers Bangalore", rr: "Rajasthan Royals", srh: "Sunrisers Hyderabad"
};

const LeaderboardItem = ({ position, name, points }) => (
  <div className="flex items-center justify-between mb-3 min-h-12 text-center">
    <div className="text-3xl font-extrabold mx-1 w-12 min-h-8 p-1 px-2 bg-yellow-500 text-black text-center">{position}</div>
    <div className="text-3xl mx-1 font-extrabold grow min-h-8 p-1 px-4 tilted-border w-96 text-center">{TEAMS[name.toLowerCase()]}</div>
    <div className="text-3xl font-extrabold mx-2 w-20 text-center min-h-8 p-1 px-2 transform -skew-x-12 bg-yellow-500 text-black">{points}</div>
  </div>
);

const LeaderboardPage = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [team, setTeam] = useState(localStorage.getItem("team") || "");
  const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
  const [teamsData, setTeamsData] = useState([]);
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
      if (!isScoreSubmitted)
        setShowPage(true);
    }

    checkScoreSubmit();
  }, [slot, team, navigate]);

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await axios.post(`${SERVERURL}/getLeaderboard`, { slot }, { headers: { "Content-Type": "application/json" } });
        const leaderboardData = response.data;
        setTeamsData(leaderboardData);
      } catch (err) {
        console.error(`Error fetching player data for ${slot}: ${err}`);
        throw err;
      }
    }
    fetchLeaderboardData();
  }, [slot]);


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(`scoreUpdate${slot}`, (data) => {
      setTeamsData(prevTeamsData => {
        const { teamName, score } = data.payload;

        const teamIndex = prevTeamsData.findIndex(team => team.teamName === teamName);

        if (teamIndex === -1) {
          // If the team doesn't exist, add it to the array
          return [...prevTeamsData, { teamName: teamName, score }];
        } else {
          // If the team exists, update its score
          return prevTeamsData.map((team, index) =>
            index === teamIndex ? { ...team, score } : team
          );
        }
      });
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


  return (
    <div className="flex flex-col h-screen">
      {showPage ? <>
        <Navbar style={{ backdropFilter: 'blur(12.5px)' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 text-3xl">Scoreboard will be displayed shortly...</div>
      </> : <>
        <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar" style={{ backdropFilter: 'blur(12.5px)' }}>
          <h2 className="title text-7xl my-16"> LEADERBOARD </h2>
          <div className="flex flex-col flex-grow justify-evenly p-2">
            {
              (teamsData.sort((a, b) => b.score - a.score)
                .map(
                  (team, index) => <LeaderboardItem key={team.name} position={index + 1} name={team.teamName} points={team.score} />
                )
              )
            }
          </div>
        </div>
      </>}
    </div>
  );
};

export default LeaderboardPage;
