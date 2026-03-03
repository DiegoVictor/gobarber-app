import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import RobotoSlabRegular from './assets/fonts/RobotoSlab-Regular.ttf';
import RobotoSlabMedium from './assets/fonts/RobotoSlab-Medium.ttf';
import { AppProvider } from './src/hooks';
import { View } from 'react-native';
import { AppRoutes } from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    RobotoSlabRegular,
    RobotoSlabMedium,
  });

  useEffect(() => {
    (async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [loaded]);

  if (loaded && !error) {
    return (
      <>
        <StatusBar style="light" backgroundColor="#312e38" translucent />
        <AppProvider>
          <View style={{ backgroundColor: '#312e38', flex: 1 }}>
            <AppRoutes />
          </View>
        </AppProvider>
      </>
    );
  }

  return null;
}
