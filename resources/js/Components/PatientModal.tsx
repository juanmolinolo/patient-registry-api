import React from 'react';
import Modal from '../Components/Modal';

type Card = {
    id: number;
    name: string;
    image: string;
    email: string;
    address: string;
    phone_number: string;
};

interface PatientModalProps {
    show: boolean;
    onClose: () => void;
    selectedCard: Card | null;
}

const PatientModal: React.FC<PatientModalProps> = ({ show, onClose, selectedCard }) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedCard?.name}</h2>
                <img
                    src={'https://via.placeholder.com/600x400?text=' + selectedCard?.image}
                    alt={selectedCard?.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p>Email: {selectedCard?.email}</p>
                <p>Address: {selectedCard?.address}</p>
                <p>Phone: {selectedCard?.phone_number}</p>
            </div>
        </Modal>
    );
};

export default PatientModal;
