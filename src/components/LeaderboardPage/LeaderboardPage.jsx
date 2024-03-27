// import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Navbar } from "../Utils";
import "./LeaderboardPage.css";

const SERVERURL = import.meta.env.VITE_SERVERURL;
const socket = io(SERVERURL);

const LeaderboardItem = ({ position, name, points }) => (
  <div className="flex items-center justify-between mb-3 min-h-12 text-cent er">
    <div className="text-3xl font-extrabold mx-1 min-w-8 min-h-8 p-1 px-2 bg-yellow-500 text-black">{position}</div>
    <div className="text-3xl mx-1 font-extrabold grow min-h-8 p-1 px-4 tilted-border">{name}</div>
    <div className="text-3xl font-extrabold mx-2 min-w-8 min-h-8 p-1 px-2 transform -skew-x-12 bg-yellow-500 text-black">{points}</div>
  </div>
);

const LeaderboardPage = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [teamsData, setTeamsData] = useState([]);
  const [slot, setSlot] = useState(localStorage.getItem("slot") || 0);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username)
      navigate("/");
  }, [username, navigate]);

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await axios.post(`${SERVERURL}/getLeaderboard`, { slot }, { headers: { "Content-Type": "application/json" } });
        const leaderboardData =  response.data;
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
      console.log("connected");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(`scoreUpdate${slot}`, (data) => {
      setTeamsData(prevTeamsData => {
        console.log(data);
        const teamName = data.payload.teamName;
        const score = data.payload.score;
        
        // Check if the team already exists in prevTeamsData
        const teamExists = prevTeamsData.find(team => team.name === teamName);

        // If the team doesn't exist, add it to the array
        if (!teamExists) {
          const obj = { teamName: teamName, score: score };
          return [...prevTeamsData, obj];
        }
        else {
          const newArray = prevTeamsData.filter(team => team.name !== teamName);
          teamExists.score = score;
          return [...newArray, teamExists];
        }
      });
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [slot]);


  return (
    <div className="flex flex-col h-screen">
      <Navbar style={{ backdropFilter: 'blur(12.5px)' }} />
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar" style={{ backdropFilter: 'blur(12.5px)' }}>
        <h2 className="title text-7xl my-16"> LEADERBOARD </h2>
        <div className="flex flex-col flex-grow justify-evenly p-2">
          {
            teamsData.length > 0 ? (teamsData.sort((a, b) => b.score - a.score)
              .map(
                (team, index) => <LeaderboardItem key={team.name} position={index + 1} name={team.teamName} points={team.score} />
              )
            ) : <div className="mt-2 text-3xl">Scoreboard will be displayed shortly...</div>
          }
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
