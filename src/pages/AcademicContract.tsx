import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { X, Plus, Upload, Download, Trash2, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import FloatingTOC from '../components/FloatingTOC';
import { TagInput, CascadingSelect } from '../components/ContractFormWidgets';
import { tocSections, authorizationFormOptions, discoveryPlatforms, embargoTargets, embargoPeriods } from '../config/contractConstants';
import type { ContractData, RoyaltySplit, VolumeRule, DateScheme, RemittanceInfoItem, VolumeIdentifier } from '../types';

// --- Helper Functions & Initial Data ---
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
    // 這裡只列出部分初始化，實際應完整初始化所有欄位以避免 undefined 錯誤
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

// --- Components for specific fields (Locally defined for convenience) ---

// 1. ThirdPartyPlatformField
const ThirdPartyPlatformField: React.FC<{ value: any; onChange: (field: string, val: any) => void }> = ({ value, onChange }) => {
    const handleTwsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('thirdPartyPlatform_tws', e.target.value);
        if (e.target.value === '不上_TWS') onChange('thirdPartyPlatform_consent', []);
    };
    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: option, checked } = e.target;
        const current = value.thirdPartyPlatform_consent || [];
        onChange('thirdPartyPlatform_consent', checked ? [...current, option] : current.filter((x: string) => x !== option));
    };
    const isLocked = value.thirdPartyPlatform_tws === '不上_TWS';
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex items-center space-x-4 pt-2">
                {['上_TWS', '不上_TWS'].map(opt => (
                    <label key={opt} className="flex items-center"><input type="radio" name="thirdPartyPlatform_tws" value={opt} checked={value.thirdPartyPlatform_tws === opt} onChange={handleTwsChange} className="h-4 w-4 text-indigo-600" /><span className="ml-2 text-sm">{opt}</span></label>
                ))}
            </div>
            <div className="flex items-center space-x-4 pt-2">
                {['書面通知', '書面同意'].map(opt => (
                    <label key={opt} className={`flex items-center ${isLocked ? 'opacity-50' : ''}`}><input type="checkbox" value={opt} checked={!isLocked && (value.thirdPartyPlatform_consent || []).includes(opt)} onChange={handleConsentChange} disabled={isLocked} className="h-4 w-4 text-indigo-600" /><span className="ml-2 text-sm">{opt}</span></label>
                ))}
            </div>
        </div>
    );
};

// (其他特定欄位元件 DiscoverySystemField, NclClauseField, DamagesField 可以類似方式在此定義或移出，為節省篇幅此處省略細節實作，請參照原 .jsx 檔案並加上型別)

// --- Main Page Component ---

const AcademicContract: React.FC = () => {
    const [formData, setFormData] = useState<ContractData>(getInitialFormData());
    const [isRoyaltyModalOpen, setIsRoyaltyModalOpen] = useState(false);
    const [tempRoyaltyInfo, setTempRoyaltyInfo] = useState<DateScheme[]>([]);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generic Change Handler
    const handleDynamicFormChange = (path: string, value: any) => {
        setFormData(prev => {
            const newFormData = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let current = newFormData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newFormData;
        });
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
        alert('儲存成功 (模擬)');
    };

    // --- Royalty Modal Helpers ---
    const openRoyaltyModal = () => {
        setTempRoyaltyInfo(JSON.parse(JSON.stringify(formData.royaltyInfo)));
        setIsRoyaltyModalOpen(true);
    };
    const closeRoyaltyModal = () => setIsRoyaltyModalOpen(false);
    const saveRoyaltyChanges = () => {
        setFormData(prev => ({ ...prev, royaltyInfo: tempRoyaltyInfo }));
        closeRoyaltyModal();
    };

    // --- Remittance Helpers ---
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
        alert(`已同步 ${allBeneficiaries.size} 筆分潤主體。`);
    };

    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} />
            
            <div ref={mainContentRef} className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">新增合約 (學發部)</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    
                    {/* 範例區塊：合約標的 */}
                    <div id="contract-target" className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">合約標的</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">刊名</label>
                                <input type="text" value={formData.contractTarget.title} onChange={e => handleDynamicFormChange('contractTarget.title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Publication ID</label>
                                <input type="text" value={formData.contractTarget.publicationId} onChange={e => handleDynamicFormChange('contractTarget.publicationId', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            {/* 更多欄位... */}
                        </div>
                    </div>

                    {/* 範例區塊：基本資料 (使用 TagInput) */}
                    <div id="basic-info" className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">基本資料</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">簽約單位</label>
                                <TagInput value={formData.basicInfo.contractParty} onChange={tags => handleDynamicFormChange('basicInfo.contractParty', tags)} />
                            </div>
                            {/* 更多欄位... */}
                        </div>
                    </div>

                    {/* 範例區塊：權利金 (Modal Trigger) */}
                    <div id="royalty-info" className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">權利金比例</h3>
                        <button type="button" onClick={openRoyaltyModal} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 border border-indigo-200">
                            編輯權利金規則
                        </button>
                    </div>

                    {/* 範例區塊：匯款資料 (Sync Button) */}
                    <div id="remittance-info" className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">匯款資料</h3>
                        <button type="button" onClick={syncBeneficiariesToRemittance} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                            <RefreshCw size={16} /> 同步分潤主體
                        </button>
                        <div className="space-y-4">
                            {formData.remittanceInfo.map((item, idx) => (
                                <div key={item.id} className="p-4 border rounded bg-gray-50">
                                    <div className="font-bold text-indigo-700 mb-2">{item.beneficiary}</div>
                                    {/* Render fields... */}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 sticky bottom-4 bg-white/90 p-4 border-t backdrop-blur-sm shadow-lg rounded-lg">
                        <button type="button" className="px-6 py-2 border rounded-lg">取消</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"><Save size={18}/> 儲存合約</button>
                    </div>
                </form>
            </div>

            {/* Royalty Modal Implementation */}
            {isRoyaltyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">編輯權利金</h3>
                            <button onClick={closeRoyaltyModal}><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Render deep nested royalty fields here using tempRoyaltyInfo */}
                            <p>這裡顯示複雜的權利金編輯表單...</p>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={closeRoyaltyModal} className="px-4 py-2 border rounded">取消</button>
                            <button onClick={saveRoyaltyChanges} className="px-4 py-2 bg-indigo-600 text-white rounded">確認修改</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicContract;