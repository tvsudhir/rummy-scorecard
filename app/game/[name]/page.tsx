'use client';

import React, { useEffect, useState } from 'react';

interface Player {
  name: string;
  total: number;
}

interface Game {
  name: string;
  players: Player[];
  rounds: number[][];
  status: string;
  maxScore?: number;
}

export default function GamePage({ params }: { params: { name: string } }) {
  const [game, setGame] = useState<Game | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualScores, setManualScores] = useState<number[]>([]);
  const [manualMode, setManualMode] = useState(false);

  const gameName = params.name;

  useEffect(() => {
    fetch(`/api/games/${gameName}`).then(res => res.json()).then(g => {
      setGame(g);
      setManualScores(g?.players?.map(() => 0) ?? []);
    });
  }, [gameName]);
  const handleManualScoreChange = (idx: number, value: number | '') => {
    setManualScores(scores => scores.map((s, i) => i === idx ? (value === '' ? 0 : value) : s));
  };

  const handleManualSubmit = async () => {
    if (!game) return;
    setLoading(true);
    const updated = await fetch(`/api/games/${gameName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roundScores: manualScores })
    }).then(r => r.json());
    setGame(updated);
    setManualScores(updated.players.map(() => 0));
    setManualMode(false);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!imageFile || !selectedPlayer || !game) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('player', selectedPlayer);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { player, score } = await res.json();

    const updated = await fetch(`/api/games/${gameName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roundScores: game.players.map(p => p.name === player ? score : 0) })
    }).then(r => r.json());

    setGame(updated);
    setSelectedPlayer(null);
    setImageFile(null);
    setLoading(false);
  };

  if (!game) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{game.name}</h1>
          <div className="small-muted">Status: {game.status} • Max score: {game.maxScore}</div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={() => window.location.href = '/'}>Back</button>
          <button className="btn btn-accent" onClick={() => setManualMode(m => !m)}>{manualMode ? 'Cancel' : 'Manual Entry'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {game.players.map((p, idx) => (
          <div key={p.name} className={`player-card ${selectedPlayer === p.name ? 'ring-2 ring-offset-2 ring-indigo-200' : ''} p-6 my-3`}> 
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{p.name}</div>
                <div className="small-muted">Total: {p.total}</div>
              </div>
              <div className="flex flex-col items-end">
                <button className="btn btn-ghost" onClick={() => setSelectedPlayer(p.name)}>Select</button>
                {manualMode && (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="modern-input w-24 mt-2 mb-0 px-2 py-1 text-right"
                    value={manualScores[idx] ?? ''}
                    onChange={e => {
                      // Only allow digits, no leading zeros unless the value is zero
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
                      handleManualScoreChange(idx, val === '' ? '' : Number(val));
                    }}
                    placeholder="Score"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {manualMode && (
        <div className="mt-6 flex gap-3">
          <button className="btn btn-accent" onClick={handleManualSubmit} disabled={loading}>{loading ? 'Saving...' : 'Submit Manual Scores'}</button>
        </div>
      )}

      {selectedPlayer && !manualMode && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Upload for {selectedPlayer}</h3>
          <label className="inline-block">
            <input
              type="file"
              onChange={e => setImageFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <span className="btn btn-ghost border border-accent-500 text-accent-600 hover:bg-accent-50 transition cursor-pointer align-middle">Choose File</span>
          </label>
          <button onClick={handleUpload} disabled={loading} className="ml-3 btn btn-accent align-middle">
            {loading ? 'Processing...' : 'Submit Photo'}
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-bold text-lg mb-3">Rounds</h3>
        {game.rounds.length === 0 && <p className="small-muted">No rounds yet.</p>}

        {game.rounds.length > 0 && (
          <div className="overflow-auto">
            <table className="rounds-table">
              <thead>
                <tr>
                  <th>Round</th>
                  {game.players.map(p => <th key={p.name}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {game.rounds.map((round, rIdx) => (
                  <tr key={rIdx}>
                    <td className="text-left">{rIdx + 1}</td>
                    {game.players.map((_, pIdx) => (
                      <td key={pIdx}>{round[pIdx] ?? 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
