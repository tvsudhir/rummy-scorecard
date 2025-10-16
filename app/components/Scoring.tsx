import React from 'react';

interface CardScoreProps {
  card: string;
  score: number;
}

export function CardScore({ card, score }: CardScoreProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-50 rounded px-2 py-1 text-sm mr-2 mb-2">
      <span className="font-mono">{card}</span>
      <span className="text-gray-500">→</span>
      <span className="font-semibold">{score}</span>
    </div>
  );
}

interface CardListProps {
  cards: string[];
  scores: number[];
}

export function CardList({ cards, scores }: CardListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {cards.map((card, idx) => (
        <CardScore key={idx} card={card} score={scores[idx]} />
      ))}
    </div>
  );
}

interface RoundScoreProps {
  isEditing: boolean;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function RoundScore({ isEditing, value, disabled, onChange }: RoundScoreProps) {
  if (!isEditing) return <span className={disabled ? 'text-gray-400' : ''}>{value}</span>;

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      className={"modern-input w-24 px-2 py-1 text-right " + (disabled ? 'opacity-60 pointer-events-none bg-gray-50' : '')}
      value={value}
      disabled={disabled}
      onChange={(e) => {
        // Only allow digits, no leading zeros unless the value is zero
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
        onChange(val === '' ? 0 : Number(val));
      }}
    />
  );
}

export function StatusBadge({ status }: { status: 'in-progress' | 'finished' | string }) {
  const cls = status === 'finished' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}