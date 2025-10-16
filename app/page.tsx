 'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/Scoring';

type GameSummary = { name: string; status: string; players: { name: string; total: number }[] };

export default function Home() {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [name, setName] = useState('');
  const [players, setPlayers] = useState('');
  const [maxScore, setMaxScore] = useState(200);

  useEffect(() => {
    fetch('/api/games').then(r => r.json()).then(setGames).catch(() => setGames([]));
  }, []);

  const createGame = async () => {
    const trimmedName = name.trim();
    const trimmedPlayers = players.split(',').map(p => p.trim());
    const body = { name: trimmedName, players: trimmedPlayers, maxScore: Number(maxScore) };
    await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    window.location.href = `/game/${trimmedName}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <div className="card p-6">
          <h1 className="text-3xl font-extrabold mb-1">Indian Rummy Tracker</h1>
          <p className="small-muted mb-4">Track scores, rounds and quickly add new games. Modern, responsive UI.</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Games</h2>
            {games.length === 0 ? (
              <div className="p-4 muted">No recent games. Create one to get started.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map(g => {
                  const trimmedG = g.name.trim();
                  return (
                    <div key={trimmedG} className="player-card">
                      <div className="flex items-center justify-between">
                        <Link href={`/game/${trimmedG}`} className="text-lg font-semibold text-slate-900">{trimmedG}</Link>
                        <div className="flex items-center gap-4">
                          <StatusBadge status={g.status} />
                          <button
                            className="btn btn-ghost text-sm ml-3"
                            title="Open"
                            onClick={() => { window.location.href = `/game/${trimmedG}` }}
                          >Open</button>
                          <button
                            className="btn btn-ghost text-sm text-red-500"
                            title="Delete game"
                            onClick={async (e) => {
                              e.preventDefault();
                              if (confirm(`Delete game '${trimmedG}'?`)) {
                                await fetch(`/api/games/${trimmedG}`, { method: 'DELETE' });
                                setGames(games => games.filter(x => x.name.trim() !== trimmedG));
                              }
                            }}
                          >Delete</button>
                        </div>
                      </div>
                      <div className="text-sm muted mt-2">Players: {g.players.map(p => p.name).join(', ')}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <aside>
        <div className="card">
          <h3 className="text-2xl font-bold mb-5 text-accent-600">Create New Game</h3>
          <label className="block text-sm text-muted mb-2">Game name</label>
          <input className="modern-input w-full" placeholder="e.g. Friday Night" value={name} onChange={e => setName(e.target.value)} />

          <label className="block text-sm text-muted mb-2">Players (comma separated)</label>
          <input className="modern-input w-full" placeholder="Alice, Bob, Carol" value={players} onChange={e => setPlayers(e.target.value)} />

          <label className="block text-sm text-muted mb-2">Max score</label>
          <input
            className="modern-input w-full mb-4"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxScore === 0 ? '' : maxScore}
            onChange={e => {
              let val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
              setMaxScore(val === '' ? 0 : Number(val));
            }}
            placeholder="Max score"
          />

          <button className="w-full btn btn-accent text-lg py-3 mt-2 transition hover:brightness-110" onClick={createGame}>Start Game</button>
        </div>
      </aside>
    </div>
  );
}
