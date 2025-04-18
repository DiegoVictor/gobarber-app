import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../../src/pages/SignUp';
import factory from '../utils/factory';
import api from '../../src/services/api';

interface User {
  name: string;
  email: string;
  password: string;
}

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockedGoBack,
    }),
  };
});

describe('SignUp page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedGoBack.mockClear();
  });

  it('should be able to register yourself', async () => {
    const user = await factory.attrs<User>('User');
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onPost('users').reply(200);

    const { getByPlaceholderText, getByTestId, debug } = render(<SignUp />);

    fireEvent.changeText(getByPlaceholderText('Nome'), user.name);
    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent.changeText(getByPlaceholderText('Senha'), user.password);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(alert).toHaveBeenCalledWith(
      'Cadastro realizado com sucesso!',
      'Você já pode fazer login na aplicação.',
    );
    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be not able to register yourself with invalid data', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<SignUp />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Senha'), '1');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedGoBack).not.toHaveBeenCalled();
    expect(getByText('Digite um email válido')).toBeTruthy();
    expect(getByText('No minimo 6 digitos')).toBeTruthy();
  });

  it('should be not able to register yourself with network error', async () => {
    const user = await factory.attrs<User>('User');
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onPost('users').reply(400);

    const { getByPlaceholderText, getByTestId } = render(<SignUp />);

    const name = getByPlaceholderText('Nome');
    fireEvent.changeText(name, user.name);
    fireEvent(name, 'submitEditing');

    const email = getByPlaceholderText('Email');
    fireEvent.changeText(email, user.email);
    fireEvent(email, 'submitEditing');

    fireEvent.changeText(getByPlaceholderText('Senha'), user.password);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedGoBack).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'Erro no cadastro',
      'Ocorreu um erro ao fazer o cadastro, tente novamente.',
    );
  });

  it('should be able to navigate to sign in screen', async () => {
    const { getByTestId } = render(<SignUp />);

    fireEvent.press(getByTestId('signin'));

    expect(mockedGoBack).toHaveBeenCalled();
  });
});
