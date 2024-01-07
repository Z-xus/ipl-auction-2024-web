
export const Box = ({ id, label, isSelected, onSelect, children }) => {
    const handleClick = () => {
        onSelect(id);
    };

    return (
        <div className={`flex justify-center items-center text-xl cursor-pointer drag-in ${isSelected ? 'highlight' : ''}`} onClick={handleClick}>
            <p>{label}</p>
            {children}
        </div>
    );
};

export const Card = ({ data }) => {
    const handleOnDrag = (e) => {
        // if (!isDraggable) e.preventDefault(); // FIXME : cant stop dragging even after being put in placeholder.
        e.dataTransfer.setData("Card", JSON.stringify(data));
        console.log("ok.")
    };
    return (
        <div
            draggable
            onDragStart={(e)=> handleOnDrag(e, 'Card')}
            className='w-32 h-40 m-1 rounded bg-sky-900 flex flex-col justify-center cursor-pointer select-none'>
            <h1 className="text-center py-2">{data.playerName}</h1>    
            <div className="flex flex-row justify-evenly">
                <div className="flex flex-col text-center">
                    <span>Bat</span>
                    <span>{data.bat_ppl}</span>
                    <span>{data.bat_mo}</span>
                    <span>{data.bat_dth}</span>
                </div>
                <div className="flex flex-col text-center">
                    <span>Bowl</span>
                    <span>{data.bow_ppl}</span>
                    <span>{data.bow_mo}</span>
                    <span>{data.bow_dth}</span>
                </div>
            </div>
        </div>
    );
};


// We don't need this container afterall. Just used once
export const CardContainer = ({ cardData }) => {
    return (
        <ul className="flex justify-center items-center list-none gap-2">
            {!cardData.length === 0 && <span className="avail-player-text text-xl mx-4">Available Players Are Displayed here.</span>}
            {
                cardData.map((card, index) => (
                    <Card key={index} data={card} />
                ))}
        </ul>
    );
};

export const RadioBox = ({ id, label, isSelected, onSelect }) => {
    const handleRadioClick = () => {
        onSelect(id);
    };

    return (
        <div className={`w-28 cursor-pointer btn m-0 py-4 px-6 rounded bat-btn text-center text-2xl ${isSelected ? 'highlight-btn  ' : ''}`} onClick={handleRadioClick}>
            {label}
        </div>
    );
};
