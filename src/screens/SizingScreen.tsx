import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import ChipRow from '../components/ChipRow';
import CompareBar from '../components/CompareBar';
import PrimaryButton from '../components/PrimaryButton';
import theme from '../constants/theme';
import { BARREL_COUNT_MAX, COMPARE_W } from '../constants/config';
import { setBarrelCount, sizingOptions, useHarvest } from '../game/store';
import { useHaptic } from '../hooks/useHaptic';
import type { SizingOption } from '../game/sizing';

type Props = { onBack: () => void };

const CHIPS = Array.from({ length: BARREL_COUNT_MAX }, (_, i) => ({
  id: String(i + 1),
  label: String(i + 1),
}));

type RowProps = {
  count: number;
  capacity: number;
  captured: number;
  spilled: number;
  spillShare: number;
  recommended: boolean;
  selected: boolean;
};

const OptionRow = React.memo(function OptionRow({
  count,
  capacity,
  captured,
  spilled,
  spillShare,
  recommended,
  selected,
}: RowProps) {
  return (
    <View style={[styles.card, selected ? styles.cardSelected : null]}>
      <View style={styles.headRow}>
        <Text style={styles.count} numberOfLines={1}>
          {count + (count === 1 ? ' BARREL' : ' BARRELS')}
        </Text>
        <Text style={styles.capacity} numberOfLines={1}>
          {capacity + ' L'}
        </Text>
        {recommended ? (
          <View style={styles.recChip}>
            <Check size={14} color={theme.colors.success} strokeWidth={3} />
            <Text style={styles.recText}>RECOMMENDED</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.barWrap}>
        <CompareBar captured={captured} spilled={spilled} width={COMPARE_W} />
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.water.primary }]} />
          <Text style={styles.legendText} numberOfLines={1}>
            {'CAUGHT ' + Math.round(captured) + ' L'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.accent.base }]} />
          <Text style={styles.legendText} numberOfLines={1}>
            {'SPILLED ' + Math.round(spilled) + ' L · ' + Math.round(spillShare * 100) + '%'}
          </Text>
        </View>
      </View>
    </View>
  );
});

export function SizingScreen({ onBack }: Props) {
  const current = useHarvest(s => s.barrelCount);
  const barrelL = useHarvest(s => s.barrelL);
  const historyLen = useHarvest(s => s.history.length);
  const haptic = useHaptic();
  const [picked, setPicked] = useState(current);

  const options = useMemo(
    () => sizingOptions(),
    // recompute when anything that feeds the replay changes
    [barrelL, historyLen],
  );

  const onSelect = useCallback(
    (id: string) => {
      haptic(10);
      setPicked(Number(id));
    },
    [haptic],
  );

  const onApply = useCallback(() => {
    haptic(12);
    setBarrelCount(picked);
    onBack();
  }, [haptic, onBack, picked]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SizingOption>) => (
      <OptionRow
        count={item.count}
        capacity={item.capacity}
        captured={item.captured}
        spilled={item.spilled}
        spillShare={item.spillShare}
        recommended={item.recommended}
        selected={item.count === picked}
      />
    ),
    [picked],
  );

  const keyExtractor = useCallback((item: SizingOption) => String(item.count), []);

  return (
    <AppShell variant="game">
      <ScreenHeader title="SIZING COMPARE" onBack={onBack} />

      <View style={styles.chipWrap}>
        <Text style={styles.chipLabel}>HOW MANY BARRELS</Text>
        <ChipRow items={CHIPS} activeId={String(picked)} onSelect={onSelect} height={44} />
      </View>

      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
      />

      <View style={styles.panel}>
        <Text style={styles.hint} numberOfLines={1}>
          {'EACH BARREL HOLDS ' + barrelL + ' L'}
        </Text>
        <PrimaryButton
          label={'USE ' + picked + (picked === 1 ? ' BARREL' : ' BARRELS')}
          Icon={Check}
          onPress={onApply}
          height={56}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  chipWrap: { paddingHorizontal: 16, paddingTop: 14 },
  chipLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.muted,
    marginBottom: 8,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  card: {
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    padding: 14,
    marginBottom: 10,
    ...theme.shadow.card,
  },
  cardSelected: { borderWidth: 2, borderColor: theme.colors.water.primary },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  count: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  capacity: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },
  recChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(46,158,122,0.12)',
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  recText: {
    fontSize: 9,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.success,
  },
  barWrap: { marginTop: 12, alignItems: 'center' },
  legendRow: { marginTop: 10, gap: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
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
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.faint,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SizingScreen;
