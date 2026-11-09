import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import ChipRow from '../components/ChipRow';
import StepperField from '../components/StepperField';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import assets from '../assets';
import theme from '../constants/theme';
import { AREA_MAX, AREA_MIN, SURFACES, SurfaceId, surfaceCoeff } from '../constants/config';
import { addSection, removeSection, selRoofArea, selSections, useHarvest } from '../game/store';
import { useHaptic } from '../hooks/useHaptic';
import type { RoofSection } from '../game/harvest';

type Props = { onBack: () => void };

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CHIPS = SURFACES.map(s => ({ id: s.id, label: s.label }));

type RowProps = {
  id: string;
  name: string;
  area: number;
  surface: SurfaceId;
  onDelete: (id: string) => void;
};

const SectionRow = React.memo(function SectionRow({
  id,
  name,
  area,
  surface,
  onDelete,
}: RowProps) {
  const remove = useCallback(() => onDelete(id), [id, onDelete]);
  return (
    <View style={styles.card}>
      <View style={styles.cardText}>
        <Text style={styles.cardName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.cardArea} numberOfLines={1}>
          {area + ' m2'}
        </Text>
      </View>

      <View style={styles.surfaceChip}>
        <Text style={styles.surfaceChipText} numberOfLines={1}>
          {surface}
        </Text>
      </View>

      <Text style={styles.coeff} numberOfLines={1}>
        {surfaceCoeff(surface).toFixed(2)}
      </Text>

      <Pressable
        onPress={remove}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Delete ' + name}
        style={styles.del}>
        <Trash2 size={20} color={theme.colors.accent.deep} strokeWidth={2} />
      </Pressable>
    </View>
  );
});

export function RoofScreen({ onBack }: Props) {
  const sections = useHarvest(selSections);
  const roofArea = useHarvest(selRoofArea);
  const haptic = useHaptic();

  const [area, setArea] = useState(40);
  const [surface, setSurface] = useState<SurfaceId>('SHINGLE');

  const onDelete = useCallback(
    (id: string) => {
      haptic(10);
      removeSection(id);
    },
    [haptic],
  );

  const onAdd = useCallback(() => {
    haptic(12);
    addSection(area, surface);
  }, [area, haptic, surface]);

  const onSelectSurface = useCallback((id: string) => {
    setSurface(id as SurfaceId);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RoofSection>) => (
      <SectionRow
        id={item.id}
        name={item.name}
        area={item.area}
        surface={item.surface}
        onDelete={onDelete}
      />
    ),
    [onDelete],
  );

  const keyExtractor = useCallback((item: RoofSection) => item.id, []);

  return (
    <AppShell variant="game">
      <ScreenHeader title="ROOF SECTIONS" onBack={onBack} />

      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            sprite={assets.sprite2}
            title="NO ROOF SECTIONS"
            caption="Add the first roof section below to start estimating your catch."
          />
        }
      />

      <View style={styles.totalStrip}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue} numberOfLines={1}>
          {roofArea + ' m2'}
        </Text>
      </View>

      <View style={styles.panel}>
        <StepperField
          label="SECTION AREA"
          value={area}
          display={area + ' m2'}
          step={1}
          fastStep={5}
          min={AREA_MIN}
          max={AREA_MAX}
          onChange={setArea}
          onTick={haptic}
        />
        <View style={styles.gapSm} />
        <ChipRow items={CHIPS} activeId={surface} onSelect={onSelectSurface} height={40} />
        <View style={styles.gapMd} />
        <PrimaryButton label="ADD SECTION" Icon={Plus} onPress={onAdd} height={56} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...theme.shadow.card,
  },
  cardText: { flex: 1 },
  cardName: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  cardArea: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },
  surfaceChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: theme.colors.surface.sunk,
    borderWidth: 1,
    borderColor: theme.colors.line.strong,
  },
  surfaceChipText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  coeff: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    color: theme.colors.text.faint,
    fontVariant: ['tabular-nums'],
  },
  del: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,162,89,0.12)',
  },
  totalStrip: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: theme.radius.chip,
    backgroundColor: 'rgba(29,111,140,0.10)',
    borderWidth: 1,
    borderColor: theme.colors.line.strong,
  },
  totalLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  totalValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
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
  gapSm: { height: 10 },
  gapMd: { height: 12 },
});

export default RoofScreen;
