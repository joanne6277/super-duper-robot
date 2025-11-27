import React, { useState, useEffect, useRef } from 'react'; // Added useEffect
import { X, Upload, Save, RefreshCw, Plus, Trash2, Download } from 'lucide-react'; // Added Download
import FloatingTOC from '../components/FloatingTOC';
import { TagInput, CascadingSelect } from '../components/ContractFormWidgets';
// 引入設定檔
import { tocSections, fieldConfig } from '../config/contractConstants';
// 引入型別
import type { ContractData, RoyaltySplit, VolumeRule, DateScheme, RemittanceInfoItem, VolumeIdentifier, FormFieldConfig } from '../types';
// 引入自定義 Hook
import { useContractForm } from '../hooks/useContractForm';

// --- 1. 輔助函式與初始資料 (Helper Functions & Initial Data) ---
// ... (保留原有的 Helper Functions: getInitialRoyaltySplit, getInitialVolumeRule 等) ...
const getInitialRoyaltySplit = (): RoyaltySplit => ({
  id: `rs-${Date.now()}-${Math.random()}`,
  beneficiary: '',
  percentage: '',
});

const getInitialVolumeIdentifier = (): VolumeIdentifier => ({ format: 'volume_issue', volume: '', issue: '', year: '', month: '', description: '' });

const getInitialVolumeRule = (): VolumeRule => ({
    id: `vr-${Date.now()}-${Math.random()}`,
    startVolumeInfo: getInitialVolumeIdentifier(),
    endVolumeInfo: getInitialVolumeIdentifier(),
    royaltySplits: [getInitialRoyaltySplit()],
});

const getInitialDateScheme = (startDate: string = '', endDate: string = ''): DateScheme => ({ 
    id: `ds-${Date.now()}-${Math.random()}`, startDate, endDate, volumeRules: [getInitialVolumeRule()] 
});

const getInitialRemittanceInfoItem = (beneficiary: string): RemittanceInfoItem => ({
  id: `remit-${Date.now()}-${Math.random()}`,
  beneficiary: beneficiary,
  accountType: '國內',
  accountName: '',
  checkTitle: '',
  currency: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  accountNotes: '',
  taxId: '',
  idNumber: '',
  royaltySettlementMonth: '',
  paymentReceiptFlow: '',
});

const getInitialFormData = (): ContractData => {
    return {
        contractTarget: { publicationId: '', type: '', title: '', volumeInfo: '', issnIsbn: '' },
        registrationInfo: { managementNo: '', departmentNo: '', departmentSubNo: '', collector: '', asResponsible: '', isCurrent: '否', contractVersion: [], nonAiritiVersion: '' },
        basicInfo: { partyARep: '', partyBRep: '', contractParty: [], contractStartDate: '', contractEndDate: '', autoRenewYears: '', autoRenewFrequency: '', thereafter: '否', specialDateInfo: '' },
        rightsInfo: { authorizationFormMain: '', authorizationFormSub: '', paymentType: '有償', isOpenAccess: '無' },
        scopeInfo: { thirdPartyPlatform_tws: '上_TWS', thirdPartyPlatform_consent: [], discoverySystem_selectionType: '單選', discoverySystem_futurePlatforms: '含將來合作平台', discoverySystem_includeCN: '含CN', discoverySystem_platforms: [], discoverySystem_consent: [], comparisonSystem: '否', nclClause_selectionType: '不上', nclClause_doNotList: [], nclClause_embargoRules: [], listingLocation: '全球用戶', status_al_cn: '' },
        otherClauses: { usageRightsWarranty: '保證+甲方賠償', userRightsProtection: '否', terminationClause: '否', forceMajeure: '否', confidentiality: '否', noOaOnOwnWebsite: '否', legalIssueHandling: '雙方', manuscriptAgreementMention: '否', authorizationCopy: '否', damages_hasClause: '否', damages_description: '' },
        terminationInfo: { isTerminated: '否', terminationReason: '', terminationDate: '', terminationMethod: '' },
        royaltyInfo: [getInitialDateScheme()],
        remittanceInfo: [],
        remarks: '',
        scanFile: null
    };
};

// Define an interface for FormField props
interface FormFieldProps {
  field: FormFieldConfig;
  path: string;
  value: unknown;
  onChange: (path: string, value: any) => void;
}

