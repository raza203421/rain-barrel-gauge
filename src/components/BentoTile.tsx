import React, { useCallback } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import theme from '../constants/theme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import type { IconCmp } from './PrimaryButton';

type Props = {
  Icon: IconCmp;
  iconColor: string;
  value: string;
  label: string;
  onPress: () => void;
  height?: number;
  /** Lay the icon / value / label out in a row instead of a column. */
  wide?: boolean;
  caption?: string;
  /** Optional sprite shown at the end of a wide tile (never absolute). */
  decor?: ImageSourcePropType;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** M3 bento hub tile. Fixed height + width:'100%' - never flex inside flex. */
export function BentoTile({
  Icon,
  iconColor,
  value,
  label,
  onPress,
  height = 104,
  wide = false,
  caption,
  decor,
}: Props) {
  const scale = useAnimatedValue(1);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label + ' ' + value}
      style={[styles.press, { height }]}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={wide ? styles.rowBody : styles.colBody}>
          <View style={[styles.iconWrap, { backgroundColor: iconColor + '1A' }]}>
            <Icon size={22} color={iconColor} strokeWidth={2} />
          </View>
          <View style={wide ? styles.rowText : styles.colText}>
            <Text style={styles.value} numberOfLines={1}>
              {value}
            </Text>
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
            {caption ? (
              <Text style={styles.caption} numberOfLines={1}>
                {caption}
              </Text>
            ) : null}
          </View>
          {wide && decor ? <Image source={decor} style={styles.decor} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line.border,
    padding: 14,
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  colBody: { justifyContent: 'space-between', flex: 1 },
  rowBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colText: {},
  rowText: { flex: 1 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginTop: 6,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  decor: { width: 44, height: 44, resizeMode: 'contain' },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    color: theme.colors.text.faint,
    marginTop: 2,
  },
});

export default React.memo(BentoTile);
