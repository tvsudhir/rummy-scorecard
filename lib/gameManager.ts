import * as R from 'ramda';
import fs from 'fs';
import path from 'path';
import { Game } from './types';
import { saveGameState, loadGameState } from './storage';

const GAME_DIR = path.join(process.cwd(), 'data');

export const createGame = (name: string, players: string[], maxScore: number): Game => {
  const game: Game = {
    name,
    createdAt: new Date().toISOString(),
    players: R.map(p => ({ name: p, total: 0 }), players),
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

  const updatedPlayers = R.addIndex(R.map)((p, idx) => ({
    ...p,
    total: p.total + roundScores[idx]
  }), game.players);

  const updatedGame: Game = R.pipe(
    R.assoc('players', updatedPlayers),
    R.over(R.lensProp('rounds'), R.append(roundScores)),
    (g: Game) => {
      const losers = R.filter(p => p.total >= g.maxScore, updatedPlayers);
      if (losers.length >= updatedPlayers.length - 1)
        return R.assoc('status', 'finished', g);
      return g;
    }
  )(game);

  saveGameState(name, updatedGame);
  return updatedGame;
};

export const listGames = (): string[] => {
  const files = fs.readdirSync(GAME_DIR);
  return R.pipe(
    R.map((f: string) => f.replace('.json', '')),
    R.sortBy(R.identity),
    R.reverse,
    R.take(5)
  )(files);
};
