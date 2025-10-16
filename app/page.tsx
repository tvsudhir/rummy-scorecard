 'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [games, setGames] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [players, setPlayers] = useState('');
  const [maxScore, setMaxScore] = useState(80);

  useEffect(() => {
    fetch('/api/games').then(r => r.json()).then(setGames).catch(() => setGames([]));
  }, []);

  const createGame = async () => {
    const body = { name, players: players.split(',').map(p => p.trim()), maxScore: Number(maxScore) };
    await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    window.location.href = `/game/${name}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <div className="card p-6">
          <h1 className="text-2xl font-extrabold mb-2">Indian Rummy Tracker</h1>
          <p className="muted mb-4">Track scores, rounds and quickly add new games. Minimal, distraction-free UI.</p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-3">Recent Games</h2>
            {games.length === 0 ? (
              <div className="p-4 muted">No recent games. Create one to get started.</div>
            ) : (
              <ul className="divide-y">
                {games.map(g => (
                  <li key={g} className="py-3">
                    <Link href={`/game/${g}`} className="text-accent font-medium">{g}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <aside>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Create New Game</h3>
          <label className="block text-sm text-muted mb-1">Game name</label>
          <input className="w-full border p-2 rounded mb-3" placeholder="e.g. Friday Night" value={name} onChange={e => setName(e.target.value)} />

          <label className="block text-sm text-muted mb-1">Players (comma separated)</label>
          <input className="w-full border p-2 rounded mb-3" placeholder="Alice, Bob, Carol" value={players} onChange={e => setPlayers(e.target.value)} />

          <label className="block text-sm text-muted mb-1">Max score</label>
          <input className="w-full border p-2 rounded mb-4" type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} />

          <button className="w-full bg-accent text-white py-2 rounded font-semibold" onClick={createGame}>Start Game</button>
        </div>
      </aside>
    </div>
  );
}
