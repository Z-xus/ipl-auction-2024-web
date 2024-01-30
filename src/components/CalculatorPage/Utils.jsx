import { Card } from "../Utils";

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

export const Button = ({ text, event }) => {
    const handleClick = () => {
        event();
    };
    return (
        <div className={`w-28 cursor-pointer btn m-0 py-4 px-6 rounded bat-btn text-center text-2xl`} onClick={handleClick}>
            {text}
        </div>
    );
};