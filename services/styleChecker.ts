import { STYLE_GUIDE } from '../constants';
import { ReviewItem, EditorType } from '../types';

export const checkStyleRules = (text: string): ReviewItem[] => {
  const results: ReviewItem[] = [];
  
  // Check the dictionary rules
  for (const [incorrect, correct] of Object.entries(STYLE_GUIDE.rules)) {
    // Escape special regex characters in the incorrect word
    const escapedIncorrect = incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedIncorrect, 'g');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      results.push({
        id: `style-${match.index}-${Date.now()}`,
        type: EditorType.QING_BAO,
        originalText: match[0],
        suggestion: correct,
        explanation: `依據青年日報社慣用詞彙：請將「${match[0]}」替換為「${correct}」`,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  }

  return results;
};