import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { calculateScore } from '@/lib/scoring';

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('image') as File;
  const player = data.get('player') as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, file.name);
  fs.writeFileSync(filePath, buffer);

  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  const score = calculateScore(text);

  return NextResponse.json({ player, score, raw: text });
}
