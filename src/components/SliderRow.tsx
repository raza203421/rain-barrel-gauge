import React, { useCallback, useRef } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { clamp, pct } from '../utils/format';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  suffix?: string;
};

const KNOB = 28;
const TRACK_H = 8;

/**
 * Custom slider built on the RN built-in touch responder system: no extra
 * native dependency is needed, a plain View responder covers drag + tap.
 */
export function SliderRow({ label, value, min, max, onChange, suffix = '%' }: Props) {
  const widthRef = useRef(1);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    widthRef.current = Math.max(1, e.nativeEvent.layout.width);
  }, []);

  const apply = useCallback(
    (e: GestureResponderEvent) => {
      const x = clamp(e.nativeEvent.locationX, 0, widthRef.current);
      const ratio = x / widthRef.current;
      onChange(Math.round(min + ratio * (max - min)));
    },
    [max, min, onChange],
  );

  const ratio = clamp((value - min) / Math.max(1, max - min), 0, 1);
  const fillPct = pct(Math.round(ratio * 100));

  return (
    <View style={styles.root}>
      <View style={styles.headRow}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
          {suffix}
        </Text>
      </View>

      <View
        style={styles.touch}
        onLayout={onLayout}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={apply}
        onResponderMove={apply}>
        <View style={styles.track}>
          <LinearGradient
            colors={[theme.gradients.slider[0], theme.gradients.slider[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: fillPct }]}
          />
        </View>
        <View style={[styles.knobLane, { width: fillPct }]} pointerEvents="none">
          <View style={styles.knob} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  value: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },
  touch: { width: '100%', height: 32, justifyContent: 'center' },
  track: {
    width: '100%',
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: '#D8ECF2',
    overflow: 'hidden',
  },
  fill: { height: TRACK_H, borderRadius: TRACK_H / 2 },
  knobLane: {
    position: 'absolute',
    left: 0,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.surface.base,
    borderWidth: 2,
    borderColor: theme.colors.water.primary,
    marginRight: -KNOB / 2,
    ...theme.shadow.card,
  },
});

export default React.memo(SliderRow);
