import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CloudRain } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import BarrelTank from '../components/BarrelTank';
import RainDrops from '../components/RainDrops';
import StatRow, { StatSpec } from '../components/StatRow';
import ChipRow from '../components/ChipRow';
import StepperField from '../components/StepperField';
import SliderRow from '../components/SliderRow';
import PrimaryButton from '../components/PrimaryButton';
import assets from '../assets';
import theme from '../constants/theme';
import {
  DEFAULTS,
  EFF_MAX,
  EFF_MIN,
  RAIN_FAST_STEP,
  RAIN_MAX,
  RAIN_MIN,
  RAIN_STEP,
  RESULT_DELAY_MS,
  TANK_MAX_W,
} from '../constants/config';
import { useBarrel } from '../hooks/useHarvestState';
import { useHaptic } from '../hooks/useHaptic';
import { addStorm, useHarvest } from '../game/store';
import { formatMm, formatVolume } from '../utils/format';

type Props = {
  onBack: () => void;
  onStormLogged: () => void;
};

const MODES = [
  { id: 'STORM', label: 'STORM' },
  { id: 'MONTH', label: 'MONTH' },
];

const ROOF_H = 56;
const ROOF_GAP = 80;

function CapacityPill() {
  const { stored, capacity } = useBarrel();
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText} numberOfLines={1}>
        {Math.round(stored) + ' / ' + capacity + ' L'}
      </Text>
    </View>
  );
}

export function GameScreen({ onBack, onStormLogged }: Props) {
  const { stored, capacity, ratio } = useBarrel();
  const units = useHarvest(s => s.units);
  const pourTick = useHarvest(s => s.pourTick);
  const defaultEfficiency = useHarvest(s => s.efficiency);
  const lastCollected = useHarvest(s => s.lastResult.collected);
  const lastOverflow = useHarvest(s => s.lastResult.overflow);
  const perDay = useHarvest(s => s.gardenArea * s.dailyDemandMm);

  const [mode, setMode] = useState('STORM');
  const [rainMm, setRainMm] = useState(DEFAULTS.rainMm);
  const [efficiency, setEfficiency] = useState(defaultEfficiency);
  const [pouring, setPouring] = useState(false);

  const haptic = useHaptic();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoff = useRef(onStormLogged);
  handoff.current = onStormLogged;

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const tick = useCallback(() => haptic(10), [haptic]);

  const onAddStorm = useCallback(() => {
    if (rainMm <= 0 || pouring) {
      return;
    }
    haptic(12);
    setPouring(true);
    addStorm(rainMm, efficiency);
    timerRef.current = setTimeout(() => {
      setPouring(false);
      handoff.current();
    }, RESULT_DELAY_MS);
  }, [efficiency, haptic, pouring, rainMm]);

  const days = perDay > 0 ? Math.floor(stored / perDay) : 0;

  const cards: StatSpec[] = [
    {
      key: 'collected',
      value: formatVolume(lastCollected, units),
      label: 'COLLECTED',
      color: theme.colors.water.primary,
      amount: lastCollected,
    },
    {
      key: 'overflow',
      value: formatVolume(lastOverflow, units),
      label: 'OVERFLOW',
      color: theme.colors.accent.base,
      amount: lastOverflow,
    },
    {
      key: 'days',
      value: String(days),
      label: 'DAYS',
      color: theme.colors.success,
      amount: days,
    },
  ];

  return (
    <AppShell variant="game">
      <ScreenHeader
        title="BARREL LEVEL"
        onBack={onBack}
        rightSlot={<CapacityPill />}
      />

      <View style={styles.gameArea}>
        <View style={styles.stack}>
          <View style={styles.roofWrap} pointerEvents="none">
            <Image source={assets.sprite2} style={styles.roof} />
          </View>
          <View style={styles.dropLane} pointerEvents="none">
            <RainDrops trigger={pourTick} width={TANK_MAX_W} distance={ROOF_GAP} />
          </View>
          <BarrelTank
            stored={stored}
            capacity={capacity}
            ratio={ratio}
            units={units}
            tick={pourTick}
          />
        </View>
      </View>

      <View style={styles.statStrip}>
        <StatRow cards={cards} />
      </View>

      <View style={styles.panel}>
        <ChipRow items={MODES} activeId={mode} onSelect={setMode} height={36} />

        <View style={styles.gapSm} />
        <StepperField
          label={mode === 'MONTH' ? 'MONTHLY RAINFALL' : 'RAINFALL'}
          value={rainMm}
          display={formatMm(rainMm)}
          step={RAIN_STEP}
          fastStep={RAIN_FAST_STEP}
          min={RAIN_MIN}
          max={RAIN_MAX}
          onChange={setRainMm}
          onTick={tick}
        />

        <View style={styles.gapSm} />
        <SliderRow
          label="EFFICIENCY"
          value={efficiency}
          min={EFF_MIN}
          max={EFF_MAX}
          onChange={setEfficiency}
        />

        <View style={styles.gapMd} />
        <PrimaryButton
          label="ADD STORM"
          Icon={CloudRain}
          onPress={onAddStorm}
          disabled={rainMm <= 0 || pouring}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.sunk,
  },
  pillText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  stack: { width: TANK_MAX_W, alignItems: 'center' },
  roofWrap: { alignItems: 'center', marginBottom: 4 },
  roof: { width: 108, height: ROOF_H, resizeMode: 'contain' },
  dropLane: {
    position: 'absolute',
    top: ROOF_H,
    left: 0,
    width: TANK_MAX_W,
    height: ROOF_GAP,
  },
  statStrip: { paddingHorizontal: 16, paddingBottom: 10 },
  panel: {
    backgroundColor: theme.colors.surface.base,
    borderTopLeftRadius: theme.radius.panel,
    borderTopRightRadius: theme.radius.panel,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line.border,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 18,
    ...theme.shadow.panel,
  },
  gapSm: { height: 10 },
  gapMd: { height: 12 },
});

export default GameScreen;
