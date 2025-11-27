import React, { useState } from 'react';
import { X } from 'lucide-react';

// --- TagInput ---
export const TagInput: React.FC<{ value: string[]; onChange: (value: string[]) => void; placeholder?: string; }> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const tags = value || [];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { 
      if (e.key === 'Enter' || e.key === ',') { 
          e.preventDefault(); 
          const newTag = inputValue.trim(); 
          if (newTag && !tags.includes(newTag)) { onChange([...tags, newTag]); } 
          setInputValue(''); 
      } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) { 
          onChange(tags.slice(0, -1)); 
      } 
  };
  
  const removeTag = (indexToRemove: number) => { onChange(tags.filter((_, index) => index !== indexToRemove)); };
  
  return ( 
      <div className="w-full flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
          <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholder || "新增標籤後按 Enter..."} className="grow bg-transparent focus:outline-none p-1 text-sm"/>
          {tags.map((tag, index) => ( 
              <div key={index} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-semibold px-2 py-1 rounded">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className="text-indigo-500 hover:text-indigo-800">
                      <X size={14} />
                  </button>
              </div> 
          ))}
      </div> 
  );
};

// --- CascadingSelect ---
export const CascadingSelect: React.FC<{ options: { [key: string]: string[] }; value: { main: string; sub: string }; onChange: (field: 'main' | 'sub', value: string) => void; }> = ({ options, value, onChange }) => {
    const mainOptions = Object.keys(options);
    const subOptions = value?.main ? options[value.main] || [] : [];
    
    const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange('main', e.target.value);
        onChange('sub', ''); 
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <select value={value?.main || ''} onChange={handleMainChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">請選擇主類別</option>
                {mainOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={value?.sub || ''} onChange={(e) => onChange('sub', e.target.value)} disabled={!value?.main || subOptions.length === 0} className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100">
                <option value="">請選擇子類別</option>
                {subOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
};