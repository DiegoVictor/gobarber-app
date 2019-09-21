import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from 'react-navigation';
import Background from '~/components/Background';
import Appointment from '~/components/Appointment';
import { Container, Title, List } from './styles';
import api from '~/services/api';

function Dashboard({ isFocused }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const response = await api.get('appointments');

        setAppointments(response.data);
      })();
    }
  }, [isFocused]);

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointments}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Appointment
              data={item}
              onCancel={async () => {
                const response = await api.delete(`appointments/${item.id}`);
                setAppointments(
                  appointments.map(appointment => {
                    if (appointment.id === item.id) {
                      return {
                        ...appointment,
                        canceled_at: response.data.canceled_at,
                      };
                    }
                    return appointment;
                  })
                );
              }}
            />
          )}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="event" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Dashboard);
