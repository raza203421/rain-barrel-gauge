import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import type { IconCmp } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  tone?: 'light' | 'dark';
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

export function SecondaryButton({
  label,
  onPress,
  Icon,
  tone = 'light',
  height = 48,
}: Props) {
  const scale = useAnimatedValue(1);
  const dark = tone === 'dark';

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const color = dark ? theme.colors.text.onDark : theme.colors.water.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }]}>
      <Animated.View
        style={[
          styles.fill,
          dark ? styles.fillDark : styles.fillLight,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={color} strokeWidth={2} /> : null}
          <Text style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', alignSelf: 'stretch' },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillLight: {
    backgroundColor: theme.colors.surface.glass,
    borderColor: theme.colors.line.strong,
  },
  fillDark: {
    backgroundColor: 'rgba(234,244,247,0.12)',
    borderColor: 'rgba(196,222,230,0.30)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default React.memo(SecondaryButton);
