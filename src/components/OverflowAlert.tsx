import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Droplets } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = { litres: number };

/** Rendered only when litres > 0 - never an empty band (rule #13). */
export function OverflowAlert({ litres }: Props) {
  if (litres <= 0) {
    return null;
  }
  return (
    <View style={styles.band}>
      <Droplets size={20} color={theme.colors.accent.deep} strokeWidth={2} />
      <Text style={styles.text} numberOfLines={2}>
        {Math.round(litres) + ' L SPILLED - CONSIDER ANOTHER BARREL'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent.soft,
    borderWidth: 1,
    borderColor: theme.colors.accent.base,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.accent.deep,
  },
});

export default React.memo(OverflowAlert);
