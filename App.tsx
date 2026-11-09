/**
 * RainBarrelGauge - offline rainwater harvesting planner.
 * App.tsx is the screen state-machine only; all gameplay lives in src/.
 */
import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import RoofScreen from './src/screens/RoofScreen';
import SizingScreen from './src/screens/SizingScreen';
import LogScreen from './src/screens/LogScreen';
import ChartScreen from './src/screens/ChartScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import theme from './src/constants/theme';
import type { Screen } from './src/navigation';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');

  const go = useCallback((next: Screen) => setScreen(next), []);
  const toMenu = useCallback(() => setScreen('menu'), []);
  const toGame = useCallback(() => setScreen('game'), []);
  const toGameOver = useCallback(() => setScreen('gameover'), []);
  const toSizing = useCallback(() => setScreen('sizing'), []);

  let body: React.ReactNode = null;

  switch (screen) {
    case 'loader':
      body = <LoaderScreen onDone={toMenu} />;
      break;
    case 'menu':
      body = <MenuScreen onNavigate={go} />;
      break;
    case 'game':
      body = <GameScreen onBack={toMenu} onStormLogged={toGameOver} />;
      break;
    case 'gameover':
      body = (
        <GameOverScreen onPlayAgain={toGame} onMenu={toMenu} onSizing={toSizing} />
      );
      break;
    case 'roof':
      body = <RoofScreen onBack={toMenu} />;
      break;
    case 'sizing':
      body = <SizingScreen onBack={toMenu} />;
      break;
    case 'log':
      body = <LogScreen onBack={toMenu} />;
      break;
    case 'chart':
      body = <ChartScreen onBack={toMenu} />;
      break;
    default:
      body = <SettingsScreen onBack={toMenu} />;
      break;
  }

  return <SafeAreaView style={styles.root}>{body}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
});

export default App;
