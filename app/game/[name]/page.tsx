 'use client';

import React, { useEffect, useState } from 'react';
import { CardList, RoundScore, StatusBadge } from '@/app/components/Scoring';
import { Game, Player, Round } from '@/lib/types';

interface GameState {
  game: Game | null;
  selectedPlayer: string | null;
  imageFile: File | null;
  loading: boolean;
  editingRound: number | null;
  roundScores: { [playerName: string]: number };
  cardDetails: {
    [playerName: string]: { cards: string[]; scores: number[] };
  };
}

export default function GamePage({ params }: { params: { name: string } }) {
  const [state, setState] = useState<GameState>({
    game: null,
    selectedPlayer: null,
    imageFile: null,
    loading: false,
    editingRound: null,
    roundScores: {},
    cardDetails: {},
  });

  const gameName = params.name;

  useEffect(() => {
    fetch(`/api/games/${gameName}`)
      .then(res => res.json())
      .then(game => setState(prev => ({ ...prev, game })));
  }, [gameName]);

  const handleScoreChange = (playerName: string, value: number) => {
    setState(prev => ({
      ...prev,
      roundScores: { ...prev.roundScores, [playerName]: value }
    }));
  };

  const handleSaveRound = async (roundIndex: number) => {
    if (!state.game) return;
    
    setState(prev => ({ ...prev, loading: true }));

    try {
      const updated = await fetch(`/api/games/${gameName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundIndex,
          scores: state.roundScores,
          cards: state.cardDetails
        })
      }).then(r => r.json());

      setState(prev => ({
        ...prev,
        game: updated,
        roundScores: {},
        cardDetails: {},
        editingRound: null,
        loading: false
      }));
    } catch (error) {
      console.error('Error saving round:', error);
      alert('Failed to save round. Please try again.');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAddRound = async () => {
    if (!state.game) return;
    // create an empty round with zero scores for all players
    const scores: Record<string, number> = {};
    state.game.players.forEach(p => { scores[p.name] = 0; });
    setState(prev => ({ ...prev, loading: true }));
    try {
      const updated = await fetch(`/api/games/${gameName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundIndex: null, scores })
      }).then(r => r.json());
      setState(prev => ({ ...prev, game: updated, loading: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, loading: false }));
      alert('Failed to add round');
    }
  };

  if (!state.game) return <div className="p-6">Loading...</div>;

  const game = state.game!;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{game.name}</h1>
          <div className="text-sm text-gray-600"><StatusBadge status={game.status} /> <span className="ml-3">Max score: {game.maxScore}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={handleAddRound} disabled={state.loading}>Add Round</button>
          <button className="btn btn-ghost" onClick={() => window.location.href = '/'}>
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
  {game.players.map((p) => (
          <div key={p.name} className={`player-card ${state.selectedPlayer === p.name ? 'ring-2 ring-offset-2 ring-indigo-200' : ''} p-6 my-3`}> 
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{p.name}</div>
              </div>
              <button 
                className={`btn ${state.selectedPlayer === p.name ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => setState(prev => ({
                  ...prev,
                  selectedPlayer: prev.selectedPlayer === p.name ? null : p.name
                }))}
              >
                {state.selectedPlayer === p.name ? 'Deselect' : 'Select'}
              </button>
            </div>
            {state.cardDetails[p.name] && (
              <div className="mt-4">
                <CardList 
                  cards={state.cardDetails[p.name].cards} 
                  scores={state.cardDetails[p.name].scores}
                />
              </div>
            )}
            <div className="mt-3 text-sm text-gray-600">Total: {p.total}</div>
          </div>
        ))}
      </div>

      {/* Selection panel removed - image upload/processing disabled */}

      <div className="mt-8">
        <h3 className="font-bold text-lg mb-3">Rounds</h3>
        <div>
          {game.rounds.length === 0 ? (
            <p className="text-sm text-gray-600">No rounds yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full w-full table-fixed divide-y divide-gray-200 rounds-table">
                <colgroup>
                  <col style={{ width: '80px' }} />
                  {game.players.map((_, idx) => (
                    <col key={idx} />
                  ))}
                  <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-4 py-2">Round</th>
                    {game.players.map(p => (
                      <th key={p.name} className="px-4 py-2">{p.name}</th>
                    ))}
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.game.rounds.map((round, rIdx) => {
                    // compute totals before this round
                    const totalsBefore: Record<string, number> = {};
                    for (let i = 0; i < rIdx; i++) {
                      const rr = state.game!.rounds[i];
                      state.game!.players.forEach(p => {
                        totalsBefore[p.name] = (totalsBefore[p.name] || 0) + (rr.scores[p.name] || 0);
                      });
                    }

                    return (
                      <tr key={rIdx} className={state.editingRound === rIdx ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-2">{rIdx + 1}</td>
                        {game.players.map((player: Player) => {
                          const eliminated = (totalsBefore[player.name] || 0) >= (game.maxScore || Infinity);
                          const value = state.editingRound === rIdx ? (state.roundScores[player.name] ?? round.scores[player.name] ?? 0) : (round.scores[player.name] ?? 0);
                          return (
                            <td key={player.name} className="px-4 py-2">
                              <RoundScore
                                isEditing={state.editingRound === rIdx}
                                value={value}
                                disabled={eliminated}
                                onChange={(v: number) => handleScoreChange(player.name, v)}
                              />
                            </td>
                          );
                        })}
                        <td className="px-4 py-2">
                          {state.editingRound === rIdx ? (
                            <button 
                              className="btn btn-sm btn-accent"
                              onClick={() => handleSaveRound(rIdx)}
                              disabled={state.loading}
                            >
                              {state.loading ? 'Saving...' : 'Save'}
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-ghost"
                              onClick={() => {
                                const playerScores: Record<string, number> = {};
                                if (game) {
                                  game.players.forEach((p: Player) => {
                                    playerScores[p.name] = round.scores[p.name] ?? 0;
                                  });
                                }
                                setState(prev => ({
                                  ...prev,
                                  editingRound: rIdx,
                                  roundScores: playerScores,
                                  cardDetails: round.cards ?? {}
                                }));
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-gray-50">
                    <td className="px-4 py-2">Totals</td>
                    {game.players.map(p => (
                      <td key={p.name} className="px-4 py-2">{p.total}</td>
                    ))}
                    <td className="px-4 py-2" />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}