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
}

export default function GamePage({ params }: { params: { name: string } }) {
  const [game, setGame] = useState<Game | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const gameName = params.name;

  useEffect(() => {
    fetch(`/api/games/${gameName}`).then(res => res.json()).then(setGame);
  }, [gameName]);

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
      <h1 className="text-2xl font-bold mb-2">{game.name}</h1>
      <p className="text-gray-500 mb-4">Status: {game.status}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {game.players.map(p => (
          <div key={p.name} className={`p-4 border rounded ${selectedPlayer === p.name ? 'border-blue-500' : 'border-gray-300'}`}>
            <h2 className="font-semibold">{p.name}</h2>
            <p>Total: {p.total}</p>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setSelectedPlayer(p.name)}>
              Select
            </button>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Upload for {selectedPlayer}</h3>
          <input type="file" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
          <button onClick={handleUpload} disabled={loading} className="ml-3 px-4 py-2 bg-green-600 text-white rounded">
            {loading ? 'Processing...' : 'Submit Photo'}
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-bold text-lg mb-2">Rounds</h3>
        {game.rounds.length === 0 && <p>No rounds yet.</p>}
        {game.rounds.map((round, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded">
            <p>Round {idx + 1} Scores:</p>
            <ul className="list-disc pl-6">
              {round.map((score, i) => (
                <li key={i}>{game.players[i].name}: {score}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
