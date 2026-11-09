import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { pct } from '../utils/format';

type Props = {
  captured: number;
  spilled: number;
  width: number;
};

/** Two-colour capacity bar: captured litres vs litres lost over the rim. */
export function CompareBar({ captured, spilled, width }: Props) {
  const total = captured + spilled;
  const capturedPct = total > 0 ? Math.round((captured / total) * 100) : 100;

  return (
    <View style={[styles.track, { width }]}>
      <View
        style={[
          styles.seg,
          { width: pct(capturedPct), backgroundColor: theme.colors.water.primary },
        ]}
      />
      <View
        style={[
          styles.seg,
          {
            width: pct(100 - capturedPct),
            backgroundColor: theme.colors.accent.base,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#D8ECF2',
  },
  seg: { height: 12 },
});

export default React.memo(CompareBar);
