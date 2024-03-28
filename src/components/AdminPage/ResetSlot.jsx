import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const ResetSlotForm = () => {
    const [adminUsername, setAdminUsername] = useState(localStorage.getItem('username') || '');
    const [slot, setSlot] = useState('');
    const [msgDisplay, setMsgDisplay] = useState(false);
    const [resMsg, setResMsg] = useState('');

    const timeOut = () => {
        setTimeout(() => {
            setMsgDisplay(false);
        }, 10000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${SERVERURL}/adminResetSlot`, {
                adminUsername,
                slot: Number(slot)
            });

            setResMsg(response.data.message);
            setMsgDisplay(true);
            timeOut();
        } catch (err) {
            console.error('Error submitting form: ', err);
        }
    };

    return (
        <>
            {msgDisplay && <h2 className='response-text'> {resMsg} </h2>}
            <div className="admin-form-container mt-[100vh]">
                <h2 className='h2'>Reset Slot</h2>

                <form onSubmit={handleSubmit} className="form">

                    <label className='label'>
                        Slot :
                        <input className='input' type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </>
    );
};

export default ResetSlotForm;
