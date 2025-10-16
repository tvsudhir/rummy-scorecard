import fs from 'fs';
import path from 'path';
import { Game } from './types';
import { saveGameState, loadGameState } from './storage';

const GAME_DIR = path.join(process.cwd(), 'data');

export const createGame = (name: string, players: string[], maxScore: number): Game => {
  const game: Game = {
    name,
    createdAt: new Date().toISOString(),
    players: players.map(p => ({ name: p, total: 0 })),
    rounds: [],
    maxScore,
    status: 'in-progress'
  };
  saveGameState(name, game);
  return game;
};

export const recordRound = (name: string, roundScores: number[]): Game => {
  const game = loadGameState(name);
  if (!game) throw new Error('Game not found');

  const updatedPlayers = game.players.map((p, idx) => ({
    ...p,
    total: p.total + (roundScores[idx] ?? 0)
  }));
  // build updated game using native operations to preserve typing
  const updatedRounds = [...game.rounds, roundScores];
  const losers = updatedPlayers.filter(p => p.total >= game.maxScore);

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

export const listGames = (): string[] => {
  const files = fs.readdirSync(GAME_DIR);
  return files
    .map((f: string) => f.replace('.json', ''))
    .sort()
    .reverse()
    .slice(0, 5);
};
