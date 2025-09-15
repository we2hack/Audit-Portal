export interface AuditFinding {
  id: number;
  category: string;
  question: string;
  issueFindingDate: Date;
  issueClosedDate: Date | null;
  reopenDate: Date | null;
  responsiblePerson: string;
  status: 'Open' | 'Closed - Timely' | 'Closed - Late' | 'Re-Opened';
  points: number;
  daysToClose: number | null;
  reopenCount: number;
}

export interface TeamLeaderboardEntry {
  teamName: string;
  totalPoints: number;
  timelyClosed: number;
  lateClosed: number;
  reOpened: number;
  stillOpen: number;
}

export enum AppView {
  Dashboard = 'Dashboard',
  Findings = 'Findings',
  Leaderboard = 'Leaderboard',
}

// Add XLSX and Recharts to the window object for TypeScript
declare global {
  interface Window {
    XLSX: any;
    Recharts: any;
  }
}
