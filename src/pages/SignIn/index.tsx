import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import getValidationErrors, { ErrorBag } from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccount,
  CreateAccountText,
} from './styles';

interface SignInFormData {
  email?: string;
  password?: string;
}
const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  password: Yup.string().required('Senha obrigatória'),
});

const SignIn: React.FC = () => {
  const { navigate } = useNavigation<NavigateProps>();
  const passwordInputRef = useRef<TextInput>(null);
  const [errors, setErrors] = useState<ErrorBag | null>({});
  const [data, setData] = useState<SignInFormData>({});
  const { signIn } = useAuth();

  const handleSubmit = useCallback(async () => {
    try {
      setErrors(null);

      await schema.validate(data, { abortEarly: false });

      const { email, password } = data;
      if (email && password) {
        await signIn({ email, password });
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        setErrors(errors);
      } else {
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    }
  }, [signIn, data]);

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
              <Title>Faça seu logon</Title>
            </View>

            <Input
              name="email"
              icon="mail"
              placeholder="Email"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              value={data?.email ?? ''}
              onChangeText={email => {
                setData(value => ({
                  ...value,
                  email,
                }));
              }}
              error={errors?.email}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              returnKeyType="send"
              value={data?.password ?? ''}
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

            <ForgotPassword
              onPress={() => navigate('ForgotPassword')}
              testID="forgot-password"
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccount onPress={() => navigate('SignUp')} testID="signup">
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountText>Criar um conta</CreateAccountText>
      </CreateAccount>
    </>
  );
};

export default SignIn;
