import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Form from '../Components/Form';
import PatientView from '../Components/PatientView';
import MessageModal from '../Components/MessageModal';
import PatientModal from '../Components/PatientModal';

type Card = {
    id: number;
    name: string;
    image: string;
    email: string;
    address: string;
    phone_number: string;
};

export default function Main() {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cards, setCards] = useState<Card[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        countryCode: '',
        password: '',
        image: null
    });
    const [modalMessages, setModalMessages] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        if (files) {
            setFormData({ ...formData, [id]: files[0] });
        } else {
            if (id === "phoneNumber") {
                setFormData({ ...formData, phone: value });
            } else {
                setFormData({ ...formData, [id]: value });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsFormLoading(true);
    
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('address', formData.address);
        formDataToSubmit.append('phone_number', formData.countryCode + formData.phone);
        formDataToSubmit.append('password', formData.password);
        if (formData.image) {
            formDataToSubmit.append('image', formData.image);
        }
    
        try {
            const response = await fetch('http://localhost/api/patients', {
                method: 'POST',
                body: formDataToSubmit
            });
    
            const result = await response.json();
    
            if (response.ok) {
                const newPatient = {
                    id: result.patient.id,
                    name: result.patient.name,
                    email: result.patient.email,
                    address: result.patient.address,
                    phone_number: result.patient.phone_number,
                    image: result.patient.image_route
                };
    
                const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
                storedPatients.push(newPatient);
                localStorage.setItem('patients', JSON.stringify(storedPatients));
    
                setModalMessages(['Patient added successfully!']);
                setIsSuccess(true);
                fetchData();
            } else {
                let errorMessages: string[] = ['Error adding patient.'];
                if (result.errors) {
                    const errorDetails = Object.entries(result.errors as { [key: string]: string[] })
                        .flatMap(([field, messages]) => messages.map(msg => `${capitalizeFirstLetter(field)}: ${msg}`));
                    errorMessages = [...errorMessages, ...errorDetails];
                } else {
                    errorMessages.push(result.message || 'Please try again.');
                }
                setModalMessages(errorMessages);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalMessages(['Error adding patient. Please try again.']);
            setIsSuccess(false);
        } finally {
            setIsFormLoading(false);
        }
    
        setShowMessageModal(true);
    };
    
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    
    const cardsPerPage = 4;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        setShowPatientModal(true);
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
                <div className="w-full max-w-7xl flex space-x-3">
                    {/* Left card with form */}
                    <Form formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isFormLoading={isFormLoading} />

                    {/* Right card with patient cards */}
                    <PatientView
                        cards={currentCards}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handleCardClick={handleCardClick}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Message modal */}
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                messages={modalMessages}
                isSuccess={isSuccess}
            />

            {/* Patient modal */}
            <PatientModal
                show={showPatientModal}
                onClose={() => setShowPatientModal(false)}
                selectedCard={selectedCard}
            />
        </>
    );
}
