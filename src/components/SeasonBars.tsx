import React, { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import {
  CHART_BAR_W,
  CHART_BOARD_W,
  CHART_COLS,
  CHART_FRAME,
  CHART_PLOT_H,
  CHART_SLOT,
  MONTH_LETTERS,
} from '../constants/config';
import { useAnimatedValues } from '../hooks/useAnimatedValue';

type Props = {
  collected: ReadonlyArray<number>;
  used: ReadonlyArray<number>;
};

/** Twelve bars, geometry via the BOARD_FRAME formula - overflow is 0. */
export function SeasonBars({ collected, used }: Props) {
  const grow = useAnimatedValues(CHART_COLS, 0);

  const peak = useMemo(() => {
    let max = 1;
    for (let i = 0; i < CHART_COLS; i++) {
      const total = (collected[i] ?? 0) + (used[i] ?? 0);
      if (total > max) {
        max = total;
      }
    }
    return max;
  }, [collected, used]);

  useEffect(() => {
    grow.forEach(v => v.setValue(0));
    const anim = Animated.stagger(
      55,
      grow.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 420,
          useNativeDriver: false,
        }),
      ),
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, [grow, peak]);

  return (
    <View style={styles.board}>
      <View style={styles.plot}>
        {grow.map((v, i) => {
          const c = collected[i] ?? 0;
          const u = used[i] ?? 0;
          const cH = Math.round((c / peak) * (CHART_PLOT_H - 16));
          const uH = Math.round((u / peak) * (CHART_PLOT_H - 16));
          return (
            <View key={i} style={[styles.slot, { width: CHART_SLOT }]}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    width: CHART_BAR_W,
                    height: v.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, Math.max(2, cH + uH)],
                    }),
                  },
                ]}>
                <LinearGradient
                  colors={[theme.gradients.bar[0], theme.gradients.bar[1]]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.barFill}
                />
                {uH > 0 ? (
                  <View style={[styles.used, { height: uH }]} />
                ) : null}
              </Animated.View>
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {MONTH_LETTERS.map((m, i) => (
          <View key={i} style={[styles.slot, { width: CHART_SLOT }]}>
            <Text style={styles.month}>{m}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: CHART_BOARD_W,
    paddingHorizontal: CHART_FRAME,
    paddingVertical: 12,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    backgroundColor: theme.colors.surface.base,
    ...theme.shadow.card,
  },
  plot: {
    height: CHART_PLOT_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  slot: { alignItems: 'center' },
  bar: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { ...StyleSheet.absoluteFillObject },
  used: { width: '100%', backgroundColor: theme.colors.water.shell },
  labels: { flexDirection: 'row', marginTop: 8 },
  month: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    color: theme.colors.text.faint,
  },
});

export default React.memo(SeasonBars);
