import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../constants/theme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';

type Props = {
  width: number;
  height?: number;
  /** ms for one full loop of the idle slosh. */
  speed?: number;
};

const OVERHANG = 40;

function sinePath(w: number, h: number, amp: number, phase: number): string {
  const steps = 48;
  let d = 'M0,' + (amp + Math.sin(phase) * amp).toFixed(2);
  for (let i = 1; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = amp + Math.sin(phase + (i / steps) * Math.PI * 4) * amp;
    d += ' L' + x.toFixed(2) + ',' + y.toFixed(2);
  }
  d += ' L' + w.toFixed(2) + ',' + h + ' L0,' + h + ' Z';
  return d;
}

/**
 * Two stacked sine paths riding on the water surface. Only `translateX`
 * animates, so the loop stays on the native driver.
 */
export function WaveSurface({ width, height = 18, speed = 2600 }: Props) {
  const shift = useAnimatedValue(0);
  const w = width + OVERHANG;

  const front = useMemo(() => sinePath(w, height, 5, 0), [w, height]);
  const back = useMemo(() => sinePath(w, height, 4, Math.PI / 2), [w, height]);

  useEffect(() => {
    shift.setValue(0);
    const loop = Animated.loop(
      Animated.timing(shift, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [shift, speed]);

  const translateX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [-OVERHANG, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, { width: w, height, transform: [{ translateX }] }]}>
      <Svg width={w} height={height}>
        <Path d={back} fill={theme.colors.water.foam} fillOpacity={0.5} />
        <Path d={front} fill={theme.colors.water.wave} fillOpacity={0.9} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, top: 0 },
});

export default React.memo(WaveSurface);
