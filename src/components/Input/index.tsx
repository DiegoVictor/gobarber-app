import React, {
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
} from 'react';
import { TextInputProps, TextInput as RNTextInput } from 'react-native';

import { Container, TextInput, Icon, Error } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  error?: string;
  styles?: {};
}

const Input: ForwardRefRenderFunction<
  RNTextInput,
  PropsWithChildren<InputProps>
> = ({ error, icon, styles, ...props }, ref) => {
  return (
    <Container isErrored={!!error} style={styles}>
      <Icon name={icon} size={20} color="#666360" />
      <TextInput
        ref={ref}
        placeholderTextColor="#666360"
        keyboardAppearance="dark"
        {...props}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default forwardRef(Input);
