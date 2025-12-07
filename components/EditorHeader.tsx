import React from 'react';

interface EditorHeaderProps {
  onOpenHistory: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ onOpenHistory }) => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="bg-red-600 p-2 rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider leading-none">青年日報社</h1>
            <p className="text-blue-200 text-sm">智慧稿件審查系統</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="hidden lg:flex space-x-6 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>阿虎編 (錯字)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span>青報通 (慣用詞)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>菇狗編 (查核)</span>
          </div>
        </div>

        {/* Controls & Meta Info */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
           <div className="text-right hidden md:block">
              <div className="text-xs text-blue-300 font-mono">V1.000</div>
              <div className="text-xs text-blue-300">開發人：悠遊虎</div>
           </div>

           <button 
             onClick={onOpenHistory}
             className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors border border-blue-700"
           >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>歷史紀錄</span>
           </button>
        </div>
      </div>
    </header>
  );
};