import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  align-items: center;
  background-color: #ff9000;
  border-radius: 10px;
  height: 60px;
  justify-content: center;
  margin-top: 8px;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: #312e38;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;
