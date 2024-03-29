import React, { PropsWithChildren } from 'react';

import { AuthProvider } from './auth';

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
