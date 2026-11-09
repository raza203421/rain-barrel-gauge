import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCcw } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import ChipRow from '../components/ChipRow';
import StepperField from '../components/StepperField';
import SliderRow from '../components/SliderRow';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import {
  BARREL_COUNT_MAX,
  BARREL_COUNT_MIN,
  BARREL_L_MAX,
  BARREL_L_MIN,
  BARREL_L_STEP,
  DEMAND_MAX,
  DEMAND_MIN,
  DEMAND_STEP,
  EFF_MAX,
  EFF_MIN,
  GARDEN_MAX,
  GARDEN_MIN,
} from '../constants/config';
import {
  resetSeason,
  setBarrelCount,
  setBarrelL,
  setDailyDemand,
  setEfficiency,
  setGardenArea,
  setUnits,
  toggleHaptics,
  toggleStormTheme,
  useHarvest,
} from '../game/store';
import { useHaptic } from '../hooks/useHaptic';
import { formatDemand, Units } from '../utils/format';

type Props = { onBack: () => void };

type RowId =
  | 'units'
  | 'efficiency'
  | 'capacity'
  | 'count'
  | 'garden'
  | 'demand'
  | 'theme'
  | 'haptics';

const ROWS: RowId[] = [
  'units',
  'efficiency',
  'capacity',
  'count',
  'garden',
  'demand',
  'theme',
  'haptics',
];

const UNIT_CHIPS = [
  { id: 'LITRES', label: 'LITRES' },
  { id: 'GALLONS', label: 'GALLONS' },
];

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Toggle({
  value,
  onToggle,
  label,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.togglePress}>
      <View style={[styles.toggleTrack, value ? styles.toggleOn : styles.toggleOff]}>
        <View style={[styles.toggleKnob, value ? styles.knobOn : styles.knobOff]} />
      </View>
      <Text style={[styles.toggleText, value ? styles.toggleTextOn : null]}>
        {value ? 'ON' : 'OFF'}
      </Text>
    </Pressable>
  );
}

function UnitsRow() {
  const units = useHarvest(s => s.units);
  const onSelect = useCallback((id: string) => setUnits(id as Units), []);
  return (
    <Card title="UNITS">
      <ChipRow items={UNIT_CHIPS} activeId={units} onSelect={onSelect} height={44} />
    </Card>
  );
}

function EfficiencyRow() {
  const efficiency = useHarvest(s => s.efficiency);
  return (
    <Card title="DEFAULT EFFICIENCY">
      <SliderRow
        label="GUTTER EFFICIENCY"
        value={efficiency}
        min={EFF_MIN}
        max={EFF_MAX}
        onChange={setEfficiency}
      />
    </Card>
  );
}

function CapacityRow({ onTick }: { onTick: () => void }) {
  const barrelL = useHarvest(s => s.barrelL);
  return (
    <Card title="BARREL CAPACITY">
      <StepperField
        label="PER BARREL"
        value={barrelL}
        display={barrelL + ' L'}
        step={BARREL_L_STEP}
        fastStep={50}
        min={BARREL_L_MIN}
        max={BARREL_L_MAX}
        onChange={setBarrelL}
        onTick={onTick}
      />
    </Card>
  );
}

function CountRow({ onTick }: { onTick: () => void }) {
  const barrelCount = useHarvest(s => s.barrelCount);
  return (
    <Card title="BARREL COUNT">
      <StepperField
        label="BARRELS"
        value={barrelCount}
        display={String(barrelCount)}
        step={1}
        min={BARREL_COUNT_MIN}
        max={BARREL_COUNT_MAX}
        onChange={setBarrelCount}
        onTick={onTick}
      />
    </Card>
  );
}

function GardenRow({ onTick }: { onTick: () => void }) {
  const gardenArea = useHarvest(s => s.gardenArea);
  return (
    <Card title="GARDEN AREA">
      <StepperField
        label="GARDEN"
        value={gardenArea}
        display={gardenArea + ' m2'}
        step={1}
        fastStep={5}
        min={GARDEN_MIN}
        max={GARDEN_MAX}
        onChange={setGardenArea}
        onTick={onTick}
      />
    </Card>
  );
}

function DemandRow({ onTick }: { onTick: () => void }) {
  const demand = useHarvest(s => s.dailyDemandMm);
  return (
    <Card title="DAILY DEMAND">
      <StepperField
        label="PER DAY"
        value={demand}
        display={formatDemand(demand)}
        step={DEMAND_STEP}
        min={DEMAND_MIN}
        max={DEMAND_MAX}
        onChange={setDailyDemand}
        onTick={onTick}
      />
    </Card>
  );
}

function ThemeRow() {
  const stormTheme = useHarvest(s => s.stormTheme);
  return (
    <Card title="STORMY DARK THEME">
      <Toggle value={stormTheme} onToggle={toggleStormTheme} label="Stormy dark theme" />
    </Card>
  );
}

function HapticsRow() {
  const haptics = useHarvest(s => s.haptics);
  return (
    <Card title="HAPTICS">
      <Toggle value={haptics} onToggle={toggleHaptics} label="Haptic feedback" />
    </Card>
  );
}

export function SettingsScreen({ onBack }: Props) {
  const haptic = useHaptic();
  const onTick = useCallback(() => haptic(8), [haptic]);

  const onReset = useCallback(() => {
    haptic(16);
    resetSeason();
  }, [haptic]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RowId>) => {
      switch (item) {
        case 'units':
          return <UnitsRow />;
        case 'efficiency':
          return <EfficiencyRow />;
        case 'capacity':
          return <CapacityRow onTick={onTick} />;
        case 'count':
          return <CountRow onTick={onTick} />;
        case 'garden':
          return <GardenRow onTick={onTick} />;
        case 'demand':
          return <DemandRow onTick={onTick} />;
        case 'theme':
          return <ThemeRow />;
        default:
          return <HapticsRow />;
      }
    },
    [onTick],
  );

  const keyExtractor = useCallback((item: RowId) => item, []);

  return (
    <AppShell variant="game">
      <ScreenHeader title="WATER SETTINGS" onBack={onBack} />

      <FlatList
        data={ROWS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
      />

      <View style={styles.footer}>
        <View style={styles.slot}>
          <SecondaryButton label="RESET SEASON" Icon={RotateCcw} onPress={onReset} />
        </View>
        <View style={styles.slot}>
          <SecondaryButton label="BACK" Icon={Home} onPress={onBack} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  card: {
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    padding: 14,
    marginBottom: 12,
    ...theme.shadow.card,
  },
  cardTitle: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.muted,
    marginBottom: 10,
  },
  togglePress: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 44 },
  toggleTrack: {
    width: 64,
    height: 34,
    borderRadius: 17,
    padding: 3,
    borderWidth: 1,
  },
  toggleOn: {
    backgroundColor: 'rgba(29,111,140,0.18)',
    borderColor: theme.colors.water.primary,
  },
  toggleOff: {
    backgroundColor: theme.colors.surface.sunk,
    borderColor: theme.colors.line.strong,
  },
  toggleKnob: { width: 26, height: 26, borderRadius: 13 },
  knobOn: { backgroundColor: theme.colors.water.primary, alignSelf: 'flex-end' },
  knobOff: { backgroundColor: theme.colors.line.strong, alignSelf: 'flex-start' },
  toggleText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.faint,
  },
  toggleTextOn: { color: theme.colors.water.primary },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 4,
  },
  slot: { flex: 1 },
});

export default SettingsScreen;
