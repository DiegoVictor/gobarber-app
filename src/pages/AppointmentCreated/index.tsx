import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';
import { StackParamList } from '../../routes/app.routes';

interface RouteParams {
  date: number;
}

type NavigateProps = StackScreenProps<StackParamList>['navigation'];

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation<NavigateProps>();
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({ routes: [{ name: 'Dashboard' }], index: 0 });
  }, [reset]);

  const formattedDate = useMemo(
    () =>
      format(
        routeParams.date,
        "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
        { locale: ptBR },
      ),
    [routeParams.date],
  );

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluido</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed} testID="ok">
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
