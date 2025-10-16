import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { player, score, detectedCards } = data;

  if (typeof score !== 'number' || !Array.isArray(detectedCards)) {
    return NextResponse.json(
      { error: 'Invalid score or detectedCards format' },
      { status: 400 }
    );
  }

  return NextResponse.json({ player, score, detectedCards });
}
