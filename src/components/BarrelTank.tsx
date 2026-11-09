import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';
import {
  TANK_BORDER,
  TANK_H,
  TANK_MAX_W,
  TANK_PAD,
  TANK_SHELL_H,
  TANK_W,
} from '../constants/config';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import WaveSurface from './WaveSurface';
import { formatVolumeValue, Units } from '../utils/format';

type Props = {
  stored: number;
  capacity: number;
  ratio: number;
  units: Units;
  /** Increments on every logged storm - drives the slosh. */
  tick: number;
};

const WAVE_H = 18;

export function BarrelTank({ stored, capacity, ratio, units, tick }: Props) {
  const level = useAnimatedValue(0);
  const slosh = useAnimatedValue(0);
  const first = useRef(true);

  useEffect(() => {
    // height cannot run on the native driver - that is a silent Android crash
    Animated.timing(level, {
      toValue: Math.round(TANK_H * ratio),
      duration: theme.anim.water,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [level, ratio]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    slosh.setValue(0);
    Animated.sequence([
      Animated.spring(slosh, {
        toValue: 1,
        tension: theme.anim.slosh.tension,
        friction: theme.anim.slosh.friction,
        useNativeDriver: true,
      }),
      Animated.spring(slosh, {
        toValue: 0,
        tension: theme.anim.slosh.tension,
        friction: theme.anim.slosh.friction,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slosh, tick]);

  const overflowing = ratio >= 1;

  return (
    <View
      style={[
        styles.shell,
        overflowing ? styles.shellOverflow : null,
      ]}>
      <View style={styles.inner}>
        <View pointerEvents="none" style={[styles.hoop, { top: '22%' }]} />
        <View pointerEvents="none" style={[styles.hoop, { top: '50%' }]} />
        <View pointerEvents="none" style={[styles.hoop, { top: '78%' }]} />

        <Animated.View style={[styles.water, { height: level }]}>
          <LinearGradient
            colors={[
              theme.gradients.water[0],
              theme.gradients.water[1],
              theme.gradients.water[2],
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.waveLane,
              {
                transform: [
                  {
                    translateY: slosh.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -7],
                    }),
                  },
                ],
              },
            ]}>
            <WaveSurface width={TANK_W} height={WAVE_H} />
          </Animated.View>
        </Animated.View>

        {overflowing ? (
          <View pointerEvents="none" style={styles.rimBand} />
        ) : null}
        {overflowing ? (
          <View pointerEvents="none" style={styles.spillRow}>
            <Image source={assets.sprite3} style={styles.spill} />
            <Image source={assets.sprite3} style={styles.spill} />
            <Image source={assets.sprite3} style={styles.spill} />
            <Image source={assets.sprite3} style={styles.spill} />
          </View>
        ) : null}

        <View pointerEvents="none" style={styles.readout}>
          {/* The plate keeps the readout legible at EVERY water level: the
              backdrop is the ANIMATED height, so a ratio-driven colour swap
              rendered white-on-white while the column was still filling. */}
          <View style={styles.plate}>
            <Text style={[styles.value, styles.valueLight]} numberOfLines={1}>
              {formatVolumeValue(stored, units)}
            </Text>
            <Text style={[styles.caption, styles.captionLight]} numberOfLines={1}>
              {units === 'GALLONS' ? 'GALLONS STORED' : 'LITRES STORED'}
            </Text>
            {stored <= 0 ? (
              <Text style={styles.hint} numberOfLines={1}>
                ADD A STORM TO START
              </Text>
            ) : (
              <Text style={[styles.sub, styles.captionLight]} numberOfLines={1}>
                {'OF ' + capacity + ' L'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: TANK_MAX_W,
    height: TANK_SHELL_H,
    padding: TANK_PAD,
    borderWidth: TANK_BORDER,
    borderColor: theme.colors.water.shell,
    borderRadius: theme.radius.tank,
    backgroundColor: theme.colors.surface.base,
    overflow: 'hidden',
    ...theme.shadow.tank,
  },
  shellOverflow: { borderColor: theme.colors.accent.base },
  inner: {
    width: TANK_W,
    height: TANK_H,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.alt,
    justifyContent: 'flex-end',
  },
  hoop: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.line.hoop,
  },
  water: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  waveLane: { position: 'absolute', left: 0, right: 0, top: -WAVE_H + 2 },
  rimBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 10,
    backgroundColor: theme.colors.accent.base,
  },
  spillRow: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  spill: { width: 18, height: 18, resizeMode: 'contain' },
  readout: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    minWidth: Math.round(TANK_W * 0.72),
    maxWidth: TANK_W - 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    backgroundColor: 'rgba(12,44,58,0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  value: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  valueLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(8,30,40,0.55)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2.4,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  captionLight: { color: '#EAF4F7' },
  sub: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    marginTop: 4,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  hint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#C4DEE6',
    marginTop: 6,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
});

export default React.memo(BarrelTank);
