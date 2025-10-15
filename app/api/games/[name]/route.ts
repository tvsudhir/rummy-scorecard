import { NextResponse } from 'next/server';
import { recordRound } from '@/lib/gameManager';
import { loadGameState } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const game = loadGameState(params.name);
  return NextResponse.json(game);
}

export async function PUT(request: Request, { params }: { params: { name: string } }) {
  const { roundScores } = await request.json();
  const updated = recordRound(params.name, roundScores);
  return NextResponse.json(updated);
}
