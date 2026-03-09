import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../pages/private/Dashboard';
import { CreatedAppointment } from '../pages/private/CreateAppointment';
import { AppointmentCreated } from '../pages/private/AppointmentCreated';
import { Profile } from '../pages/private/Profile';

export type StackParamList = {
  Dashboard: undefined;
  CreateAppointment: {
    providerId: string;
  };
  AppointmentCreated: {
    date: number;
  };
  Profile: undefined;
};

const App = createStackNavigator<StackParamList>();

export const PrivateRoutes: React.FC = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <App.Screen name="Dashboard" component={Dashboard} />
      <App.Screen name="CreateAppointment" component={CreatedAppointment} />
      <App.Screen name="AppointmentCreated" component={AppointmentCreated} />

      <App.Screen name="Profile" component={Profile} />
    </App.Navigator>
  );
};
