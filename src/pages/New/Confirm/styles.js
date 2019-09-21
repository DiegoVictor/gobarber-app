import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  padding: 0px 30px;
`;

export const Avatar = styled.Image`
  border-radius: 60px;
  height: 120px;
  width: 120px;
`;

export const Name = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
`;

export const SubmitButton = styled(Button)`
  align-self: stretch;
  margin-top: 25px;
`;

export const Time = styled.Text`
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  margin-top: 4px;
`;
