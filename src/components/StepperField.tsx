import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { LONG_PRESS_MS } from '../constants/config';
import { clamp } from '../utils/format';

type Props = {
  label: string;
  value: number;
  display: string;
  step: number;
  fastStep?: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  onTick?: () => void;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * 56px minus / field / plus. Long press repeats with the fast step.
 * The live value lives in a ref so the repeat timer never reads a stale
 * closure value (rule #8).
 */
export function StepperField({
  label,
  value,
  display,
  step,
  fastStep,
  min,
  max,
  onChange,
  onTick,
  height = 56,
}: Props) {
  const valueRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  valueRef.current = value;

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  const bump = useCallback(
    (delta: number) => {
      const next = clamp(
        Math.round((valueRef.current + delta) * 100) / 100,
        min,
        max,
      );
      if (next !== valueRef.current) {
        valueRef.current = next;
        onChange(next);
        if (onTick) {
          onTick();
        }
      }
    },
    [max, min, onChange, onTick],
  );

  const startRepeat = useCallback(
    (dir: number) => {
      stop();
      timerRef.current = setInterval(() => {
        bump(dir * (fastStep ?? step));
      }, LONG_PRESS_MS);
    },
    [bump, fastStep, step, stop],
  );

  const dec = useCallback(() => bump(-step), [bump, step]);
  const inc = useCallback(() => bump(step), [bump, step]);
  const decRepeat = useCallback(() => startRepeat(-1), [startRepeat]);
  const incRepeat = useCallback(() => startRepeat(1), [startRepeat]);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={dec}
        onLongPress={decRepeat}
        onPressOut={stop}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Decrease ' + label}
        style={({ pressed }) => [
          styles.btn,
          { width: height, height },
          pressed ? styles.btnPressed : null,
        ]}>
        <Minus size={24} color={theme.colors.water.primary} strokeWidth={2.4} />
      </Pressable>

      <View style={[styles.field, { height }]}>
        <Text style={styles.fieldLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.fieldValue} numberOfLines={1}>
          {display}
        </Text>
      </View>

      <Pressable
        onPress={inc}
        onLongPress={incRepeat}
        onPressOut={stop}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Increase ' + label}
        style={({ pressed }) => [
          styles.btn,
          { width: height, height },
          pressed ? styles.btnPressed : null,
        ]}>
        <Plus size={24} color={theme.colors.water.primary} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btn: {
    borderRadius: 18,
    backgroundColor: theme.colors.surface.sunk,
    borderWidth: 1,
    borderColor: theme.colors.line.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { backgroundColor: 'rgba(29,111,140,0.14)' },
  field: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.line.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.faint,
  },
  fieldValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(StepperField);
