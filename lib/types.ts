export interface Player {
  name: string;
  total: number;
}

export interface Round {
  scores: { [playerName: string]: number };
  cards?: { [playerName: string]: { cards: string[]; scores: number[] } };
}

export interface Game {
  name: string;
  createdAt: string;
  players: Player[];
  rounds: Round[];
  maxScore: number;
  status: 'in-progress' | 'finished';
}
