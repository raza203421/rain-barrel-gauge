import React from 'react';
import { StyleSheet, View } from 'react-native';
import StatCard from './StatCard';

export type StatSpec = {
  key: string;
  value: string;
  label: string;
  color: string;
  /** Used for the "is this card worth showing" test. */
  amount: number;
};

type Props = {
  cards: ReadonlyArray<StatSpec>;
  tone?: 'light' | 'dark';
};

/**
 * Renders nothing at all unless at least two cards carry a non-zero value -
 * a lone pill (or an empty one) reads as a broken skeleton (rule #21/#13).
 */
export function StatRow({ cards, tone = 'light' }: Props) {
  const visible = cards.filter(c => c.amount > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(card => (
        <View key={card.key} style={styles.slot}>
          <StatCard
            value={card.value}
            label={card.label}
            valueColor={card.color}
            tone={tone}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  slot: { flex: 1 },
});

export default React.memo(StatRow);
