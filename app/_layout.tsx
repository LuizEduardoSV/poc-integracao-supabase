import { useFonts } from 'expo-font';
import React from 'react';
import AppNavigator from '../src/AppNavigator';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return <AppNavigator />;
}
