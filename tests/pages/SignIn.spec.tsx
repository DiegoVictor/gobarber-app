import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';

import SignIn from '../../src/pages/SignIn';
import factory from '../utils/factory';

interface User {
  email: string;
  password: string;
}

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const mockedSignIn = jest.fn();
jest.mock('../../src/hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

describe('SignIn page', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
  });

  it('should be able to login', async () => {
    const user = await factory.attrs<User>('User');
    const { getByPlaceholderText } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent(getByPlaceholderText('Email'), 'onSubmitEditing');

    fireEvent.changeText(getByPlaceholderText('Senha'), user.password);

    await act(async () => {
      fireEvent(getByPlaceholderText('Senha'), 'onSubmitEditing');
    });

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: user.email,
      password: user.password,
    });
  });

  it('should be not able to login with invalid data', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedSignIn).not.toHaveBeenCalled();
    expect(getByText('Digite um email válido')).toBeTruthy();
    expect(getByText('Senha obrigatória')).toBeTruthy();
  });

  it('should be not able to login with network error', async () => {
    const user = await factory.attrs<User>('User');
    const alert = jest.spyOn(Alert, 'alert');

    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent.changeText(getByPlaceholderText('Senha'), user.password);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: user.email,
      password: user.password,
    });
    expect(alert).toHaveBeenCalledWith(
      'Erro na autenticação',
      'Ocorreu um erro ao fazer login, cheque as credenciais.',
    );
  });

  it('should be able to navigate to sign up screen', async () => {
    Platform.OS = 'android';
    const { getByTestId } = render(<SignIn />);

    fireEvent.press(getByTestId('signup'));

    expect(mockedNavigate).toHaveBeenCalledWith('SignUp');
  });

  it('should be able to navigate to forgot password screen', async () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<SignIn />);

    fireEvent.press(getByTestId('forgot-password'));

    expect(mockedNavigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
