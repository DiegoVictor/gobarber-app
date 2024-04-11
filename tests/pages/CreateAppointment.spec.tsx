import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Platform } from 'react-native';

import CreatedAppointment from '../../src/pages/CreateAppointment';
import api from '../../src/services/api';
import factory from '../utils/factory';

interface User {
  name: string;
  email: string;
  avatar_url: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const mockedGoBack = jest.fn();
const mockedNavigate = jest.fn();
let mockedParams = {
  providerId: String(faker.number.int()),
};
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
      goBack: mockedGoBack,
    }),
    useRoute: () => ({
      params: mockedParams,
    }),
  };
});

let mockedUser = {};
jest.mock('../../src/hooks/auth', () => {
  return {
    useAuth: () => ({
      user: mockedUser,
    }),
  };
});

describe('CreateAppointment page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedNavigate.mockClear();
    mockedGoBack.mockClear();
  });

  it('should be able to go back to previous page', async () => {
    const user = await factory.attrs<User>('User');
    mockedUser = user;

    apiMock
      .onGet('providers')
      .reply(200, [])
      .onGet(`/providers/${mockedParams.providerId}/day_availability`)
      .reply(200, []);

    const { getByTestId } = render(<CreatedAppointment />);

    await waitFor(() => getByTestId('goback'));

    fireEvent.press(getByTestId('goback'));

    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be able to book an appointment', async () => {
    const user = await factory.attrs<User>('User');
    const provider = await factory.attrs<Provider>('Provider');

    mockedUser = user;
    mockedParams = {
      providerId: provider.id,
    };

    apiMock
      .onGet('providers')
      .reply(200, [provider])
      .onGet(`/providers/${provider.id}/day_availability`)
      .reply(200, [
        {
          hour: 9,
          available: true,
        },
        {
          hour: 13,
          available: true,
        },
      ])
      .onPost('appointments')
      .reply(200);

    const now = new Date();
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return now.getTime();
    });

    Platform.OS = 'android';

    const { getByTestId, getByText } = render(<CreatedAppointment />);

    await waitFor(() => getByTestId(`provider_${provider.id}`));

    await act(async () => {
      fireEvent.press(getByTestId(`provider_${provider.id}`));
    });

    const avatar = getByTestId(`provider_avatar_${provider.id}`);

    expect(avatar).toBeTruthy();
    expect(avatar.props.source.uri).toBe(provider.avatar_url);
    expect(getByText(provider.name)).toBeTruthy();

    fireEvent.press(getByTestId(`calendar`));

    await waitFor(() => getByTestId('date-picker'));
    await act(async () => {
      fireEvent(getByTestId('date-picker'), 'onChange', {
        type: 'event',
        nativeEvent: {
          timestamp: now.getTime(),
        },
      });
    });

    [9, 13].forEach(number => {
      fireEvent.press(getByTestId(`hour_${number}`));
      expect(getByTestId(`hour_text_${number}`).props.selected).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('book'));
    });

    const selectedDate = now;

    selectedDate.setHours(13);
    selectedDate.setMinutes(0);

    expect(mockedNavigate).toHaveBeenCalledWith('AppointmentCreated', {
      date: selectedDate.getTime(),
    });
  });

  it('should be able to book an appointment without change date', async () => {
    const user = await factory.attrs<User>('User');
    const provider = await factory.attrs<Provider>('Provider');

    mockedUser = user;
    mockedParams = {
      providerId: provider.id,
    };

    apiMock
      .onGet('providers')
      .reply(200, [provider])
      .onGet(`/providers/${provider.id}/day_availability`)
      .reply(200, [
        {
          hour: 9,
          available: true,
        },
      ])
      .onPost('appointments')
      .reply(200);

    const now = new Date();
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return now.getTime();
    });

    Platform.OS = 'ios';

    const { getByTestId } = render(<CreatedAppointment />);

    await waitFor(() => getByTestId(`provider_${provider.id}`));

    await act(async () => {
      fireEvent.press(getByTestId(`provider_${provider.id}`));
    });

    fireEvent.press(getByTestId(`calendar`));

    await waitFor(() => getByTestId('date-picker'));
    await act(async () => {
      fireEvent(getByTestId('date-picker'), 'onChange', {
        type: 'event',
        nativeEvent: {},
      });
    });

    fireEvent.press(getByTestId(`hour_9`));

    await act(async () => {
      fireEvent.press(getByTestId('book'));
    });

    const selectedDate = now;

    selectedDate.setHours(9);
    selectedDate.setMinutes(0);

    expect(mockedNavigate).toHaveBeenCalledWith('AppointmentCreated', {
      date: selectedDate.getTime(),
    });
  });

  it('should not be able to book an appointment with network error', async () => {
    const user = await factory.attrs<User>('User');
    const provider = await factory.attrs<Provider>('Provider');

    mockedUser = user;
    mockedParams = {
      providerId: provider.id,
    };

    apiMock
      .onGet('providers')
      .reply(200, [provider])
      .onGet(`/providers/${provider.id}/day_availability`)
      .reply(200, [
        {
          hour: 9,
          available: true,
        },
      ])
      .onPost('appointments')
      .reply(400);

    const now = new Date();
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return now.getTime();
    });

    const alert = jest.spyOn(Alert, 'alert');

    const { getByTestId } = render(<CreatedAppointment />);

    await waitFor(() => getByTestId(`provider_${provider.id}`));

    await act(async () => {
      fireEvent.press(getByTestId(`provider_${provider.id}`));
    });

    fireEvent.press(getByTestId(`hour_9`));

    await act(async () => {
      fireEvent.press(getByTestId('book'));
    });

    expect(alert).toHaveBeenCalledWith(
      'Erro ao criar agendamento',
      'Ocorreu um erro ao tentar criar o agendamento, tente novamente!',
    );
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
