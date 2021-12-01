export interface Performance {
  playID: string;
  audience: number;
}

export interface Invoice<T> {
  customer: string;
  performances: T[];
}
export interface Play {
  name: string;
  type: string;
}

export interface Plays {
  [key: string]: Play;
}

export interface PerformancePlay extends Performance {
  play: Play;
  amount: number;
  volumeCredits: number;
}
