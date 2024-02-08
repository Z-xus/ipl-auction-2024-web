// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardPage } from '../'


const dummyTeam = {
  "username": "user1",
  "password": "password1",
  "slot": 1,
  "teamName": "CSK",
  "budget": 765678921,
  "score": 78,
  "players": [],
  "powercards": [
    { name: "focus fire", isUsed: false },
    { name: "double right to match", isUsed: false },
    { name: "god's eye", isUsed: true },
    { name: "right to match", isUsed: true },
    { name: "silent reserve", isUsed: false },
    { name: "stealth bid", isUsed: true }
  ]
}

const SpectatePage = () => {
  
  const { teamName } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
    setTeamDetails(dummyTeam);
  }, [teamName])

  return <DashboardPage teamDetails={teamDetails} />;
};

export default SpectatePage;