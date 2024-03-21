// import React from 'react';
import AddPlayerForm from './AddPlayer';
import DeletePlayerForm from './DeletePlayer';
import AddPowercardForm from './AddPowercard';
import DeletePowercardForm from './DeletePowercard';
import AllocateTeamForm from './AllocateTeam';

const AdminPage = () => {
  return (
    <div className='flex flex-col p-4'>
      <AddPlayerForm />
      <DeletePlayerForm />
      <AddPowercardForm />
      <DeletePowercardForm />
      <AllocateTeamForm />
    </div>
  );
};

export default AdminPage;