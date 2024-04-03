import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import {
  ImageLibraryOptions,
} from 'react-native-image-picker';

import api from '../../src/services/api';
import Profile from '../../src/pages/Profile';
import factory from '../utils/factory';

interface User {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockedGoBack,
    }),
  };
});

const mockedUpdateUser = jest.fn();
jest.mock('../../src/hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {},
      updateUser: mockedUpdateUser,
    }),
  };
});

const mockLaunchImageLibrary = jest.fn();
jest.mock('react-native-image-picker', () => {
  return {
    __esModule: true,
    default: {
      launchImageLibrary: (options: ImageLibraryOptions) => mockLaunchImageLibrary(options)
    }
  };
});

describe('Profile page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    jest.resetAllMocks()
  });

  it('should be able to update your user', async () => {
    const user = await factory.attrs<User>('User');
    const newPassword = faker.internet.password();

    const alert = jest.spyOn(Alert, 'alert');
    apiMock.onPut('profile').reply(200, {
      name: user.name,
      email: user.email,
      old_password: user.password,
      password: newPassword,
      password_confirmation: newPassword,
    });

    const { getByPlaceholderText } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText('Nome'), user.name);
    fireEvent(getByPlaceholderText('Nome'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent(getByPlaceholderText('Email'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Senha atual'), user.password);
    fireEvent(getByPlaceholderText('Senha atual'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Nova senha'), newPassword);
    fireEvent(getByPlaceholderText('Nova senha'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Confirmar senha'), newPassword);

    await act(async () => {
      fireEvent(getByPlaceholderText('Confirmar senha'), 'onSubmitEditing');
    });

    expect(mockedUpdateUser).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      old_password: user.password,
      password: newPassword,
      password_confirmation: newPassword,
    });
    expect(alert).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be able to update your user without change password', async () => {
    const user = await factory.attrs<User>('User');

    const alert = jest.spyOn(Alert, 'alert');
    apiMock.onPut('profile').reply(200, {
      name: user.name,
      email: user.email,
    });

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText('Nome'), user.name);
    fireEvent(getByPlaceholderText('Nome'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent(getByPlaceholderText('Email'), 'onSubmitEditing');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedUpdateUser).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
    });
    expect(alert).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be not able to update your user with invalid data', async () => {
    const user = await factory.attrs<User>('User');
    const newPassword = faker.internet.password();

    const alert = jest.spyOn(Alert, 'alert');
    apiMock.onPut('profile').reply(200, {
      name: user.name,
      email: user.email,
      old_password: user.password,
      password: newPassword,
      password_confirmation: newPassword,
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <Profile />,
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), '');
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Senha atual'), user.password);
    fireEvent.changeText(getByPlaceholderText('Confirmar senha'), newPassword);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(alert).not.toHaveBeenCalled();
    expect(mockedGoBack).not.toHaveBeenCalled();
    expect(getByText('Nome obrigatório')).toBeTruthy();
    expect(getByText('Digite um email válido')).toBeTruthy();
    expect(getByText('Campo obrigatório')).toBeTruthy();
    expect(getByText('Confirmação incorreta')).toBeTruthy();
  });

  it('should be not able to update your user with network error', async () => {
    const user = await factory.attrs<User>('User');
    const newPassword = faker.internet.password();

    const alert = jest.spyOn(Alert, 'alert');
    apiMock.onPut('profile').reply(400);

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText('Nome'), user.name);
    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent.changeText(getByPlaceholderText('Senha atual'), user.password);
    fireEvent.changeText(getByPlaceholderText('Nova senha'), newPassword);
    fireEvent.changeText(getByPlaceholderText('Confirmar senha'), newPassword);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'Erro na atualização',
      'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
    );
    expect(mockedGoBack).not.toHaveBeenCalled();
  });

  it('should be able to back to previous screen', async () => {
    const { getByTestId } = render(<Profile />);

    fireEvent.press(getByTestId('goback'));

    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be able to select a new avatar', async () => {
    apiMock.onPatch('/users/avatar').reply(200, { success: true });

    mockLaunchImageLibrary.mockResolvedValueOnce({
      didCancel: false,
      assets: [{
        uri: faker.system.filePath()
      }]
    })

    const { getByTestId } = render(<Profile />);
    await act(async () => {
      fireEvent.press(getByTestId('avatar'));
    });

    expect(mockedUpdateUser).toHaveBeenCalledWith({ success: true });
  });

  it('should not be able to select a new avatar', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    const errorMessage = 'Unknown error'
    mockLaunchImageLibrary.mockResolvedValueOnce({
      didCancel: false,
      errorMessage
    })

    const { getByTestId } = render(<Profile />);
    await act(async () => {
      fireEvent.press(getByTestId('avatar'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(`Erro ao atualizar seu avatar: ${errorMessage}`);
  });

  it('should be able to cancel the avatar change', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    alert.mockClear();
    mockLaunchImageLibrary.mockResolvedValueOnce({
      didCancel: true,
    })

    const { getByTestId } = render(<Profile />);
    await act(async () => {
      fireEvent.press(getByTestId('avatar'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(alert).not.toHaveBeenCalled();
  });
});
