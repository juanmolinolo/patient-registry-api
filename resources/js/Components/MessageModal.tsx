import React from 'react';
import Modal from '../Components/Modal';

interface MessageModalProps {
    show: boolean;
    onClose: () => void;
    message: string;
    isSuccess: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({ show, onClose, message, isSuccess }) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                {isSuccess ? (
                    <div className="text-green-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="text-red-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                )}
                <p>{message}</p>
            </div>
        </Modal>
    );
};

export default MessageModal;
