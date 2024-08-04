import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Modal from '../Components/Modal';

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
            console.log(result);
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
                    {/* Left Card with Form */}
                    <div className="bg-[#1a1a1a] p-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">Add a new patient</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="address"
                                    type="text"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="phone">
                                    Phone number
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="image">
                                    I.D. image
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="image"
                                    type="file"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-[#7345fc] hover:bg-[#9572fd] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Card with Bigger Cards */}
                    <div className="flex flex-col justify-center items-center w-full bg-[#1a1a1a] p-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Patients</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 w-full">
                            {currentCards.map((card) => (
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