// --- 2. FormField 元件 ---
// (此元件仍保留在頁面層級，因為它依賴具體的 UI Component)
const FormField: React.FC<FormFieldProps> = ({ field, path, value, onChange }) => {
  const { id, label, type, options, placeholder, component: CustomComponent } = field;
  const renderLabel = () => <label htmlFor={id.toString()} className={`block text-sm font-medium text-gray-700 ${type !== 'textarea' ? 'mb-2' : ''}`}>{label}</label>;
  
  if (type === 'custom' && CustomComponent) {
      const handleChange = (fieldId: string, fieldValue: any) => {
          const parentPath = path.substring(0, path.lastIndexOf('.'));
          onChange(`${parentPath}.${fieldId}`, fieldValue);
      }
      return (
          <div>
              {renderLabel()}
              <CustomComponent value={value} onChange={handleChange} />
          </div>
      );
  }

  switch (type) {
    case 'text': return <div>{renderLabel()}<input id={id.toString()} type="text" value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder={placeholder} { ...(field.isReadOnly ? { readOnly: true } : {}) } /></div>;
    case 'date': return <div>{renderLabel()}<input id={id.toString()} type="date" value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>;
    case 'radio': return <div>{renderLabel()}<div className="flex items-center space-x-4 pt-2">{(options as string[])?.map((opt: string) => <label key={opt} className="flex items-center"><input type="radio" name={id.toString()} value={opt} checked={value === opt} onChange={(e) => onChange(path, e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /><span className="ml-2 text-sm text-gray-700">{opt}</span></label>)}</div></div>;
    case 'select': return <div>{renderLabel()}<select id={id.toString()} value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="">請選擇</option>{(options as string[])?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}</select></div>;
    case 'textarea': return <div>{renderLabel()}<textarea id={id.toString()} value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder={placeholder}></textarea></div>;
    case 'tags': return <div>{renderLabel()}<TagInput value={value as string[]} onChange={(tags) => onChange(path, tags)} placeholder={placeholder} /></div>;
    case 'cascading-select':
        const cascValue = value as { authorizationFormMain: string, authorizationFormSub: string };
        return (
            <div>
                {renderLabel()}
                <CascadingSelect
                    options={options as { [key: string]: string[] }}
                    value={{ main: cascValue?.authorizationFormMain, sub: cascValue?.authorizationFormSub }}
                    onChange={(field, val) => {
                        const parentPath = path.substring(0, path.lastIndexOf('.'));
                        const fieldKey = field === 'main' ? 'authorizationFormMain' : 'authorizationFormSub';
                        onChange(`${parentPath}.${fieldKey}`, val);
                    }}
                />
            </div>
        );
    case 'group': 
        const groupValue = value as { autoRenewYears: string, autoRenewFrequency: string };
        if (id === 'autoRenew') return ( 
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div className="flex items-center gap-2">
                    <span className="text-gray-700">自動續約</span>
                    <input type="text" placeholder="年" value={(groupValue && groupValue.autoRenewYears) || ''} onChange={e => onChange(`${path.substring(0, path.lastIndexOf('.'))}.autoRenewYears`, e.target.value)} className="w-20 px-2 py-2 border border-gray-300 rounded-lg" />
                    <span className="text-gray-700">年，每</span>
                    <input type="text" placeholder="年" value={(groupValue && groupValue.autoRenewFrequency) || ''} onChange={e => onChange(`${path.substring(0, path.lastIndexOf('.'))}.autoRenewFrequency`, e.target.value)} className="w-20 px-2 py-2 border border-gray-300 rounded-lg" />
                    <span className="text-gray-700">續一次</span>
                </div>
            </div> 
        ); 
        return null;
    default: return null;
  }
};

// --- 3. 主元件 ---
const AcademicContract: React.FC = () => {
    // 使用自定義 Hook
    const { 
        formData, 
        setFormData, 
        message, 
        showMessage, 
        handleDynamicFormChange, 
        getFieldValue, 
        getFileName 
    } = useContractForm<ContractData>(getInitialFormData());

    // --- 狀態管理 (保留頁面特有狀態) ---
    const [contracts] = useState<ContractData[]>(() => {
        const sample = getInitialFormData();
        sample.registrationInfo.managementNo = 'MGT-001';
        sample.contractTarget.title = '範例合約一';
        return [sample];
    });
    const [isRoyaltyModalOpen, setIsRoyaltyModalOpen] = useState(false);
    const [tempRoyaltyInfo, setTempRoyaltyInfo] = useState<DateScheme[]>([]);
    const [importMgmtNo, setImportMgmtNo] = useState('');
    
    const mainContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 日期連動邏輯
    useEffect(() => {
        const { contractStartDate, contractEndDate } = formData.basicInfo;
        const royaltyInfo = formData.royaltyInfo;
        if (contractStartDate && contractEndDate && royaltyInfo && royaltyInfo.length === 1) {
            const firstScheme = royaltyInfo[0];
            const isSchemeEmpty = !firstScheme.startDate && !firstScheme.endDate;
            if (isSchemeEmpty) {
                setFormData(prev => {
                    const newFormData = JSON.parse(JSON.stringify(prev));
                    newFormData.royaltyInfo[0].startDate = contractStartDate;
                    newFormData.royaltyInfo[0].endDate = contractEndDate;
                    return newFormData;
                });
            }
        }
    }, [formData.basicInfo, setFormData, formData.royaltyInfo]); // Added missing dependencies

    // --- 頁面專屬邏輯 (匯入、提交、Modal) ---
    const handleImportData = () => {
        if (!importMgmtNo.trim()) {
            showMessage('請輸入要匯入的舊合約管理部編號。', 'error');
            return;
        }
        const sourceContract = contracts.find(c => c.registrationInfo.managementNo === importMgmtNo.trim());

        if (sourceContract) {
            const importedData = JSON.parse(JSON.stringify(sourceContract));
            
            importedData.basicInfo.contractStartDate = '';
            importedData.basicInfo.contractEndDate = '';
            importedData.registrationInfo.managementNo = ''; 
            importedData.scanFile = null;
            
            setFormData(importedData);
            showMessage('舊合約資料匯入成功！請確認後修改。');
            setImportMgmtNo('');
        } else {
            showMessage('找不到對應的管理部編號，請確認後再試。', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, scanFile: e.target.files![0] }));
        }
    };

    const handleTocJump = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting:', formData);
        showMessage('合約資料已成功儲存！');
    };

    const openRoyaltyModal = () => {
        setTempRoyaltyInfo(JSON.parse(JSON.stringify(formData.royaltyInfo)));
        setIsRoyaltyModalOpen(true);
    };
    const closeRoyaltyModal = () => setIsRoyaltyModalOpen(false);
    const saveRoyaltyChanges = () => {
        setFormData(prev => ({ ...prev, royaltyInfo: tempRoyaltyInfo }));
        closeRoyaltyModal();
    };
    const handleTempRoyaltyChange = (path: string, value: any) => {
         setTempRoyaltyInfo(prev => {
          const keys = path.split('.');
          const newInfo = JSON.parse(JSON.stringify(prev));
          let target = newInfo;
          for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
          target[keys[keys.length - 1]] = value;
          return newInfo;
      });
    };
    const addDateScheme = () => setTempRoyaltyInfo(prev => [...prev, getInitialDateScheme()]);
    const removeDateScheme = (idx: number) => setTempRoyaltyInfo(prev => prev.filter((_, i) => i !== idx));

    const syncBeneficiariesToRemittance = () => {
        const allBeneficiaries = new Set<string>();
        formData.royaltyInfo.forEach(scheme => scheme.volumeRules.forEach(rule => rule.royaltySplits.forEach(split => {
            if (split.beneficiary.trim()) allBeneficiaries.add(split.beneficiary.trim());
        })));
        
        setFormData(prev => {
            const newRemittanceInfo = [...prev.remittanceInfo];
            const existing = new Set(newRemittanceInfo.map(i => i.beneficiary));
            allBeneficiaries.forEach(b => { if (!existing.has(b)) newRemittanceInfo.push(getInitialRemittanceInfoItem(b)); });
            return { ...prev, remittanceInfo: newRemittanceInfo.filter(i => allBeneficiaries.has(i.beneficiary)) };
        });
        showMessage(`已同步 ${allBeneficiaries.size} 筆分潤主體。`);
    };

    const handleRemoveRemittanceItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            remittanceInfo: prev.remittanceInfo.filter(item => item.id !== id)
        }));
        showMessage('匯款資料已移除。');
    };

    // --- JSX Render ---
    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} />
            
            <div ref={mainContentRef} className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">新增合約 (學發部)</h2>
                </div>

                {/* 匯入區塊 */}
                <div className="mb-8 p-6 border border-indigo-200 bg-indigo-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">帶出舊資料</h3>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={importMgmtNo}
                            onChange={(e) => setImportMgmtNo(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="輸入舊合約的管理部編號..."
                        />
                        <button type="button" onClick={handleImportData} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                            <Download size={16} /> 帶出舊資料
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {tocSections.map(section => {
                        const dataKey = section.id.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof ContractData;
                        
                        // 特殊區塊渲染
                        if (section.id === 'royalty-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <button type="button" onClick={openRoyaltyModal} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 border border-indigo-200">編輯權利金規則</button>
                                </div>
                            );
                        }
                        if (section.id === 'remittance-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <button type="button" onClick={syncBeneficiariesToRemittance} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"><RefreshCw size={16} /> 同步分潤主體</button>
                                    <div className="space-y-4">
                                        {formData.remittanceInfo.map((item) => (
                                            <div key={item.id} className="p-4 border rounded bg-gray-50">
                                                <div className="flex justify-between mb-2">
                                                    <div className="font-bold text-indigo-700">{item.beneficiary}</div>
                                                    <button type="button" onClick={() => handleRemoveRemittanceItem(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {fieldConfig['remittance-info'].map((field) => {
                                                        const path = `remittanceInfo.${formData.remittanceInfo.findIndex(f => f.id === item.id)}.${field.id}`;
                                        const value = getFieldValue(formData, path);
                                                        return (
                                                            <div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}>
                                                                <FormField
                                                                    field={field}
                                                                    path={path}
                                                                    value={value}
                                                                    onChange={handleDynamicFormChange}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        if (section.id === 'scan-file') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="flex items-center gap-4">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"><Upload size={16}/> 選擇檔案</button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <span className="text-sm text-gray-600">{getFileName(formData.scanFile)}</span>
                                    </div>
                                </div>
                            );
                        }

                        // 一般欄位渲染
                        const fields = fieldConfig[section.id];
                        if (!fields) return null;

                        return (
                            <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fields.map(field => {
                                        if (field.condition && !field.condition(formData)) return null;
                                        const path = `${dataKey}.${field.id}`;
                                        let value = getFieldValue(formData, path);
                                        // 特殊欄位類型需傳入整個物件
                                        if (['group', 'cascading-select', 'custom'].includes(field.type)) {
                                            value = getFieldValue(formData, dataKey as string);
                                        }
                                        const containerClass = field.fullWidth ? 'lg:col-span-3' : (field.type === 'group' ? 'lg:col-span-2' : '');
                                        
                                        return (
                                            <div key={field.id as string} className={containerClass}>
                                                <FormField field={field} path={path} value={value} onChange={handleDynamicFormChange} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end gap-4 sticky bottom-4 bg-white/90 p-4 border-t backdrop-blur-sm shadow-lg rounded-lg">
                        <button type="button" className="px-6 py-2 border rounded-lg">取消</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"><Save size={18}/> 儲存合約</button>
                    </div>
                </form>
            </div>

            {/* Royalty Modal */}
            {isRoyaltyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">編輯權利金</h3>
                            <button onClick={closeRoyaltyModal}><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {tempRoyaltyInfo.map((scheme, idx) => (
                                <div key={scheme.id} className="border p-4 rounded mb-4">
                                    <h4 className="font-bold mb-2">日期方案 {idx + 1}</h4>
                                    <div className="flex gap-4 mb-2">
                                        <input type="date" value={scheme.startDate} onChange={e => handleTempRoyaltyChange(`${idx}.startDate`, e.target.value)} className="border p-1 rounded" />
                                        <span className="self-center">至</span>
                                        <input type="date" value={scheme.endDate} onChange={e => handleTempRoyaltyChange(`${idx}.endDate`, e.target.value)} className="border p-1 rounded" />
                                        <button onClick={() => removeDateScheme(idx)} className="text-red-500 ml-auto"><Trash2 size={16}/></button>
                                    </div>
                                    <div className="text-sm text-gray-500 italic">（卷期規則設定區塊...）</div>
                                </div>
                            ))}
                            <button onClick={addDateScheme} className="flex items-center gap-1 text-blue-600 font-semibold"><Plus size={16}/> 新增日期方案</button>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={closeRoyaltyModal} className="px-4 py-2 border rounded">取消</button>
                            <button onClick={saveRoyaltyChanges} className="px-4 py-2 bg-indigo-600 text-white rounded">確認修改</button>
                        </div>
                    </div>
                </div>
            )}

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-100 ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AcademicContract;