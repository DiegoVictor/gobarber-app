import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const HourList = styled.FlatList.attrs({
  numColumns: 2,
  showsVerticalScrollIndicator: false,
})`
  padding: 0px 20px;
`;

export const Hour = styled(RectButton)`
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  flex: 1;
  margin: 0px 10px 20px;
  opacity: ${props => (props.enabled ? 1 : 0.6)};
  padding: 20px;
`;

export const Title = styled.Text`
  color: #333;
  font-size: 14px;
  font-weight: bold;
`;
