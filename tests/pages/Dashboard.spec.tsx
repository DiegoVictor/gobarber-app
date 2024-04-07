import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';

import api from '../../src/services/api';
import Dashboard from '../../src/pages/Dashboard';
import factory from '../utils/factory';
import wait from '../utils/wait';

interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const name = faker.person.fullName();
const mockedUser = {
  name,
};

jest.mock('../../src/hooks/auth', () => {
  return {
    useAuth: () => ({
      user: mockedUser,
    }),
  };
});

const apiMock = new MockAdapter(api);

describe('Dashboard page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to see the logged in user name', async () => {
    const provider = await factory.attrs<Provider>('Provider');
    apiMock.onGet('/providers').reply(200, [provider]);

    const { getByText, getByTestId } = render(<Dashboard />);

    await wait(() =>
      expect(getByTestId(`provider_${provider.id}`)).toBeTruthy(),
    );

    expect(getByText(name)).toBeTruthy();
  });

  it('should be able to navigate to profile screen', async () => {
    const provider = await factory.attrs<Provider>('Provider');
    apiMock.onGet('/providers').reply(200, [provider]);

    const { getByTestId } = render(<Dashboard />);

    await wait(() =>
      expect(getByTestId(`provider_${provider.id}`)).toBeTruthy(),
    );

    await act(async () => {
      fireEvent.press(getByTestId('profile'));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('Profile');
  });

  it('should be able to navigate to appointment creation screen', async () => {
    const provider = await factory.attrs<Provider>('Provider');

    apiMock.onGet('/providers').reply(200, [provider]);

    const { getByTestId } = render(<Dashboard />);

    await wait(() =>
      expect(getByTestId(`provider_${provider.id}`)).toBeTruthy(),
    );

    fireEvent.press(getByTestId(`provider_${provider.id}`));

    expect(mockedNavigate).toHaveBeenCalledWith('CreateAppointment', {
      providerId: provider.id,
    });
  });
});
