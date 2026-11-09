import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCcw } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StatRow, { StatSpec } from '../components/StatRow';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import OverflowAlert from '../components/OverflowAlert';
import assets from '../assets';
import theme from '../constants/theme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { selCapacity, selDays, useHarvest } from '../game/store';
import { useRoof } from '../hooks/useHarvestState';
import { formatVolume, groupNumber } from '../utils/format';

type Props = {
  onPlayAgain: () => void;
  onMenu: () => void;
  onSizing: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function GameOverScreen({ onPlayAgain, onMenu, onSizing }: Props) {
  const collected = useHarvest(s => s.lastResult.collected);
  const overflow = useHarvest(s => s.lastResult.overflow);
  const rainMm = useHarvest(s => s.lastResult.rainMm);
  const efficiency = useHarvest(s => s.lastResult.efficiency);
  const stored = useHarvest(s => s.stored);
  const capacity = useHarvest(selCapacity);
  const days = useHarvest(selDays);
  const units = useHarvest(s => s.units);
  const { roofArea } = useRoof();

  const enter = useAnimatedValue(0);
  const [shown, setShown] = useState(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: theme.anim.enter.tension,
      friction: theme.anim.enter.friction,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    const start = Date.now();
    const total = 700;
    setShown(0);
    rafRef.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / total);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(collected * eased));
      if (t >= 1 && rafRef.current !== null) {
        clearInterval(rafRef.current);
        rafRef.current = null;
      }
    }, 32);
    return () => {
      if (rafRef.current !== null) {
        clearInterval(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [collected]);

  const cards: StatSpec[] = [
    {
      key: 'stored',
      value: formatVolume(stored, units),
      label: 'STORED',
      color: theme.colors.water.primary,
      amount: stored,
    },
    {
      key: 'overflow',
      value: formatVolume(overflow, units),
      label: 'OVERFLOW',
      color: theme.colors.accent.base,
      amount: overflow,
    },
    {
      key: 'days',
      value: String(days),
      label: 'DAYS',
      color: theme.colors.success,
      amount: days,
    },
  ];

  const seeSizing = useCallback(() => onSizing(), [onSizing]);

  return (
    <AppShell variant="result">
      <ScreenHeader title="STORM RESULT" tone="dark" onBack={onMenu} />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.card,
            {
              opacity: enter,
              transform: [
                {
                  translateY: enter.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}>
          {/* decor sits outside the heading box - never across the letters */}
          <View style={styles.decorRow} pointerEvents="none">
            <Image source={assets.sprite3} style={styles.decorDrop} />
            <Image source={assets.sprite1} style={styles.decorBarrel} />
            <Image source={assets.sprite3} style={styles.decorDrop} />
          </View>

          <Text style={styles.title} numberOfLines={1}>
            STORM LOGGED
          </Text>

          <Text style={styles.hero} numberOfLines={1}>
            {'+' + groupNumber(shown) + ' L'}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {rainMm + ' mm · ' + roofArea + ' m2 · ' + efficiency + '%'}
          </Text>

          <View style={styles.statWrap}>
            <StatRow cards={cards} />
          </View>

          <View style={styles.alertWrap}>
            <OverflowAlert litres={overflow} />
          </View>

          <Text style={styles.hint} numberOfLines={1}>
            {'BARREL ' + Math.round((stored / Math.max(1, capacity)) * 100) + '% FULL'}
          </Text>

          <PrimaryButton label="LOG AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />

          <View style={styles.gap} />
          <SecondaryButton label="MENU" Icon={Home} onPress={onMenu} />

          <Pressable
            onPress={seeSizing}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="See barrel sizing"
            style={styles.tertiary}>
            <Text style={styles.tertiaryText}>SEE SIZING</Text>
          </Pressable>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  card: {
    width: '100%',
    borderRadius: theme.radius.panel,
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 20,
    alignItems: 'center',
    ...theme.shadow.result,
  },
  decorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  decorDrop: { width: 18, height: 24, resizeMode: 'contain' },
  decorBarrel: { width: 54, height: 54, resizeMode: 'contain' },
  title: {
    width: '100%',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  hero: {
    width: '100%',
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  statWrap: { width: '100%' },
  alertWrap: { width: '100%', marginTop: 12 },
  hint: {
    width: '100%',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  gap: { height: 10 },
  tertiary: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  tertiaryText: {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.water.primary,
    textAlign: 'center',
  },
});

export default GameOverScreen;
