import fs from 'fs';
import path from 'path';
import { Game } from './types';
import { saveGameState, loadGameState } from './storage';

const GAME_DIR = path.join(process.cwd(), 'data');

export const createGame = (name: string, players: string[], maxScore: number): Game => {
  const trimmedName = name.trim();
  const trimmedPlayers = players.map(p => p.trim());
  const game: Game = {
    name: trimmedName,
    createdAt: new Date().toISOString(),
    players: trimmedPlayers.map(p => ({ name: p, total: 0 })),
    rounds: [],
    maxScore,
    status: 'in-progress'
  };
  saveGameState(trimmedName, game);
  return game;
};

export const recordRound = (
  name: string,
  roundIndex: number | null,
  scores: { [playerName: string]: number },
  cards?: { [playerName: string]: { cards: string[]; scores: number[] } }
): Game => {
  const game = loadGameState(name);
  if (!game) throw new Error('Game not found');

  let updatedRounds = [...game.rounds];
  if (typeof roundIndex === 'number' && roundIndex >= 0 && roundIndex < game.rounds.length) {
    // Update existing round
    updatedRounds[roundIndex] = { scores, ...(cards && { cards }) };
  } else {
    // Add new round
    updatedRounds.push({ scores, ...(cards && { cards }) });
  }

  const updatedPlayers = game.players.map(player => ({
    ...player,
    total: updatedRounds.reduce((sum, round) => sum + (round.scores[player.name] || 0), 0)
  }));

  const losers = updatedPlayers.filter(p => p.total >= (game.maxScore || Infinity));

  let updatedGame: Game = {
    ...game,
    players: updatedPlayers,
    rounds: updatedRounds,
  };

  if (losers.length >= updatedPlayers.length - 1) {
    updatedGame = { ...updatedGame, status: 'finished' };
  }

  saveGameState(name, updatedGame);
  return updatedGame;
};

export type GameSummary = { name: string; status: 'in-progress' | 'finished'; players: { name: string; total: number }[] };

export const listGames = (): GameSummary[] => {
  const files = fs.readdirSync(GAME_DIR);
  const summaries: GameSummary[] = files
    .map((f: string) => {
      try {
        const game = loadGameState(f.replace('.json', ''));
        if (!game) return null;
        return { name: game.name, status: game.status, players: game.players } as GameSummary;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as GameSummary[];

  // latest first by filename (simple heuristic)
  return summaries.sort((a, b) => (a.name < b.name ? 1 : -1)).slice(0, 5);
};
