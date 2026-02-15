import styled, { css } from 'styled-components/native';
import { Feather } from '@react-native-vector-icons/feather';
import { TextInput as RNTextInput } from 'react-native';

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  align-items: center;
  background-color: #232129;
  border: 2px solid #232129;
  border-radius: 10px;
  flex-direction: row;
  height: 60px;
  margin-top: 8px;
  padding: 0px 16px;
  width: 100%;

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
`;

export const TextInput = styled(RNTextInput)`
  color: #fff;
  flex: 1;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const Error = styled.Text`
  color: #c53030;
  flex: 1;
  font-family: 'RobotoSlab-Regular';
  font-size: 12px;
  text-align: right;
`;

export const Icon = styled(Feather)`
  margin-right: 16px;
`;
