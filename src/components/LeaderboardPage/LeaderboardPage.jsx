import React, { useState, useEffect } from 'react';
import { Navbar } from '../Utils'
import './LeaderboardPage.css'
import io from 'socket.io-client';

const teamsData = [
  { name: 'Mumbai Indians', points: 20, position: 1 },
  { name: 'Chennai Super Kings', points: 18, position: 2 },
  { name: 'Delhi Capitals', points: 16, position: 3 },
  { name: 'Royal Challengers Bangalore', points: 14, position: 4 },
  { name: 'Kolkata Knight Riders', points: 12, position: 5 },
  { name: 'Rajasthan Royals', points: 10, position: 6 },
  { name: 'Kings XI Punjab', points: 8, position: 7 },
  { name: 'Sunrisers Hyderabad', points: 6, position: 8 },
];

const socket = io(`http://localhost:3000`);

const LeaderboardItem = ({ position, name, points }) => (
  <div className="flex items-center justify-between mb-3 min-h-12 text-center">
    <div className="text-3xl font-extrabold mx-1 min-w-8 min-h-8 p-1 px-2 bg-yellow-500 text-black">{position}</div>
    <div className="text-3xl mx-1 font-extrabold grow min-h-8 p-1 px-4 tilted-border">{name}</div>
    <div className="text-3xl font-extrabold mx-2 min-w-8 min-h-8 p-1 px-2 transform -skew-x-12 bg-yellow-500 text-black">{points}</div>
  </div>
);

const LeaderboardPage = () => {

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('scoreUpdateTeam22',(data)=>{ //refer dashboard for why Team22
      console.log(data);
    });
  
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar style={{ backdropFilter: 'blur(12.5px)' }} />
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar" style={{ backdropFilter: 'blur(12.5px)' }}>
        <h2 className="title text-7xl my-16"> LEADERBOARD </h2>
        <div className="flex flex-col flex-grow justify-evenly p-2">
          {teamsData.map(team => <LeaderboardItem key={team.position} position={team.position} name={team.name} points={team.points} />)}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;