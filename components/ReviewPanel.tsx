import React from 'react';
import { ReviewItem, EditorType } from '../types';

interface ReviewPanelProps {
  originalText: string;
  reviewItems: ReviewItem[];
  onSelectIssue: (item: ReviewItem) => void;
  selectedIssueId?: string;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ 
  originalText, 
  reviewItems, 
  onSelectIssue,
  selectedIssueId
}) => {
  // We need to split the text into segments based on the review items.
  // This is a simplified approach: we assume non-overlapping items for this demo,
  // or simple overlaps. A robust highlighter needs an interval tree.
  // For this MVP, we sort items by startIndex.
  
  const sortedItems = [...reviewItems].sort((a, b) => (a.startIndex || 0) - (b.startIndex || 0));
  
  const renderText = () => {
    if (sortedItems.length === 0) return <p className="whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">{originalText}</p>;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedItems.forEach((item, index) => {
      // Safety check for indices
      if (item.startIndex === undefined || item.endIndex === undefined) return;
      if (item.startIndex < lastIndex) return; // Skip overlapping for simplicity in MVP

      // Text before the error
      if (item.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {originalText.slice(lastIndex, item.startIndex)}
          </span>
        );
      }

      // The error text itself
      let colorClass = "";
      let dotColor = "";
      
      switch (item.type) {
        case EditorType.AH_HU:
          colorClass = "bg-yellow-100 decoration-yellow-500";
          dotColor = "bg-yellow-500";
          break;
        case EditorType.QING_BAO:
          colorClass = "bg-blue-100 decoration-blue-500";
          dotColor = "bg-blue-500";
          break;
        case EditorType.GU_GOU:
          colorClass = "bg-green-100 decoration-green-500";
          dotColor = "bg-green-500";
          break;
      }

      const isSelected = selectedIssueId === item.id;

      elements.push(
        <span 
          key={item.id}
          onClick={() => onSelectIssue(item)}
          className={`relative inline-block cursor-pointer underline decoration-wavy underline-offset-4 decoration-2 ${colorClass} ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400 rounded' : ''} px-1 transition-all`}
        >
          {originalText.slice(item.startIndex, item.endIndex)}
          <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${dotColor} border border-white`}></span>
        </span>
      );

      lastIndex = item.endIndex;
    });

    // Remaining text
    if (lastIndex < originalText.length) {
      elements.push(
        <span key={`text-end`}>
          {originalText.slice(lastIndex)}
        </span>
      );
    }

    return <p className="whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">{elements}</p>;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
       {renderText()}
    </div>
  );
};