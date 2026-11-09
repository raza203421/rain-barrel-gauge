import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import LogRow from '../components/LogRow';
import StepperField from '../components/StepperField';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import assets from '../assets';
import theme from '../constants/theme';
import { saveReading, selCapacity, selEntries, useHarvest } from '../game/store';
import { useHaptic } from '../hooks/useHaptic';
import { formatVolume } from '../utils/format';
import type { LogEntry } from '../game/store';

type Props = { onBack: () => void };

export function LogScreen({ onBack }: Props) {
  const entries = useHarvest(selEntries);
  const stored = useHarvest(s => s.stored);
  const capacity = useHarvest(selCapacity);
  const units = useHarvest(s => s.units);
  const haptic = useHaptic();

  const [reading, setReading] = useState(Math.round(stored));

  const onSave = useCallback(() => {
    haptic(12);
    saveReading(reading);
  }, [haptic, reading]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LogEntry>) => (
      <LogRow
        day={item.day}
        month={item.month}
        reading={item.reading}
        delta={item.delta}
        source={item.source}
        units={units}
      />
    ),
    [units],
  );

  const keyExtractor = useCallback((item: LogEntry) => item.id, []);

  return (
    <AppShell variant="game">
      <ScreenHeader title="LEVEL LOG" onBack={onBack} />

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            sprite={assets.sprite4}
            title="NO READINGS YET"
            caption="Log a storm or save the level you read off the barrel."
          />
        }
      />

      <View style={styles.panel}>
        <StepperField
          label="BARREL READING"
          value={reading}
          display={formatVolume(reading, units)}
          step={5}
          fastStep={25}
          min={0}
          max={capacity}
          onChange={setReading}
          onTick={haptic}
        />
        <View style={styles.gap} />
        <PrimaryButton label="SAVE READING" Icon={Check} onPress={onSave} height={56} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
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
  gap: { height: 12 },
});

export default LogScreen;
