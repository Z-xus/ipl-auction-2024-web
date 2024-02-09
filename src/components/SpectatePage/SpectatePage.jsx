// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardPage } from '../'
import axios from 'axios';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const SpectatePage = () => {
  
  const { teamName } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const slot = localStorage.getItem('slot');

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVERURL}/spectate/${teamName.toUpperCase()}/${slot}`);
        const data = response.data;
        setTeamDetails(data.newUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teamName, slot]);

  return <DashboardPage teamDetails={teamDetails} />;
};

export default SpectatePage;