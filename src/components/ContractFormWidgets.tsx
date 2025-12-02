import React, { useState } from 'react';
import { X, Plus, AlertTriangle } from 'lucide-react';
import { discoveryPlatforms, embargoTargets, embargoPeriods } from '../config/contractConstants';

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

interface CustomFieldProps {
  value: any;
  onChange: (field: string, value: any) => void;
}

// --- CUSTOM FIELD COMPONENTS ---
export const ThirdPartyPlatformField: React.FC<CustomFieldProps> = ({ value, onChange }) => {
    // ... (no changes) ...
    const handleTwsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('thirdPartyPlatform_tws', e.target.value);
        if (e.target.value === '不上_TWS') {
            onChange('thirdPartyPlatform_consent', []);
        }
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: option, checked } = e.target;
        const currentConsent = value.thirdPartyPlatform_consent || [];
        const newConsent = checked
            ? [...currentConsent, option]
            : currentConsent.filter((item: string) => item !== option);
        onChange('thirdPartyPlatform_consent', newConsent);
    };

    const isLocked = value.thirdPartyPlatform_tws === '不上_TWS';

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex items-center space-x-4 pt-2">
                {['上_TWS', '不上_TWS'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input type="radio" name="thirdPartyPlatform_tws" value={opt} checked={value.thirdPartyPlatform_tws === opt} onChange={handleTwsChange} className="h-4 w-4 text-indigo-600 border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
            <div className="flex items-center space-x-4 pt-2">
                {['書面通知', '書面同意'].map(opt => (
                    <label key={opt} className={`flex items-center ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <input type="checkbox" value={opt} checked={!isLocked && (value.thirdPartyPlatform_consent || []).includes(opt)} onChange={handleConsentChange} disabled={isLocked} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export const DiscoverySystemField: React.FC<CustomFieldProps> = ({ value, onChange }) => {
    // ... (no changes) ...
    const handleCheckboxChange = (group: string, option: string) => {
        const currentValues = value[group] || [];
        const newValues = currentValues.includes(option)
            ? currentValues.filter((item: string) => item !== option)
            : [...currentValues, option];
        onChange(group, newValues);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['全選', '單選', '各平台皆不上架'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input type="radio" name="discoverySystem_selectionType" value={opt} checked={value.discoverySystem_selectionType === opt} onChange={(e) => onChange('discoverySystem_selectionType', e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>

            {value.discoverySystem_selectionType === '全選' && (
                <div className="pl-6 space-y-3 border-l-2 border-gray-200 ml-2">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">未來平台:</span>
                        {['含將來合作平台', '僅包含現行合作平台'].map(opt => (
                             <label key={opt} className="flex items-center text-sm"><input type="radio" name="discoverySystem_futurePlatforms" value={opt} checked={value.discoverySystem_futurePlatforms === opt} onChange={e => onChange('discoverySystem_futurePlatforms', e.target.value)} className="h-4 w-4" /><span className="ml-1">{opt}</span></label>
                        ))}
                    </div>
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">CN地區:</span>
                        {['含CN', '不含CN'].map(opt => (
                             <label key={opt} className="flex items-center text-sm"><input type="radio" name="discoverySystem_includeCN" value={opt} checked={value.discoverySystem_includeCN === opt} onChange={e => onChange('discoverySystem_includeCN', e.target.value)} className="h-4 w-4" /><span className="ml-1">{opt}</span></label>
                        ))}
                    </div>
                </div>
            )}

            {value.discoverySystem_selectionType === '單選' && (
                <div className="pl-6 grid grid-cols-2 md:grid-cols-3 gap-2 ml-2 border-l-2 border-gray-200">
                    {discoveryPlatforms.map((platform: string) => (
                        <label key={platform} className="flex items-center">
                            <input type="checkbox" checked={(value.discoverySystem_platforms || []).includes(platform)} onChange={() => handleCheckboxChange('discoverySystem_platforms', platform)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-700">{platform}</span>
                        </label>
                    ))}
                </div>
            )}
            {value.discoverySystem_selectionType !== '各平台皆不上架' && (
                <div className="pt-2">
                    {['書面通知', '書面同意'].map(opt => (
                        <label key={opt} className="items-center flex mr-4">
                            <input type="checkbox" checked={(value.discoverySystem_consent || []).includes(opt)} onChange={() => handleCheckboxChange('discoverySystem_consent', opt)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export const NclClauseField: React.FC<CustomFieldProps> = ({ value, onChange }) => {
    // ... (no changes) ...
    const addRule = () => {
        const newRule = { id: `embargo-${Date.now()}`, target: embargoTargets[0], period: embargoPeriods[0] };
        const updatedRules = [...(value.nclClause_embargoRules || []), newRule];
        onChange('nclClause_embargoRules', updatedRules);
    };

    const removeRule = (id: string) => {
        const updatedRules = (value.nclClause_embargoRules || []).filter((rule: { id: string }) => rule.id !== id);
        onChange('nclClause_embargoRules', updatedRules);
    };

    const updateRule = (id: string, field: string, val: string) => {
        const updatedRules = (value.nclClause_embargoRules || []).map((rule: { id: string; target: string; period: string }) =>
            rule.id === id ? { ...rule, [field]: val } : rule
        );
        onChange('nclClause_embargoRules', updatedRules);
    };
    
    const handleDoNotListChange = (option: string) => {
        const currentValues = value.nclClause_doNotList || [];
        const newValues = currentValues.includes(option)
            ? currentValues.filter((item: string) => item !== option)
            : [...currentValues, option];
        onChange('nclClause_doNotList', newValues);
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-6">
                {['不上', 'Embargo'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input type="radio" name="nclClause_selectionType" value={opt} checked={value.nclClause_selectionType === opt} onChange={e => onChange('nclClause_selectionType', e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" />
                        <span className="ml-2 text-sm font-medium text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
             {value.nclClause_selectionType === '不上' && (
                <div className="pl-6 ml-2 border-l-2 border-gray-200 space-y-2">
                     {['第三方平台', '國家圖書館'].map(opt => (
                        <label key={opt} className="flex items-center">
                            <input type="checkbox" checked={(value.nclClause_doNotList || []).includes(opt)} onChange={() => handleDoNotListChange(opt)} className="h-4 w-4" />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
            {value.nclClause_selectionType === 'Embargo' && (
                <div className="pl-6 ml-2 border-l-2 border-gray-200 space-y-3">
                    {(value.nclClause_embargoRules || []).map((rule: { id: string; target: string; period: string }) => (
                        <div key={rule.id} className="flex items-center gap-2">
                            <select value={rule.target} onChange={e => updateRule(rule.id, 'target', e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"><option value="">選擇對象</option>{embargoTargets.map((t: string) => <option key={t} value={t}>{t}</option>)}</select>
                            <select value={rule.period} onChange={e => updateRule(rule.id, 'period', e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"><option value="">選擇時間</option>{embargoPeriods.map((p: string) => <option key={p} value={p}>{p}</option>)}</select>
                            <button type="button" onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addRule} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Plus size={16}/>新增 Embargo 規則</button>
                </div>
            )}
        </div>
    );
};

export const DamagesField: React.FC<CustomFieldProps> = ({ value, onChange }) => {
    // ... (no changes) ...
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange('damages_hasClause', newValue);
        if (newValue === '否') {
            onChange('damages_description', '');
        }
    };

    const isLocked = value.damages_hasClause === '否';

    return (
        <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex items-center space-x-4 pt-2">
                {['是', '否'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input type="radio" name="damages_hasClause" value={opt} checked={value.damages_hasClause === opt} onChange={handleRadioChange} className="h-4 w-4 text-indigo-600 border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
            <input
                type="text"
                value={value.damages_description || ''}
                onChange={(e) => onChange('damages_description', e.target.value)}
                disabled={isLocked}
                className="w-full grow px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={isLocked ? '' : '請說明'}
            />
        </div>
    );
};

// --- New Widgets from TuFuFields ---

export const AddressInput: React.FC<{ 
    postalCode: string; 
    onPostalCodeChange: (val: string) => void; 
    address: string; 
    onAddressChange: (val: string) => void; 
    label: string; 
    isRequired?: boolean; 
    fieldKey?: string;
}> = ({ postalCode, onPostalCodeChange, address, onAddressChange, label, isRequired, fieldKey }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <input
        type="text"
        value={postalCode}
        onChange={(e) => onPostalCodeChange(e.target.value)}
        className="w-full sm:w-24 px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="郵遞區號"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="地址"
      />
    </div>
  </div>
);

export const TuFuTagInput: React.FC<{ 
    tags: string[]; 
    setTags: (tags: string[]) => void; 
    suggestions?: string[]; 
    label: string; 
    fieldKey?: string; 
}> = ({ tags, setTags, suggestions, label, fieldKey }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white">
            {tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700">
                        <X size={14} />
                    </button>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow p-1 outline-none bg-transparent"
                placeholder="輸入後按 Enter 新增..."
            />
        </div>
        {suggestions && suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 mr-2">建議:</span>
                {suggestions.map(suggestion => (
                    <button
                        type="button"
                        key={suggestion}
                        onClick={() => addTag(suggestion)}
                        className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                    >
                        + {suggestion}
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};

export const ValidationWarningPanel: React.FC<{
    isVisible: boolean;
    hardMissing: string[];
    onJumpToField: (fieldTitle: string) => void;
    onClose: () => void;
}> = ({ isVisible, hardMissing, onJumpToField, onClose }) => {
    if (!isVisible || hardMissing.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-xl shadow-2xl z-50 border-t-4 border-red-500 transition-all duration-300">
            <div className="flex items-start p-4 border-b border-gray-200">
                <div className="flex-shrink-0 mr-4 p-2 rounded-full bg-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-red-800">無法儲存，請完成以下必填欄位</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
                <div className="mb-4">
                    <h4 className="text-sm font-bold text-red-700 mb-2">必須填寫</h4>
                    <div className="flex flex-wrap gap-2">
                        {hardMissing.map(item => (
                            <button key={item} onClick={() => onJumpToField(item)} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-md hover:bg-red-200 transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    返回修改
                </button>
            </div>
        </div>
    );
};

export const CheckboxWithText: React.FC<{ 
    label: string; 
    radioValue: string; 
    onRadioChange: (val: string) => void; 
    textValue: string; 
    onTextChange: (val: string) => void; 
    radioOptions?: { value: string; label: string }[]; 
    isRequired?: boolean; 
    fieldKey?: string 
}> = ({ label, radioValue, onRadioChange, textValue, onTextChange, radioOptions = [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }], isRequired, fieldKey }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-4 pt-1">
        {radioOptions.map(opt => (
          <label key={opt.value} className="flex items-center">
            <input
              type="radio"
              name={`${fieldKey}-${label}`}
              value={opt.value}
              checked={radioValue === opt.value}
              onChange={(e) => onRadioChange(e.target.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      <input
        type="text"
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="請填寫備註或條件..."
      />
    </div>
  </div>
);

export const RadioWithOtherInput: React.FC<{ 
    label: string; 
    radioValue: string; 
    onRadioChange: (val: string) => void; 
    textValue: string; 
    onTextChange: (val: string) => void; 
    isRequired?: boolean; 
    fieldKey?: string 
}> = ({ label, radioValue, onRadioChange, textValue, onTextChange, isRequired, fieldKey }) => {
  const handleRadioChange = (value: string) => {
    onRadioChange(value);
    if (value !== 'other') {
      onTextChange('');
    }
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-wrap">
        <div className="flex items-center space-x-4 pt-1">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name={`${fieldKey}-${label}`} value="yes" checked={radioValue === 'yes'} onChange={(e) => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" />
            <span className="ml-2 text-sm text-gray-700">是</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" name={`${fieldKey}-${label}`} value="no" checked={radioValue === 'no'} onChange={(e) => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" />
            <span className="ml-2 text-sm text-gray-700">否</span>
          </label>
        </div>
        <div className="flex items-center pt-1 flex-1 min-w-[250px]">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name={`${fieldKey}-${label}`} value="other" checked={radioValue === 'other'} onChange={(e) => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" />
            <span className="ml-2 text-sm text-gray-700">其他</span>
          </label>
          <input
            type="text"
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            onFocus={() => { if (radioValue !== 'other') handleRadioChange('other') }}
            className="ml-2 w-full flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="請填寫備註或條件..."
          />
        </div>
      </div>
    </div>
  );
};

export const TextInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    placeholder?: string; 
    isRequired?: boolean; 
    fieldKey?: string; 
    type?: string 
}> = ({ label, value, onChange, placeholder = "請輸入...", isRequired, fieldKey, type = "text" }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder={placeholder}
        />
    </div>
);

export const PercentageWithText: React.FC<{ 
    label: string; 
    percentageValue: string; 
    onPercentageChange: (val: string) => void; 
    textValue: string; 
    onTextChange: (val: string) => void; 
    isRequired?: boolean; 
    fieldKey?: string 
}> = ({ label, percentageValue, onPercentageChange, textValue, onTextChange, isRequired, fieldKey }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="relative rounded-md shadow-sm w-full sm:w-32">
        <input
          type="number"
          value={percentageValue}
          onChange={(e) => onPercentageChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-8"
          placeholder="請輸入%"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">%</span>
        </div>
      </div>
      <input
        type="text"
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="請填寫備註或條件..."
      />
    </div>
  </div>
);

export const RadioOnly: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    options?: { value: string; label: string }[]; 
    isRequired?: boolean; 
    fieldKey?: string 
}> = ({ label, value, onChange, options = [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }], isRequired, fieldKey }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
        <div className="flex items-center space-x-4 pt-1">
            {options.map(opt => (
                <label key={opt.value} className="flex items-center">
                    <input
                        type="radio"
                        name={`${fieldKey}-${label}`}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    </div>
);

export const DropdownWithText: React.FC<{ 
    label: string; 
    selectedValue: string; 
    onSelectChange: (val: string) => void; 
    textValue: string; 
    onTextChange: (val: string) => void; 
    options: { value: string; label: string }[]; 
    isRequired?: boolean; 
    fieldKey?: string 
}> = ({ label, selectedValue, onSelectChange, textValue, onTextChange, options = [], isRequired, fieldKey }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <select
        value={selectedValue}
        onChange={(e) => onSelectChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
      >
        <option value="">請選擇</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="請填寫備註或條件..."
      />
    </div>
  </div>
);

export const GroupSeparator: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center col-span-1 md:col-span-2 lg:col-span-3 pt-4 pb-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-sm font-semibold text-gray-600">{title}</span>
        <div className="flex-grow border-t border-gray-200"></div>
    </div>
);