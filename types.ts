export enum EditorType {
  AH_HU = 'Ah Hu',       // Grammar/Typo
  QING_BAO = 'Qing Bao', // Style Guide
  GU_GOU = 'Gu Gou'      // Fact Check
}

export interface ReviewItem {
  id: string;
  type: EditorType;
  originalText: string;
  suggestion: string;
  explanation: string;
  startIndex?: number; // Optional because finding exact index from LLM can be fuzzy
  endIndex?: number;
  sourceUrl?: string; // For Gu Gou
}

export interface StyleRule {
  key: string;
  value: string;
}

export interface StyleGuideData {
  instruction: string;
  rules: Record<string, string>;
  special_logic: Record<string, string>;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  results: ReviewItem[];
}