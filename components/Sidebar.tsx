import React from 'react';
import { ReviewItem, EditorType } from '../types';

interface SidebarProps {
  selectedItem?: ReviewItem;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>點擊文章中的標記圓點<br/>查看修改建議</p>
      </div>
    );
  }

  const getHeaderStyle = (type: EditorType) => {
    switch (type) {
      case EditorType.AH_HU: return "bg-yellow-500 text-white";
      case EditorType.QING_BAO: return "bg-blue-600 text-white";
      case EditorType.GU_GOU: return "bg-green-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getAvatar = (type: EditorType) => {
      switch (type) {
        case EditorType.AH_HU: return "🐯";
        case EditorType.QING_BAO: return "📰";
        case EditorType.GU_GOU: return "🔍";
        default: return "🤖";
      }
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-xl transition-all duration-300 ease-in-out">
      <div className={`${getHeaderStyle(selectedItem.type)} p-6 flex-shrink-0`}>
        <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl bg-white/20 p-2 rounded-lg">{getAvatar(selectedItem.type)}</span>
            <div>
                <h3 className="font-bold text-xl">{selectedItem.type}</h3>
                <p className="text-white/80 text-sm">檢查報告</p>
            </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">原文</label>
            <div className="p-3 bg-red-50 text-red-800 rounded-lg font-medium border border-red-100">
                {selectedItem.originalText}
            </div>
        </div>

        <div className="flex justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">建議修正</label>
            <div className="p-3 bg-green-50 text-green-800 rounded-lg font-bold text-lg border border-green-100">
                {selectedItem.suggestion}
            </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">說明與理由</label>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {selectedItem.explanation}
            </p>
        </div>

        {selectedItem.sourceUrl && (
             <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">參考來源</label>
             <a 
                href={selectedItem.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm break-all flex items-center gap-1"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {selectedItem.sourceUrl}
             </a>
         </div>
        )}
      </div>
    </div>
  );
};