import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  name?: string;
  id?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
  disabled = false,
  name,
  id
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      name={name}
      id={id}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    />
  );
};

export default Textarea; 