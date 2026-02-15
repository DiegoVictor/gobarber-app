import React, { useRef, useCallback, useState } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors, { ErrorBag } from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name?: string;
  email?: string;
  password?: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  password: Yup.string().min(6, 'No minimo 6 digitos'),
});

const SignUp: React.FC = () => {
  const { goBack } = useNavigation();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [data, setData] = useState<SignUpFormData>({});
  const [errors, setErrors] = useState<ErrorBag | null>(null);

  const handleSubmit = useCallback(async () => {
    try {
      setErrors(null);

      await schema.validate(data, { abortEarly: false });

      await api.post('users', data);

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já pode fazer login na aplicação.',
      );
      goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        setErrors(errors);
      } else {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, tente novamente.',
        );
      }
    }
  }, [goBack, data]);

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
              <Title>Crie sua conta</Title>
            </View>

            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCapitalize="words"
              returnKeyType="next"
              value={data?.name}
              onChangeText={name => {
                setData(value => ({
                  ...value,
                  name,
                }));
              }}
              error={errors?.name}
              onSubmitEditing={() => {
                emailRef.current?.focus();
              }}
            />
            <Input
              ref={emailRef}
              name="email"
              icon="mail"
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              value={data?.email}
              onChangeText={email => {
                setData(value => ({
                  ...value,
                  email,
                }));
              }}
              error={errors?.email}
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
            />
            <Input
              ref={passwordRef}
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              value={data?.password}
              onChangeText={password => {
                setData(value => ({
                  ...value,
                  password,
                }));
              }}
              error={errors?.password}
              onSubmitEditing={handleSubmit}
            />

            <Button onPress={handleSubmit} testID="submit">
              Entrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => goBack()} testID="signin">
        <Feather name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
