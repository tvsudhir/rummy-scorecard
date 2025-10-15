import fs from 'fs';
import path from 'path';
import { Game } from './types';

const GAME_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(GAME_DIR)) fs.mkdirSync(GAME_DIR, { recursive: true });

export const saveGameState = (name: string, data: Game): void => {
  const filePath = path.join(GAME_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const loadGameState = (name: string): Game | null => {
  const filePath = path.join(GAME_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Game;
};
