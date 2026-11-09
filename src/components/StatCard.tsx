import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
  tone?: 'light' | 'dark';
};

/**
 * No raster icon inside - colour carries the semantics (rule #21).
 * `width: '100%'` (never `flex: 1`) so the card keeps its intrinsic height
 * inside a flex:1 slot (rule #19a).
 */
export function StatCard({ value, label, valueColor, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.card,
        dark ? styles.cardDark : styles.cardLight,
        { borderColor: valueColor + '55' },
      ]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text
        style={[styles.label, dark ? styles.labelDark : null]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: theme.radius.chip,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardLight: { backgroundColor: theme.colors.surface.base },
  cardDark: { backgroundColor: 'rgba(255,255,255,0.90)' },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 6 },
  value: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  labelDark: { color: theme.colors.text.muted },
});

export default React.memo(StatCard);
