import React, { useMemo } from 'react';
import { DatePickerAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { Container, DateButton, DateText } from './styles';

export default function DateInput({ date, onChange }) {
  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt }),
    [date]
  );

  return (
    <Container>
      <DateButton
        onPress={async () => {
          const { action, year, month, day } = await DatePickerAndroid.open({
            mode: 'spinner',
            date,
          });
          if (action === DatePickerAndroid.dateSetAction) {
            onChange(new Date(year, month, day));
          }
        }}
      >
        <Icon name="event" color="#FFF" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>
    </Container>
  );
}
