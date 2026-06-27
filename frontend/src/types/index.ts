export interface Participant {
  id: string;
  username: string;
  role: 'interviewer' | 'candidate';
  color: string;
}

export interface Comment {
  id: string;
  authorName: string;
  lineNumber: number;
  text: string;
  color: string;
  createdAt: string;
}

export interface RemoteCursor {
  socketId: string;
  username: string;
  color: string;
  lineNumber: number;
  column: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  username: string;
  role: 'interviewer' | 'candidate';
  timestamp: string;
}

export interface RoomState {
  code: string;
  language: string;
  timerSeconds: number;
  timerStatus: 'running' | 'paused' | 'stopped';
  timerStartedAt?: number;
  participants: Participant[];
  comments: Comment[];
}
