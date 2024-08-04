import React from 'react';

interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: boolean;
    tooltip?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, value, onChange, hasError, tooltip }) => {
    return (
        <div className="mb-4 relative">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={id}>
                {label}
                {tooltip && (
                    <span className="ml-2 relative group">
                        <span className="text-blue-500 cursor-pointer">i</span>
                        <div className="absolute left-0 top-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 transform -translate-y-full -translate-x-1/2 mb-1">
                            {tooltip}
                        </div>
                    </span>
                )}
            </label>
            <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    hasError ? 'border-red-500 bg-red-100' : ''
                }`}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
            />
        </div>
    );
};

export default InputField;