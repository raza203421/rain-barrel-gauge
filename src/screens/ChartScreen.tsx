import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import SeasonBars from '../components/SeasonBars';
import StatRow, { StatSpec } from '../components/StatRow';
import EmptyState from '../components/EmptyState';
import SecondaryButton from '../components/SecondaryButton';
import assets from '../assets';
import theme from '../constants/theme';
import { useHarvest } from '../game/store';
import { formatVolume } from '../utils/format';

type Props = { onBack: () => void };

function sum(values: ReadonlyArray<number>): number {
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }
  return total;
}

export function ChartScreen({ onBack }: Props) {
  const collected = useHarvest(s => s.monthlyCollected);
  const used = useHarvest(s => s.monthlyUsed);
  const units = useHarvest(s => s.units);

  const totalCollected = sum(collected);
  const totalUsed = sum(used);
  const hasData = totalCollected > 0 || totalUsed > 0;

  const cards: StatSpec[] = [
    {
      key: 'collected',
      value: formatVolume(totalCollected, units),
      label: 'COLLECTED',
      color: theme.colors.water.primary,
      amount: totalCollected,
    },
    {
      key: 'used',
      value: formatVolume(totalUsed, units),
      label: 'USED',
      color: theme.colors.water.shell,
      amount: totalUsed,
    },
  ];

  return (
    <AppShell variant="game">
      <ScreenHeader title="SEASON CHART" onBack={onBack} />

      <View style={styles.body}>
        {hasData ? (
          <>
            <View style={styles.boardWrap}>
              <SeasonBars collected={collected} used={used} />
            </View>
            <Text style={styles.caption} numberOfLines={1}>
              RAIN CAUGHT PER MONTH
            </Text>
            <View style={styles.stats}>
              <StatRow cards={cards} />
            </View>
          </>
        ) : (
          <EmptyState
            sprite={assets.sprite4}
            title="NO SEASON DATA"
            caption="Log your first storm and the twelve monthly bars start filling in."
          />
        )}
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="BACK TO HUB" onPress={onBack} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  boardWrap: { alignItems: 'center' },
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: theme.colors.text.faint,
    marginTop: 14,
  },
  stats: { width: '100%', marginTop: 16 },
  footer: { paddingHorizontal: 16, paddingBottom: 20 },
});

export default ChartScreen;
