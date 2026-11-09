import { useRef } from 'react';
import { Animated } from 'react-native';

/** Animated.Value that survives re-renders (rule #8 - useRef, never useState). */
export function useAnimatedValue(initial: number): Animated.Value {
  const ref = useRef<Animated.Value | null>(null);
  if (ref.current === null) {
    ref.current = new Animated.Value(initial);
  }
  return ref.current;
}

/** A fixed-length pool of Animated.Values (rain streaks, droplets, bars). */
export function useAnimatedValues(count: number, initial: number): Animated.Value[] {
  const ref = useRef<Animated.Value[] | null>(null);
  if (ref.current === null || ref.current.length !== count) {
    const next: Animated.Value[] = [];
    for (let i = 0; i < count; i++) {
      next.push(new Animated.Value(initial));
    }
    ref.current = next;
  }
  return ref.current;
}

export default useAnimatedValue;
