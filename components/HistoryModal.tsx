import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  // Reset confirmation state when modal is opened/closed
  useEffect(() => {
    if (!isOpen) setIsConfirming(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">審查歷史紀錄</h2>
            <p className="text-sm text-gray-500 mt-1">紀錄僅存於本機瀏覽器中</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>目前沒有歷史紀錄</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="group border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(item.timestamp).toLocaleString('zh-TW')}
                  </span>
                  <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded-full">
                    {item.results.length} 個建議
                  </span>
                </div>
                <p className="text-gray-700 line-clamp-2 text-sm leading-relaxed">
                  {item.text}
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>載入此份報告</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-xs text-gray-400">
               版本 V1.000 | 開發人：悠遊虎
            </div>
           {history.length > 0 && (
             isConfirming ? (
               <div className="flex gap-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setIsConfirming(false); }}
                   className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
                 >
                   取消
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onClear(); }}
                   className="px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors font-bold shadow-sm"
                 >
                   確定刪除全部
                 </button>
               </div>
             ) : (
               <button 
                  onClick={(e) => { e.stopPropagation(); setIsConfirming(true); }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 px-3 py-2 rounded hover:bg-red-50 transition-colors"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  清除所有紀錄
               </button>
             )
           )}
        </div>
      </div>
    </div>
  );
};