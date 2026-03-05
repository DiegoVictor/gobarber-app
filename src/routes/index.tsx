import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PublicRoutes } from './public.routes';
import { PrivateRoutes } from './private.routes';
import { useAuth } from '../hooks/auth';

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return user ? <PrivateRoutes /> : <PublicRoutes />;
};
