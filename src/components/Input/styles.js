import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  flex-direction: row;
  height: 46px;
  padding: 0px 15px;
`;

export const TInput = styled.TextInput.attrs({
  placeholderTextColor: 'rgba(255, 255, 255, 0.8)',
})`
  color: #fff;
  flex: 1;
  font-size: 15px;
  margin-left: 10px;
`;
