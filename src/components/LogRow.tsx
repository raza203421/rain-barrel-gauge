import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { formatDate, formatVolume, Units } from '../utils/format';
import type { LogSource } from '../game/store';

type Props = {
  day: number;
  month: number;
  reading: number;
  delta: number;
  source: LogSource;
  units: Units;
};

const SOURCE_COLOR: Record<LogSource, string> = {
  STORM: theme.colors.water.primary,
  MANUAL: theme.colors.text.muted,
  USE: theme.colors.accent.deep,
};

/** Primitive props only - keeps memo() comparison shallow in the FlatList. */
export function LogRow({ day, month, reading, delta, source, units }: Props) {
  const up = delta >= 0;
  const deltaColor = up ? theme.colors.success : theme.colors.accent.base;

  return (
    <View style={styles.row}>
      <View style={styles.dateCol}>
        <Text style={styles.date} numberOfLines={1}>
          {formatDate(day, month)}
        </Text>
        <View style={[styles.tag, { borderColor: SOURCE_COLOR[source] + '55' }]}>
          <Text style={[styles.tagText, { color: SOURCE_COLOR[source] }]}>
            {source}
          </Text>
        </View>
      </View>

      <Text style={styles.reading} numberOfLines={1}>
        {formatVolume(reading, units)}
      </Text>

      <View style={[styles.delta, { backgroundColor: deltaColor + '1A' }]}>
        <Text style={[styles.deltaText, { color: deltaColor }]} numberOfLines={1}>
          {(up ? '+' : '') + Math.round(delta)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...theme.shadow.card,
  },
  dateCol: { width: 92 },
  date: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 9, lineHeight: 12, fontWeight: '800', letterSpacing: 1.2 },
  reading: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.water.primary,
    fontVariant: ['tabular-nums'],
  },
  delta: {
    minWidth: 56,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  deltaText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(LogRow);
