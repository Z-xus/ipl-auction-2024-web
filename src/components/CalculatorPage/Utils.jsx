import { Card } from "../Utils";
import { useState, useRef } from 'react';

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

const ScrollButton = ({ direction, onClick }) => {
    return (
        <button
            className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-0 bottom-0 ${
                direction === 'left' ? 'ml-2' : 'mr-2'
            } rounded-md my-2 shadow-md flex items-center justify-center`}
            onClick={onClick}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-6 h-full text-gray-700 transform ${
                    direction === 'right' ? 'rotate-180' : ''
                }`}
            >
                <path
                    fillRule="evenodd"
                    d={
                        direction === 'left'
                            ? 'M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z'
                            : 'M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z'
                    }
                />
            </svg>
        </button>
    );
};

export const CardContainer = ({ cardData }) => {
    const containerRef = useRef(null);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scrollContainer = (scrollOffset) => {
        const container = containerRef.current;
        if (container) {
            container.scrollLeft += scrollOffset;
            setScrollLeft(container.scrollLeft);
        }
    };

    return (
        <div className="relative">
            <ul
                ref={containerRef}
                className="flex overflow-x-scroll items-center list-none gap-3 p-2 px-3"
                style={{ scrollBehavior: 'smooth' }}
            >
                {!cardData.length === 0 && (
                    <span className="avail-player-text text-xl mx-4">Available Players Are Displayed here.</span>
                )}
                {cardData.map((card, index) => (
                    <Card key={index} data={card} />
                ))}
            </ul>
            <ScrollButton direction="left" onClick={() => scrollContainer(-100)} />
            {containerRef.current &&
                containerRef.current.scrollWidth - containerRef.current.clientWidth > scrollLeft && (
                    <ScrollButton direction="right" onClick={() => scrollContainer(100)} />
                )}
        </div>
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
