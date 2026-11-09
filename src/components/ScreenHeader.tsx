import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_PAD_TOP } from '../constants/config';

type Props = {
  title: string;
  /** Small label above the title (brand line on the hub). */
  eyebrow?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
  /** Centre the title block (used on the result screen). */
  centered?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The one header every screen uses - only the slots change (menu brand badge,
 * game capacity pill, plain back arrow). Keeps padding/typography identical
 * across all nine screens.
 */
export function ScreenHeader({
  title,
  eyebrow,
  onBack,
  rightSlot,
  leftSlot,
  tone = 'light',
  centered = false,
}: Props) {
  const dark = tone === 'dark';
  const titleColor = dark ? theme.colors.text.onDark : theme.colors.text.primary;
  const eyebrowColor = dark ? theme.colors.text.onDarkMuted : theme.colors.text.muted;

  return (
    <View
      style={[
        styles.root,
        dark ? styles.rootDark : styles.rootLight,
        centered ? styles.rootCentered : null,
      ]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [
              styles.back,
              dark ? styles.backDark : styles.backLight,
              pressed ? styles.backPressed : null,
            ]}>
            <ChevronLeft
              size={22}
              color={dark ? theme.colors.text.onDark : theme.colors.water.primary}
              strokeWidth={2}
            />
          </Pressable>
        ) : null}
        {leftSlot ?? null}
      </View>

      <View style={[styles.titleWrap, centered ? styles.titleWrapCentered : null]}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: eyebrowColor }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.sideRight}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_PAD_TOP,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  rootLight: {
    backgroundColor: theme.colors.surface.header,
    borderBottomColor: theme.colors.line.divider,
  },
  rootDark: {
    backgroundColor: 'rgba(10,34,44,0.28)',
    borderBottomColor: 'rgba(196,222,230,0.18)',
  },
  rootCentered: { justifyContent: 'center' },
  side: { minWidth: 44, flexDirection: 'row', alignItems: 'center' },
  sideRight: { minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  back: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backLight: {
    backgroundColor: theme.colors.surface.sunk,
    borderColor: theme.colors.line.strong,
  },
  backDark: {
    backgroundColor: 'rgba(234,244,247,0.12)',
    borderColor: 'rgba(196,222,230,0.26)',
  },
  backPressed: { opacity: 0.6 },
  titleWrap: { flex: 1, paddingHorizontal: 10, justifyContent: 'center' },
  titleWrapCentered: { alignItems: 'center' },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default React.memo(ScreenHeader);
