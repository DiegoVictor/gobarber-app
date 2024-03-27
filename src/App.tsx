import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import PublicRoute from './routes';
import AppProvider from './hooks';

const src: React.FC = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#312e38"
          translucent
        />
        <AppProvider>
          <View style={{ backgroundColor: '#312e38', flex: 1 }}>
            <PublicRoute />
          </View>
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default src;
