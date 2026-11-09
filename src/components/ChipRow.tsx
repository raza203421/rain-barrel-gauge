import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type ChipItem = { id: string; label: string };

type Props = {
  items: ReadonlyArray<ChipItem>;
  activeId: string;
  onSelect: (id: string) => void;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Chip({
  item,
  active,
  height,
  onSelect,
}: {
  item: ChipItem;
  active: boolean;
  height: number;
  onSelect: (id: string) => void;
}) {
  const handle = useCallback(() => onSelect(item.id), [item.id, onSelect]);
  return (
    <Pressable
      onPress={handle}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.label}
      style={[styles.chip, { height }, active ? styles.chipActive : styles.chipIdle]}>
      <Text
        style={[styles.label, active ? styles.labelActive : styles.labelIdle]}
        numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

export function ChipRow({ items, activeId, onSelect, height = 40 }: Props) {
  return (
    <View style={styles.row}>
      {items.map(item => (
        <Chip
          key={item.id}
          item={item}
          active={item.id === activeId}
          height={height}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    borderRadius: theme.radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 6,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface.sunk,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: 'rgba(29,111,140,0.12)',
    borderColor: theme.colors.water.primary,
  },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  labelIdle: { color: theme.colors.text.muted, fontWeight: '600' },
  labelActive: { color: theme.colors.water.primary, fontWeight: '700' },
});

export default React.memo(ChipRow);
