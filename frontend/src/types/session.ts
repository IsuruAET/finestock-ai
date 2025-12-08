export interface Question {
  _id: string;
  session: string;
  question: string;
  answer: string;
  notes?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Session {
  _id: string;
  role: string;
  topicsToFocus: string;
  experience: string;
  questions?: number | string | Question[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionQuestion {
  question: string;
  answer: string;
  notes?: string;
}

export interface CreateSessionData {
  role: string;
  topicsToFocus: string;
  experience: string;
  description: string;
  questions?: CreateSessionQuestion[];
}

export interface CreateSessionResponse {
  success: boolean;
  session: Session;
}

