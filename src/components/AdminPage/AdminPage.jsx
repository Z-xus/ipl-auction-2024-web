// import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPlayerForm from './AddPlayer';
import DeletePlayerForm from './DeletePlayer';
import AddPowercardForm from './AddPowercard';
import DeletePowercardForm from './DeletePowercard';
import AllocateTeamForm from './AllocateTeam';
import ResetBudget from './ResetBudget';
import ResetSlot from './ResetSlot';

const ADMINS = import.meta.env.VITE_ADMINS.split(' ');

const AdminPage = () => {
  const [adminUsername, setAdminUsername] = useState(localStorage.getItem('username') || '');
  const [showPage, setShowPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ADMINS.includes(adminUsername))
      navigate('/');

    setShowPage(true);
  }, [adminUsername, navigate]);

  return (
    <>
      {showPage && <div className='flex flex-col p-4'>
        <AddPlayerForm />
        <DeletePlayerForm />
        <AddPowercardForm />
        <DeletePowercardForm />
        <AllocateTeamForm />
        <ResetBudget />
        <ResetSlot />
      </div>
      }
    </>
  );
};

export default AdminPage;