/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

import api from '../../src/services/api';
import factory from '../utils/factory';
import { AuthContextData, AuthProvider, useAuth } from '../../src/hooks/auth';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar_url: string;
}

describe('Auth hook', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to sign in', async () => {
    const user = await factory.attrs<User>('User');
    const token = faker.string.alphanumeric(16);

    jest.spyOn(AsyncStorage, 'multiGet').mockImplementationOnce(async () => {
      return [
        ['', ''],
        ['', ''],
      ];
    });

    apiMock.onPost('sessions').reply(200, { user, token });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn({
        email: user.email,
        password: user.password,
      });
    });

    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
  });

  it('should be able to sign out', async () => {
    const user = await factory.attrs<User>('User');
    const token = faker.string.alphanumeric(16);

    jest.spyOn(AsyncStorage, 'multiGet').mockImplementationOnce(async () => {
      return [
        ['', token],
        ['', JSON.stringify(user)],
      ];
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      '@GoBarber:token',
      '@GoBarber:user',
    ]);
  });

  it('should be able to update user', async () => {
    const [user, updatedUser] = await factory.attrsMany<User>('User', 2);
    const token = faker.string.alphanumeric(16);

    jest.spyOn(AsyncStorage, 'multiGet').mockImplementationOnce(async () => {
      return [
        ['', token],
        ['', JSON.stringify(user)],
      ];
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.updateUser(updatedUser);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(updatedUser),
    );
  });
});
