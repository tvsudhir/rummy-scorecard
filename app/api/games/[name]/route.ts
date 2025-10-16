import { NextResponse } from 'next/server';
import { recordRound } from '@/lib/gameManager';
import { loadGameState } from '@/lib/storage';

import fs from 'fs';
import path from 'path';

export async function GET(_: Request, { params }: { params: { name: string } }) {
  try {
    const game = loadGameState(params.name);
    if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    return NextResponse.json(game);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { name: string } }) {
  try {
    const { roundScores } = await request.json();
    const updated = recordRound(params.name, roundScores);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { name: string } }) {
  const trimmedName = params.name.trim();
  const filePath = path.join(process.cwd(), 'data', `${trimmedName}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 });
  }
}
