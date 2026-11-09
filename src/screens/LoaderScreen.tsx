import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppShell from '../components/AppShell';
import assets from '../assets';
import theme from '../constants/theme';
import {
  LOADER_BAR_W,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  LOADER_PROGRESS_MS,
  SCREEN_H,
  SCREEN_W,
} from '../constants/config';
import { useAnimatedValue, useAnimatedValues } from '../hooks/useAnimatedValue';

type Props = { onDone: () => void };

const STREAKS = 14;

/**
 * Deliberately the visual opposite of the pale Menu: a night-storm overlay,
 * falling rain streaks, the brand disc and a thin progress bar.
 */
export function LoaderScreen({ onDone }: Props) {
  const fade = useAnimatedValue(1);
  const discScale = useAnimatedValue(0.82);
  const discOpacity = useAnimatedValue(0);
  const breathe = useAnimatedValue(0);
  const progress = useAnimatedValue(0);
  const streaks = useAnimatedValues(STREAKS, 0);
  const doneRef = useRef(onDone);

  doneRef.current = onDone;

  const lanes = useMemo(
    () =>
      Array.from({ length: STREAKS }, (_, i) => ({
        left: Math.round(((SCREEN_W - 10) / STREAKS) * i + (i % 3) * 7),
        duration: 900 + ((i * 137) % 700),
        delay: (i * 211) % 1200,
      })),
    [],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.spring(discScale, {
        toValue: 1,
        tension: 46,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(discOpacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();

    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    breath.start();

    // width animation - must stay on the JS driver
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const rain = Animated.parallel(
      streaks.map((v, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(lanes[i].delay),
            Animated.timing(v, {
              toValue: 1,
              duration: lanes[i].duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(v, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );
    rain.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      breath.stop();
      rain.stop();
    };
  }, [breathe, discOpacity, discScale, fade, lanes, progress, streaks]);

  const discTransform = [
    { scale: discScale },
    {
      scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }),
    },
  ];

  return (
    <AppShell variant="storm">
      <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="box-none">
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {streaks.map((v, i) => (
            <Animated.View
              key={i}
              style={[
                styles.streak,
                {
                  left: lanes[i].left,
                  transform: [
                    {
                      translateY: v.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-40, SCREEN_H],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.center} pointerEvents="none">
          <View style={styles.glow} />
          <Animated.View
            style={[styles.disc, { opacity: discOpacity, transform: discTransform }]}>
            <Image source={assets.logo} style={styles.logo} />
          </Animated.View>

          <Text style={styles.brandTop}>RAIN BARREL</Text>
          <Text style={styles.brandBottom}>GAUGE</Text>
          <Text style={styles.tagline}>CATCH IT · STORE IT · GROW WITH IT</Text>
        </View>

        <View style={styles.footer} pointerEvents="none">
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFillWrap,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, LOADER_BAR_W],
                  }),
                },
              ]}>
              <LinearGradient
                colors={[
                  theme.gradients.progress[0],
                  theme.gradients.progress[1],
                  theme.gradients.progress[2],
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.barFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  streak: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 22,
    borderRadius: 1,
    backgroundColor: 'rgba(196,222,230,0.35)',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(29,111,140,0.45)',
    top: -40,
  },
  disc: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: 'rgba(234,244,247,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(196,222,230,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logo: { width: 148, height: 148, resizeMode: 'contain' },
  brandTop: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  brandBottom: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 7,
    color: theme.colors.accent.base,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  tagline: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.onDarkMuted,
    marginTop: 12,
  },
  footer: { position: 'absolute', bottom: 72, alignItems: 'center' },
  barTrack: {
    width: 212,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(234,244,247,0.16)',
    overflow: 'hidden',
  },
  barFillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { width: '100%', height: 6 },
  loading: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(196,222,230,0.62)',
    marginTop: 10,
  },
});

export default LoaderScreen;
