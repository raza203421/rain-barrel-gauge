import React, { useCallback, useEffect } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BarChart3,
  ClipboardList,
  Home,
  Layers,
  Play,
  Settings,
  Sun,
} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import BentoTile from '../components/BentoTile';
import SecondaryButton from '../components/SecondaryButton';
import assets from '../assets';
import theme from '../constants/theme';
import { SCREEN_H } from '../constants/config';
import { useAnimatedValue, useAnimatedValues } from '../hooks/useAnimatedValue';
import { selCapacity, useHarvest } from '../game/store';
import { useRoof, useWatering } from '../hooks/useHarvestState';
import { clamp, formatVolume } from '../utils/format';
import type { Screen } from '../navigation';

type Props = { onNavigate: (screen: Screen) => void };

/* Tile heights scale down on short devices so nothing is pushed off-screen. */
const BASE = { start: 164, bento: 104, wide: 92 };
const BASE_SUM = BASE.start + BASE.bento * 2 + BASE.wide;
const AVAIL = SCREEN_H - 190 - 36;
const K = clamp(AVAIL / BASE_SUM, 0.72, 1);
const H = {
  start: Math.round(BASE.start * K),
  bento: Math.round(BASE.bento * K),
  wide: Math.round(BASE.wide * K),
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TILE_COUNT = 5;

function CapacityBadge() {
  const stored = useHarvest(s => s.stored);
  const units = useHarvest(s => s.units);
  return (
    <View style={styles.badge}>
      <View style={styles.badgeDot} />
      <Text style={styles.badgeText} numberOfLines={1}>
        {formatVolume(stored, units)}
      </Text>
    </View>
  );
}

function BrandMark() {
  return <Image source={assets.logo} style={styles.brandMark} />;
}

function StartTile({ onPress }: { onPress: () => void }) {
  const scale = useAnimatedValue(1);
  const sheen = useAnimatedValue(0);
  const season = useHarvest(s => s.seasonLitres);
  const units = useHarvest(s => s.units);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sheen, {
        toValue: 1,
        duration: 3600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [sheen]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="Start logging rainfall"
      style={[styles.startPress, { height: H.start }]}>
      <Animated.View style={[styles.startCard, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[
            theme.gradients.tile[0],
            theme.gradients.tile[1],
            theme.gradients.tile[2],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.startGrad}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.sheen,
              {
                transform: [
                  {
                    translateX: sheen.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-120, 420],
                    }),
                  },
                  { skewX: '-18deg' },
                ],
              },
            ]}
          />
          <Image source={assets.sprite1} style={styles.startSprite} />
          <View style={styles.startText}>
            <Text style={styles.startEyebrow}>THIS SEASON</Text>
            <Text style={styles.startValue} numberOfLines={1}>
              {formatVolume(season, units)}
            </Text>
            <View style={styles.startCtaRow}>
              <Play size={24} color={theme.colors.accent.base} strokeWidth={2.4} />
              <Text style={styles.startCta}>START LOGGING</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export function MenuScreen({ onNavigate }: Props) {
  const enter = useAnimatedValues(TILE_COUNT, 0);
  const capacity = useHarvest(selCapacity);
  const barrelCount = useHarvest(s => s.barrelCount);
  const barrelL = useHarvest(s => s.barrelL);
  const entries = useHarvest(s => s.entries).length;
  const { roofArea } = useRoof();
  const { days, perDay, gardenArea } = useWatering();

  useEffect(() => {
    const anim = Animated.stagger(
      70,
      enter.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, [enter]);

  const goGame = useCallback(() => onNavigate('game'), [onNavigate]);
  const goRoof = useCallback(() => onNavigate('roof'), [onNavigate]);
  const goSizing = useCallback(() => onNavigate('sizing'), [onNavigate]);
  const goLog = useCallback(() => onNavigate('log'), [onNavigate]);
  const goChart = useCallback(() => onNavigate('chart'), [onNavigate]);
  const goSettings = useCallback(() => onNavigate('settings'), [onNavigate]);

  const fadeStyle = (i: number) => ({
    opacity: enter[i],
    transform: [
      {
        translateY: enter[i].interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });

  return (
    <AppShell variant="menu">
      <ScreenHeader
        title="GAUGE"
        eyebrow="RAIN BARREL"
        leftSlot={<BrandMark />}
        rightSlot={<CapacityBadge />}
      />

      <View style={styles.body}>
        {/* pointerEvents box-none: an Animated wrapper otherwise swallows taps */}
        <Animated.View pointerEvents="box-none" style={fadeStyle(0)}>
          <StartTile onPress={goGame} />
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.row, fadeStyle(1)]}>
          <View style={styles.slot}>
            <BentoTile
              Icon={Home}
              iconColor={theme.colors.water.primary}
              value={roofArea + ' m2'}
              label="ROOF AREA"
              height={H.bento}
              onPress={goRoof}
            />
          </View>
          <View style={styles.slot}>
            <BentoTile
              Icon={Layers}
              iconColor={theme.colors.accent.base}
              value={barrelCount + 'x' + barrelL + ' L'}
              label="BARRELS"
              height={H.bento}
              onPress={goSizing}
            />
          </View>
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.row, fadeStyle(2)]}>
          <View style={styles.slot}>
            <BentoTile
              Icon={ClipboardList}
              iconColor={theme.colors.success}
              value={String(entries)}
              label="LOG ENTRIES"
              height={H.bento}
              onPress={goLog}
            />
          </View>
          <View style={styles.slot}>
            <BentoTile
              Icon={BarChart3}
              iconColor={theme.colors.water.primary}
              value={'12 mo'}
              label="SEASON CHART"
              height={H.bento}
              onPress={goChart}
            />
          </View>
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.wideWrap, fadeStyle(3)]}>
          <BentoTile
            Icon={Sun}
            iconColor={theme.colors.accent.base}
            value={days + ' DAYS OF WATERING'}
            label={'CAPACITY ' + capacity + ' L'}
            caption={gardenArea + ' m2 garden · ' + perDay + ' L/day'}
            height={H.wide}
            wide
            decor={assets.sprite5}
            onPress={goGame}
          />
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.footer, fadeStyle(4)]}>
          <View style={styles.slot}>
            <SecondaryButton label="SETTINGS" Icon={Settings} onPress={goSettings} />
          </View>
          <View style={styles.slot}>
            <SecondaryButton label="LEVEL LOG" Icon={ClipboardList} onPress={goLog} />
          </View>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  brandMark: { width: 34, height: 34, resizeMode: 'contain' },
  badge: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface.base,
    borderWidth: 1,
    borderColor: theme.colors.line.strong,
    ...theme.shadow.card,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.water.primary,
  },
  badgeText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },

  startPress: { width: '100%', borderRadius: 24, ...theme.shadow.tile },
  startCard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  startGrad: { width: '100%', height: '100%', padding: 18, justifyContent: 'center' },
  sheen: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 70,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  startSprite: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
  startText: { maxWidth: '68%' },
  startEyebrow: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(234,244,247,0.72)',
  },
  startValue: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  startCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  startCta: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },

  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  slot: { flex: 1 },
  wideWrap: { marginTop: 12 },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
    paddingTop: 12,
  },
});

export default MenuScreen;
