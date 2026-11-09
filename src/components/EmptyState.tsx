import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  sprite: ImageSourcePropType;
  title: string;
  caption: string;
};

/** Never an empty rounded box - a sprite, a title and a next step. */
export function EmptyState({ sprite, title, caption }: Props) {
  return (
    <View style={styles.root}>
      <Image source={sprite} style={styles.sprite} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.caption} numberOfLines={2}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  sprite: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 14 },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 6,
  },
});

export default React.memo(EmptyState);
