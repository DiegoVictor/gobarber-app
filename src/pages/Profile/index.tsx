import React, { useRef, useCallback, useState } from 'react';
import {
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
import ImagePicker from 'react-native-image-picker';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors, { ErrorBag } from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface ProfileFormData {
  name?: string;
  email?: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  old_password: Yup.string(),
  password: Yup.string().when('old_password', {
    is: (value: string) => {
      return typeof value === 'string' && value.length > 0;
    },
    then: (schema: Yup.Schema) => schema.required('Campo obrigatório'),
  }),
  password_confirmation: Yup.string()
    .when('old_password', {
      is: (value: string) => {
        return typeof value === 'string' && value.length > 0;
      },
      then: (schema: Yup.Schema) => schema.required('Campo obrigatório'),
    })
    .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
});

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { goBack } = useNavigation();

  const [errors, setErrors] = useState<ErrorBag | null>(null);
  const [data, setData] = useState<ProfileFormData>({});

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(async () => {
    try {
      setErrors(null);

      await schema.validate(data, { abortEarly: false });

      const { name, email, old_password, password, password_confirmation } =
        data;
      const formData = {
        name,
        email,
        ...(old_password
          ? {
              old_password,
              password,
              password_confirmation,
            }
          : {}),
      };

      const response = await api.put('profile', formData);
      updateUser(response.data);
      Alert.alert('Perfil atualizado com sucesso!');
      goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        setErrors(errors);
      } else {
        Alert.alert(
          'Erro na atualização',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    }
  }, [updateUser, goBack, data]);

  const handleUpdateAvatar = useCallback(async () => {
    const { didCancel, errorMessage, assets } =
      await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

    if (!didCancel) {
      if (errorMessage) {
        Alert.alert(`Erro ao atualizar seu avatar: ${errorMessage}`);
      } else {
        const data = new FormData();

        if (Array.isArray(assets)) {
          const [{ uri }] = assets;

          if (uri) {
            data.append('avatar', uri);

            const response = await api.patch('users/avatar', data);
            updateUser(response.data);
          }
        }
      }
    }
  }, [updateUser]);

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
            <BackButton onPress={() => goBack()} testID="goback">
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar} testID="avatar">
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCapitalize="words"
              returnKeyType="next"
              value={data.name}
              onChangeText={name =>
                setData(value => ({
                  ...value,
                  name,
                }))
              }
              error={errors?.name}
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              name="email"
              icon="mail"
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              value={data.email}
              onChangeText={email =>
                setData(value => ({
                  ...value,
                  email,
                }))
              }
              error={errors?.email}
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              styles={{ marginTop: 24 }}
              ref={oldPasswordInputRef}
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              value={data.old_password}
              onChangeText={old_password =>
                setData(value => ({
                  ...value,
                  old_password,
                }))
              }
              error={errors?.old_password}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              value={data.password}
              onChangeText={password =>
                setData(value => ({
                  ...value,
                  password,
                }))
              }
              error={errors?.password}
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={confirmPasswordInputRef}
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              value={data.password_confirmation}
              onChangeText={password_confirmation =>
                setData(value => ({
                  ...value,
                  password_confirmation,
                }))
              }
              error={errors?.password_confirmation}
              onSubmitEditing={handleSubmit}
            />

            <Button onPress={handleSubmit} testID="submit">
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
