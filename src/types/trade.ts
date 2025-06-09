
export interface Trade {
  id: string;
  amount: number;
  date: string;
  time: string;
  note?: string;
  type: 'profit' | 'loss';
  createdAt: string;
}

export interface DailyPnL {
  date: string;
  totalPnL: number;
  trades: Trade[];
}
