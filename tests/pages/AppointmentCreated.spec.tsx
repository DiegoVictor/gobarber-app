import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import {ptBR} from 'date-fns/locale';

import AppointmentCreated from '../../src/pages/AppointmentCreated';

const mockedParams = {
  date: faker.date.future(),
};
const mockedReset = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      reset: mockedReset,
    }),
    useRoute: () => ({
      params: mockedParams,
    }),
  };
});

describe('AppointmentCreated page', () => {
  beforeEach(() => {
    mockedReset.mockClear();
  });

  it('should be able to see the scheduled date', async () => {
    const { getByText } = render(<AppointmentCreated />);

    expect(
      getByText(
        format(
          mockedParams.date,
          "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
          {
            locale: ptBR,
          },
        ),
      ),
    ).toBeTruthy();
  });

  it('should be able to go back to dashboard', async () => {
    const { getByTestId } = render(<AppointmentCreated />);

    fireEvent.press(getByTestId('ok'));

    expect(mockedReset).toHaveBeenCalledWith({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  });
});
