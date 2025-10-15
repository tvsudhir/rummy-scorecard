export interface Player {
  name: string;
  total: number;
}

export type Round = number[];

export interface Game {
  name: string;
  createdAt: string;
  players: Player[];
  rounds: Round[];
  maxScore: number;
  status: 'in-progress' | 'finished';
}
