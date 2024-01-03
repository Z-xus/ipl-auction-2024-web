// import React from 'react';
import "./style.css";

const user = {
    points: 144,
    no_of_cards: 0
};

const Calculator = () => {
    return (
        <div className="calculator">
            <div className="main-title flex justify-between px-4 py-4">
                <div className="total-points text-2xl inline py-4 px-6">
                    Total Points: {user.points}
                </div>
                <h1 className="font-bold text-4xl inline">Calculator</h1>
                <div className="btns inline space-x-3">
                    <button className="btn py-4 px-6 text-2xl rounded bat-btn">Bat</button>
                    <button className="btn py-4 px-6 text-2xl rounded ball-btn">Ball</button>
                </div>
            </div>
            <div className="drag-in-container flex justify-evenly">
                <div className="ppl-cont drag-in flex justify-center items-center"><span className="text-xl">PPL:</span></div>
                <div className="mo-cont drag-in flex justify-center items-center "><span className="text-xl">MO:</span></div>
                <div className="dth-cont drag-in flex justify-center items-center"><span className="text-xl">DTH:</span></div>
            </div>
            <div className="card-placeholder h-48 flex justify-center items-center my-5">
                { !user.no_of_cards && <span className="placeholder-text text-xl mx-4">Placeholder for cards</span> }
            </div>  
        </div>
    );
};
export default Calculator;
