import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
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
