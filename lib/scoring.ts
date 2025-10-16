import * as R from 'ramda';

export const CARD_VALUES: Record<string, number> = {
  A: 10, J: 10, Q: 10, K: 10,
  '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10
};

export const calculateScore = (cardsText: string): number => {
  const matches = cardsText.match(/\b(10|[2-9JQKA])[♠♥♦♣]/g) || [];
  const baseScore = R.sum(matches.map(c => CARD_VALUES[c.replace(/[♠♥♦♣]/, '')] || 0));
  return /valid/i.test(cardsText) ? 0 : baseScore || 80;
};
