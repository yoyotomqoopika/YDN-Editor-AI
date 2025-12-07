import React, { useState, useEffect } from 'react';
import { EditorHeader } from './components/EditorHeader';
import { ReviewPanel } from './components/ReviewPanel';
import { Sidebar } from './components/Sidebar';
import { HistoryModal } from './components/HistoryModal';
import { checkGrammarWithAhHu, checkFactsWithGuGou } from './services/geminiService';
import { checkStyleRules } from './services/styleChecker';
import { ReviewItem, HistoryItem } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [reviewResults, setReviewResults] = useState<ReviewItem[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<ReviewItem | undefined>(undefined);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ydn-editor-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (text: string, results: ReviewItem[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      text,
      results
    };
    
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('ydn-editor-history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    // Confirmation is now handled in the UI
    setHistory([]);
    localStorage.removeItem('ydn-editor-history');
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setInputText(item.text);
    setReviewResults(item.results);
    setHasChecked(true);
    setSelectedIssue(undefined);
    setIsHistoryOpen(false);
  };

  const handleCheck = async () => {
    if (!inputText.trim()) return;

    setIsChecking(true);
    setHasChecked(false);
    setReviewResults([]);
    setSelectedIssue(undefined);

    try {
      // 1. Run local regex check (Instant)
      const styleErrors = checkStyleRules(inputText);
      
      // 2. Run AI checks in parallel
      const [grammarErrors, factErrors] = await Promise.all([
        checkGrammarWithAhHu(inputText),
        checkFactsWithGuGou(inputText)
      ]);

      // Combine all results
      const allResults = [
        ...styleErrors,
        ...grammarErrors,
        ...factErrors
      ];

      setReviewResults(allResults);
      setHasChecked(true);
      
      // Save to history automatically
      saveToHistory(inputText, allResults);

    } catch (error) {
      console.error("Check process failed:", error);
      alert("檢查過程中發生錯誤，請稍後再試。");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSelectIssue = (item: ReviewItem) => {
    setSelectedIssue(item);
  };

  const handleReset = () => {
    setHasChecked(false);
    setReviewResults([]);
    setSelectedIssue(undefined);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader onOpenHistory={() => setIsHistoryOpen(true)} />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left/Center Content Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto max-w-5xl mx-auto w-full gap-8 scroll-smooth">
          
          {/* Input Section - Only show when not checked or empty */}
          {!hasChecked && (
             <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-gray-700 font-bold mb-4 flex justify-between items-center">
                    <span className="text-xl">輸入稿件</span>
                    <span className="text-sm font-normal text-gray-400">請貼上文字後按下開始檢查</span>
                </label>
                <textarea
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-lg leading-relaxed text-gray-800"
                    placeholder="請在此貼上需要審查的稿件內容..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleCheck}
                        disabled={isChecking || !inputText.trim()}
                        className={`
                            px-8 py-3 rounded-full text-white font-bold text-lg shadow-md flex items-center gap-2
                            ${isChecking || !inputText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all'}
                        `}
                    >
                        {isChecking ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                審查中...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                開始全方位檢查
                            </>
                        )}
                    </button>
                </div>
            </div>
          )}

          {/* Results Section */}
          {hasChecked && (
              <div className="w-full animate-fade-in-up pb-20">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#f3f4f6] z-10 py-2">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        審查結果
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            發現 {reviewResults.length} 個建議
                        </span>
                      </h2>
                      <button 
                        onClick={handleReset}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        返回編輯
                      </button>
                  </div>

                  <ReviewPanel 
                    originalText={inputText}
                    reviewItems={reviewResults}
                    onSelectIssue={handleSelectIssue}
                    selectedIssueId={selectedIssue?.id}
                  />

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                                🐯 阿虎編 (錯別字)
                            </h4>
                            <p className="text-sm text-yellow-700">已掃描一般錯字與標點符號問題。</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                                📰 青報通 (慣用詞)
                            </h4>
                            <p className="text-sm text-blue-700">已比對報社專用詞彙庫。</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-800 mb-2 flex items-center">
                                🔍 菇狗編 (事實查核)
                            </h4>
                            <p className="text-sm text-green-700">已連網查證人名、時間與數據。</p>
                        </div>
                  </div>
              </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className={`
            fixed inset-y-0 right-0 w-80 md:w-96 transform transition-transform duration-300 ease-in-out z-20 border-l border-gray-200 bg-white
            ${selectedIssue ? 'translate-x-0' : 'translate-x-full'}
            md:relative md:translate-x-0 md:flex-shrink-0 md:block
        `}>
            <Sidebar selectedItem={selectedIssue} />
        </div>
        
        {/* Overlay for mobile when sidebar is open */}
        {selectedIssue && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                onClick={() => setSelectedIssue(undefined)}
            ></div>
        )}

      </main>

      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleRestoreHistory}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;