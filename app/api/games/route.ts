import { NextResponse } from 'next/server';
import { createGame, listGames } from '@/lib/gameManager';

export async function GET() {
  const games = listGames();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  const { name, players, maxScore } = await request.json();
  const game = createGame(name, players, maxScore);
  return NextResponse.json(game);
}
