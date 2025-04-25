import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Accueil from './accueil';
import SendNote from './sendNote';
import NoteBox from './noteBox';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="SendNote" component={SendNote} />
        <Stack.Screen name="NoteBox" component={NoteBox} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
