import React from 'react';
import './leaderboard.css'
import { Navbar } from '../Utils'

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

const Leaderboard = () => {
    return (
        <main >
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-5xl font-extrabold my-16 text-white title">LEADERBOARD</h2>
                <div className="p-2 m-0">
                    {teamsData.map((team, index) => (
                        <div key={index} className="flex items-center justify-between mb-1 min-h-12 text-center">
                            <div className="text-lg font-extrabold mx-1 min-w-6 min-h-8 p-1 bg-yellow-500 text-black">{team.position}</div>
                            <div className="text-lg mx-1 font-bold text-white grow min-h-8 p-1 px-2 tilted-border">{team.name}</div>
                            <div className="text-lg font-extrabold mx-2 min-w-6 min-h-8 p-1 transform -skew-x-12 bg-yellow-500 text-black">{team.points}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Leaderboard;