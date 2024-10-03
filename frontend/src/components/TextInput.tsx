import React, { ChangeEvent } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, onSubmit }) => {
  return (
    <div>
      <label>
        {label}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </label>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default TextInput;