import React, { useCallback, useState } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
});

const ForgotPassword: React.FC = () => {
  const { goBack } = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    try {
      setError('');

      const data = { email };
      await schema.validate(data, { abortEarly: false });

      await api.post('/password/forgot', data);
      Alert.alert(
        'Email de recuperação enviado!',
        'Enviamos um email para confirmar a recuperação de senha, verifique sua caixa de entrada.',
      );
      goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        setError(errors.email);
      } else {
        Alert.alert(
          'Erro na recuperação de senha',
          'Ocorreu um erro ao tentar realizar a recuperação de senha.',
        );
      }
    }
  }, [email, goBack]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={Logo} />
            <View>
              <Title>Recuperar senha</Title>
            </View>
            <Input
              name="email"
              icon="mail"
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
              error={error}
              onSubmitEditing={handleSubmit}
            />
            <Button onPress={handleSubmit} testID="submit">
              Recuperar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => goBack()} testID="signin">
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default ForgotPassword;
