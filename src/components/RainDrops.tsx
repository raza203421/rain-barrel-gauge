import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import assets from '../assets';
import { DROP_COUNT, DROP_FALL_MS, DROP_STAGGER_MS } from '../constants/config';
import { useAnimatedValues } from '../hooks/useAnimatedValue';

type Props = {
  /** Increment to replay the fall. */
  trigger: number;
  width: number;
  distance: number;
  count?: number;
};

/**
 * Droplets spilling from the gutter into the barrel mouth. Transform +
 * opacity only, so the whole burst runs on the native driver.
 */
export function RainDrops({ trigger, width, distance, count = DROP_COUNT }: Props) {
  const progress = useAnimatedValues(count, 0);

  const lanes = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      out.push(Math.round((width / (count + 1)) * (i + 1)) - 7);
    }
    return out;
  }, [count, width]);

  useEffect(() => {
    if (trigger <= 0) {
      return;
    }
    progress.forEach(v => v.setValue(0));
    const anim = Animated.stagger(
      DROP_STAGGER_MS,
      progress.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: DROP_FALL_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, [progress, trigger]);

  return (
    <>
      {progress.map((v, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.drop,
            {
              left: lanes[i],
              opacity: v.interpolate({
                inputRange: [0, 0.15, 0.75, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateY: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, distance],
                  }),
                },
              ],
            },
          ]}>
          <Image source={assets.sprite3} style={styles.img} />
        </Animated.View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  drop: { position: 'absolute', top: 0, width: 14, height: 20 },
  img: { width: 14, height: 20, resizeMode: 'contain' },
});

export default React.memo(RainDrops);
