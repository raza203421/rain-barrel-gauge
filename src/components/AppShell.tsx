import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type ShellVariant = 'menu' | 'game' | 'storm' | 'result';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

const OVERLAYS: Record<ShellVariant, string[]> = {
  // Every screen shares bg_game and is told apart by its overlay (rule #14).
  menu: ['rgba(244,250,252,0.90)', 'rgba(227,241,246,0.88)', 'rgba(201,226,234,0.92)'],
  game: ['rgba(244,250,252,0.94)', 'rgba(230,242,247,0.90)', 'rgba(207,230,237,0.94)'],
  storm: ['rgba(10,34,44,0.92)', 'rgba(18,48,59,0.95)', 'rgba(29,111,140,0.88)'],
  result: ['rgba(29,111,140,0.90)', 'rgba(18,48,59,0.94)'],
};

const BAR_STYLE: Record<ShellVariant, 'light-content' | 'dark-content'> = {
  menu: 'dark-content',
  game: 'dark-content',
  storm: 'light-content',
  result: 'light-content',
};

/** Background layer: AI photo -> gradient wash -> colour blobs -> content. */
export function AppShell({ variant, children }: Props) {
  const dark = variant === 'storm' || variant === 'result';

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={BAR_STYLE[variant]}
      />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={OVERLAYS[variant]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            styles.blobTop,
            { backgroundColor: dark ? 'rgba(29,111,140,0.45)' : 'rgba(29,111,140,0.08)' },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.blobBottom,
            { backgroundColor: dark ? 'rgba(244,162,89,0.18)' : 'rgba(244,162,89,0.10)' },
          ]}
        />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
  bg: { flex: 1 },
  content: { flex: 1 },
  blobTop: {
    position: 'absolute',
    top: -60,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  blobBottom: {
    position: 'absolute',
    bottom: 40,
    left: -60,
    width: 190,
    height: 190,
    borderRadius: 95,
  },
});

export default AppShell;
