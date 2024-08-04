import React from 'react';

type Card = {
    id: number;
    name: string;
    image: string;
    email: string;
    address: string;
    phone_number: string;
};

interface PatientViewProps {
    cards: Card[];
    currentPage: number;
    totalPages: number;
    handleCardClick: (card: Card) => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
}

const PatientView: React.FC<PatientViewProps> = ({
    cards,
    currentPage,
    totalPages,
    handleCardClick,
    handlePrevPage,
    handleNextPage
}) => {
    return (
        <div className="flex flex-col justify-center items-center w-full bg-[#1a1a1a] p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Patients</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 w-full">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-[#2c2c2c] p-6 rounded-lg shadow cursor-pointer flex flex-col justify-between"
                        onClick={() => handleCardClick(card)}
                    >
                        <img
                            src={'https://via.placeholder.com/600x400?text=' + card.image}
                            alt={card.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-300">{card.name}</h3>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4 w-full">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-[#7345fc] hover:bg-[#9572fd] text-white'}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-600' : 'bg-[#7345fc] hover:bg-[#9572fd] text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PatientView;
