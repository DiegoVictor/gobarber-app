import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  padding: 0px 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0px 24px;
`;

export const BackToSignIn = styled.TouchableOpacity`
  align-items: center;
  background-color: #312e38;
  border-color: #232129;
  border-top-width: 1px;
  bottom: 0px;
  flex-direction: row;
  justify-content: center;
  left: 0px;
  padding: 16px 0px 16px;
  position: absolute;
  right: 0px;
`;

export const BackToSignInText = styled.Text`
  color: #fff;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  margin-left: 16px;
`;
