import React, { useState, useEffect } from 'react';
import type { ContractData } from '../types';

interface CreateContractProps {
  existingContract?: ContractData | null; // 如果是編輯模式，會有舊資料
  onSave: (data: ContractData) => void;   // 儲存的功能
  onCancel: () => void;                   // 取消的功能
}

const CreateContract: React.FC<CreateContractProps> = ({ existingContract, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ContractData>>(
    existingContract || {
      // a default structure
    }
  );

  useEffect(() => {
    if (existingContract) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(existingContract);
    }
  }, [existingContract]);
  
  const handleSubmit = () => {
      // ... 驗證邏輯
      // 驗證通過後：
      const finalData = { ...formData } as ContractData; // 假裝這是整理好的資料
      onSave(finalData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
       {/* ... 這裡貼上您原本新增模組的 JSX */}
       <h2>{existingContract ? '維護合約' : '新增合約'}</h2>
       
       <button onClick={handleSubmit}>儲存</button>
       <button onClick={onCancel}>取消</button>
    </div>
  );
};

export default CreateContract;