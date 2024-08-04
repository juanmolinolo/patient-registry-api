import React from 'react';

interface PhoneNumberInputProps {
    countryCode: string;
    phoneNumber: string;
    onCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: boolean;
}

const countryCodes = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+91', name: 'IN' },
    { code: '+598', name: 'UY' },
    // Add more country codes as needed
];

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    countryCode,
    phoneNumber,
    onCountryCodeChange,
    onPhoneNumberChange,
    hasError
}) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="countryCode">
                Phone number
            </label>
            <div className="flex space-x-2">
                <select
                    className={`shadow appearance-none border rounded w-4/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        hasError ? 'border-red-500 bg-red-100' : ''
                    }`}
                    id="countryCode"
                    value={countryCode}
                    onChange={onCountryCodeChange}
                >
                    <option value="">Code</option>
                    {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name} ({country.code})
                        </option>
                    ))}
                </select>
                <input
                    className={`shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        hasError ? 'border-red-500 bg-red-100' : ''
                    }`}
                    id="phone"
                    type="text"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={onPhoneNumberChange}
                />
            </div>
        </div>
    );
};

export default PhoneNumberInput;
