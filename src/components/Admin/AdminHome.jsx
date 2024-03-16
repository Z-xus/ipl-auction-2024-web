import React from 'react'
import AddPlayer from './AddPlayer'
import DeletePlayer from './DeletePlayer'
import ManagePowercard from './ManagePowercard'
import AllocateTeam from './AllocateTeam'

const AdminHome = () => {
  return (
    <main>
      <AddPlayer />
      <DeletePlayer />
      <ManagePowercard />
      <AllocateTeam />
    </main>
  )
}

export default AdminHome