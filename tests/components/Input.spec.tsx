import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { faker } from '@faker-js/faker';
import {
  Text,
  TouchableHighlight,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import Input from '../../src/components/Input';

const send = jest.fn();

const Page: React.FC = () => {
  const input = React.useRef<RNTextInput>(null);
  const [value, setValue] = React.useState('');

  const onSubmit = () => {
    send({ name: value });
    setValue('');
  };

  return (
    <View>
      <Input
        ref={input}
        name="text"
        placeholder="Text Here"
        icon="check"
        onChangeText={setValue}
        value={value}
      />

      <TouchableHighlight onPress={onSubmit} testID="submit">
        <Text>Submit</Text>
      </TouchableHighlight>
    </View>
  );
};

describe('Input component', () => {
  it('should be able to set and clear input value', async () => {
    const { getByTestId, getByPlaceholderText } = render(<Page />);

    const input = getByPlaceholderText('Text Here');

    expect(input.props.value).toBe('');

    const name = faker.person.firstName();
    fireEvent.changeText(input, name);

    expect(input.props.value).toBe(name);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });
    expect(send).toHaveBeenCalledWith({ name });

    expect(input.props.value).toBe('');
  });
});
