import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import MockAdapter from 'axios-mock-adapter';

import factory from '../utils/factory';
import api from '../../src/services/api';
import ForgotPassword from '../../src/pages/ForgotPassword';

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

const apiMock = new MockAdapter(api);

describe('ForgotPassword page', () => {
  beforeEach(() => {
    mockedGoBack.mockClear();
  });

  it('should be able to start reset password process', async () => {
    const user = await factory.attrs<User>('User');
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onPost('/password/forgot').reply(200);

    const { getByPlaceholderText } = render(<ForgotPassword />);

    fireEvent.changeText(getByPlaceholderText('Email'), user.email);
    fireEvent(getByPlaceholderText('Email'), 'onSubmitEditing');

    await act(async () => {
      fireEvent(getByPlaceholderText('Email'), 'onSubmitEditing');
    });

    expect(alert).toHaveBeenCalledWith(
      'Email de recuperação enviado!',
      'Enviamos um email para confirmar a recuperação de senha, verifique sua caixa de entrada.',
    );
    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be not able to start reset password process with invalid email', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <ForgotPassword />,
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedGoBack).not.toHaveBeenCalled();
    expect(getByText('Digite um email válido')).toBeTruthy();
  });

  it('should be not able to start reset password process with network error', async () => {
    const user = await factory.attrs<User>('User');
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onPost('/password/forgot').reply(400);

    const { getByPlaceholderText, getByTestId } = render(<ForgotPassword />);

    fireEvent.changeText(
      getByPlaceholderText('Email'),
      user.email.toLowerCase(),
    );

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(mockedGoBack).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'Erro na recuperação de senha',
      'Ocorreu um erro ao tentar realizar a recuperação de senha.',
    );
  });

  it('should be able to navigate to sign in screen', async () => {
    Platform.OS = 'android';

    const { getByTestId } = render(<ForgotPassword />);

    fireEvent.press(getByTestId('signin'));

    expect(mockedGoBack).toHaveBeenCalled();
  });
});
