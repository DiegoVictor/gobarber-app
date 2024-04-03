import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Provider } from './index';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  align-items: center;
  background-color: #28262e;
  flex-direction: row;
  justify-content: space-between;
  padding: 24px;
  padding-top: 24px;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Regular';
  font-size: 20px;
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  border-radius: 28px;
  height: 56px;
  width: 56px;
`;

export const ProvidersList = styled(FlatList<Provider>)`
  padding: 32px 24px 16px;
`;

export const ProvidersListTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  margin-bottom: 24px;
`;

export const ProviderContainer = styled(RectButton)`
  align-items: center;
  background-color: #3e3b47;
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 16px;
  padding: 20px;
`;

export const ProviderAvatar = styled.Image`
  border-radius: 36px;
  height: 72px;
  width: 72px;
`;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;

export const ProviderMeta = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin-left: 8px;
`;
