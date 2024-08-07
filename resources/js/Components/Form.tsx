import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import InputField from './InputField';
import PhoneNumberInput from './PhoneNumberInput';
import MessageModal from './MessageModal';

interface FormProps {
    formData: {
        name: string;
        email: string;
        address: string;
        phone: string;
        countryCode: string;
        password: string;
        image: File | null;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isFormLoading: boolean;
}

const Form: React.FC<FormProps> = ({ formData, handleInputChange, handleSubmit, isFormLoading }) => {
    const [validationErrors, setValidationErrors] = useState({
        name: false,
        email: false,
        address: false,
        phone: false,
        countryCode: false,
        password: false,
        image: false,
    });

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessages, setModalMessages] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^[0-9]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const validateInputs = () => {
        const errors = {
            name: !formData.name || !nameRegex.test(formData.name),
            email: !formData.email || !emailRegex.test(formData.email),
            address: !formData.address,
            phone: !formData.phone || !phoneRegex.test(formData.phone),
            countryCode: !formData.countryCode,
            password: !formData.password || !passwordRegex.test(formData.password),
            image: !formData.image,
        };
        setValidationErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateInputs()) {
            handleSubmit(e);
        }
    };

    const handleInputChangeWithErrorReset = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;

        if (files && id === 'image') {
            const file = files[0];
            const allowedExtensions = /(\.jpg|\.jpeg)$/i;
            if (!allowedExtensions.exec(file.name)) {
                setModalMessages(['Please upload .jpg file type only.']);
                setIsSuccess(false);
                setShowMessageModal(true);
                (e.target as HTMLInputElement).value = '';
                setValidationErrors({ ...validationErrors, [id]: true });
                return;
            } else {
                setValidationErrors({ ...validationErrors, [id]: false });
            }
            handleInputChange(e);
        } else {
            setValidationErrors({
                ...validationErrors,
                [id]: !value ||
                    (id === 'name' && !nameRegex.test(value)) ||
                    (id === 'email' && !emailRegex.test(value)) ||
                    (id === 'phone' && !phoneRegex.test(value)) ||
                    (id === 'countryCode' && !value) ||
                    (id === 'password' && !passwordRegex.test(value))
            });

            handleInputChange(e);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-6 shadow-lg rounded-lg flex flex-col justify-between h-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Add a new patient</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
                <div className="flex-grow">
                    <InputField
                        id="name"
                        label="Name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChangeWithErrorReset}
                        hasError={validationErrors.name}
                        tooltip="Name should not contain numbers."
                    />
                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChangeWithErrorReset}
                        hasError={validationErrors.email}
                        tooltip="Email should be a Gmail address (example@gmail.com)."
                    />
                    <InputField
                        id="address"
                        label="Address"
                        type="text"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleInputChangeWithErrorReset}
                        hasError={validationErrors.address}
                    />
                    <PhoneNumberInput
                        countryCode={formData.countryCode}
                        phoneNumber={formData.phone}
                        onCountryCodeChange={handleInputChangeWithErrorReset}
                        onPhoneNumberChange={(e) => handleInputChange(e)}
                        hasError={validationErrors.phone || validationErrors.countryCode}
                    />
                    <InputField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChangeWithErrorReset}
                        hasError={validationErrors.password}
                        tooltip="Password must be at least 8 characters long, include letters, numbers, and a symbol."
                    />
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="image">
                            I.D. image
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                validationErrors.image ? 'border-red-500 bg-red-100' : ''
                            }`}
                            id="image"
                            type="file"
                            accept=".jpg"
                            onChange={handleInputChangeWithErrorReset}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4 w-full">
                    <button
                        className="bg-[#7345fc] hover:bg-[#9572fd] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                        type="submit"
                        disabled={isFormLoading}
                    >
                        Submit
                    </button>
                    {isFormLoading && <div className="ml-4"><LoadingSpinner /></div>}
                </div>
            </form>
            {/* Message modal */}
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                messages={modalMessages}
                isSuccess={isSuccess}
            />
        </div>
    );
};

export default Form;
