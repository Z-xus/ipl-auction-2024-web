// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardPage } from '../'
import axios from 'axios';

const SpectatePage = () => {
  
  const { teamName } = useParams();
  const slot = localStorage.getItem('slot');
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/spectate/${teamName}/${slot}`);
        // const response = await axios.get(`http://localhost:3000/spectate/MI/2`);
        const data = response.data;
        console.log(data);
        setTeamDetails(data.newUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teamName,slot]);


  return <DashboardPage teamDetails={teamDetails} />;
};

export default SpectatePage;