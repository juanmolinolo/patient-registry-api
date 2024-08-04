import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Modal from '../Components/Modal';
import Form from '../Components/Form';
import PatientView from '../Components/PatientView';

type Card = {
    id: number;
    name: string;
    image: string;
    email: string;
    address: string;
    phone_number: string;
};

export default function Main() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cards, setCards] = useState<Card[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        password: '',
        image: null
    });
    const [modalMessage, setModalMessage] = useState('');
    const [isFormSubmit, setIsFormSubmit] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost/api/patients');
            const result = await response.json();
            const data = result.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                image: item.image_route,
                email: item.email,
                address: item.address,
                phone_number: item.phone_number
            }));
            setCards(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [id]: files[0] });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('address', formData.address);
        formDataToSubmit.append('phone_number', formData.phone);
        formDataToSubmit.append('password', formData.password);
        if (formData.image) {
            formDataToSubmit.append('image', formData.image);
        }

        try {
            const response = await fetch('http://localhost/api/patients', {
                method: 'POST',
                body: formDataToSubmit
            });

            if (response.ok) {
                setModalMessage('Patient added successfully!');
                fetchData();
            } else {
                setModalMessage('Error adding patient. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalMessage('Error adding patient. Please try again.');
        }

        setSelectedCard(null); // Clear the selected card
        setIsFormSubmit(true); // Indicate that the modal was triggered by form submission
        setShowModal(true);
    };

    const cardsPerPage = 4;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        setIsFormSubmit(false); // Indicate that the modal was triggered by card click
        setShowModal(true);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            <Head title="Patients" />
            <div className="flex flex-col justify-start items-center bg-[#1d212f] text-white p-6 min-h-screen">
                {/* Logo at the top left */}
                <div className="flex justify-start w-full mb-6">
                    <img 
                        src="https://cdn.prod.website-files.com/651178dd2e51892e3c569ce3/651178dd2e51892e3c569d3d_logo.svg" 
                        alt="Light-it logo" 
                        className="navbar_logo"
                    />
                </div>
                <div className="w-full max-w-7xl flex space-x-4">
                    {/* Left card with form */}
                    <Form formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />

                    {/* Right card with patients cards embedded */}
                    <PatientView
                        cards={currentCards}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handleCardClick={handleCardClick}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                    <div className="p-6">
                        {isFormSubmit ? (
                            <p>{modalMessage}</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-4">{selectedCard?.name}</h2>
                                <img
                                    src={'https://via.placeholder.com/600x400?text=' + selectedCard?.image}
                                    alt={selectedCard?.name}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <p>Email: {selectedCard?.email}</p>
                                <p>Address: {selectedCard?.address}</p>
                                <p>Phone: {selectedCard?.phone_number}</p>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}
