import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';

export type IconCmp = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  disabled?: boolean;
  height?: number;
  colors?: string[];
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/**
 * Pressable is the PARENT, the Animated.View lives inside it - the reverse
 * order eats onPress on Android release builds.
 */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled = false,
  height = 60,
  colors,
}: Props) {
  const scale = useAnimatedValue(1);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, disabled ? styles.disabled : null]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors ?? [theme.gradients.button[0], theme.gradients.button[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color="#FFFFFF" strokeWidth={2} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: theme.radius.button,
    ...theme.shadow.button,
  },
  disabled: { opacity: 0.55 },
  fill: { width: '100%', height: '100%', borderRadius: theme.radius.button },
  grad: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});

export default React.memo(PrimaryButton);
