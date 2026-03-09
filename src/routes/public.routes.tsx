import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from '../pages/public/SignIn';
import { SignUp } from '../pages/public/SignUp';
import { ForgotPassword } from '../pages/public/ForgotPassword';

export type StackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Auth = createStackNavigator<StackParamList>();

export const PublicRoutes: React.FC = () => {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
      <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
    </Auth.Navigator>
  );
};
