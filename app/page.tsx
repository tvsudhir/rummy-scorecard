'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [games, setGames] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [players, setPlayers] = useState('');
  const [maxScore, setMaxScore] = useState(80);

  useEffect(() => {
    fetch('/api/games').then(r => r.json()).then(setGames);
  }, []);

  const createGame = async () => {
    const body = { name, players: players.split(',').map(p => p.trim()), maxScore: Number(maxScore) };
    await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    window.location.href = `/game/${name}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Indian Rummy Tracker</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Create a New Game</h2>
        <input className="border p-2 mr-2" placeholder="Game Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Players (comma separated)" value={players} onChange={e => setPlayers(e.target.value)} />
        <input className="border p-2 w-24 mr-2" type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={createGame}>Start Game</button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Recent Games</h2>
      <ul className="list-disc pl-6">
        {games.map(g => (
          <li key={g}><Link href={`/game/${g}`} className="text-blue-600">{g}</Link></li>
        ))}
      </ul>
    </div>
  );
}
