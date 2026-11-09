import { useCallback } from 'react';
import { Platform, Vibration } from 'react-native';
import { useHarvest } from '../game/store';

/**
 * Gentle confirmation buzz. Requires android.permission.VIBRATE,
 * which is declared in android/app/src/main/AndroidManifest.xml.
 */
export function useHaptic() {
  const enabled = useHarvest(s => s.haptics);

  return useCallback(
    (ms: number = 12) => {
      if (!enabled || Platform.OS === 'web') {
        return;
      }
      try {
        Vibration.vibrate(ms);
      } catch (e) {
        // haptics are a nicety - never let them break an interaction
      }
    },
    [enabled],
  );
}

export default useHaptic;
