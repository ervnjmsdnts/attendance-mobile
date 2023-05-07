import { View, Text, TouchableOpacity, Image } from 'react-native';
import Input from '../components/Input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCustomMutation from '../utils/useCustomMutation';
import { login } from '../actions';
import { useAuth } from '../context';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' }),
});

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { setUser } = useAuth();

  const loginMutation = useCustomMutation(login, {
    onSuccess: async (data) => {
      await setUser(data);
    },
  });

  const onSubmit = async (data) => {
    await loginMutation.execute({ ...data });
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 items-center">
      <View className="w-full px-4">
        <View className="justify-center items-center">
          <Image source={require('../assets/logo.jpeg')} />
        </View>
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold">Welcome Back!</Text>
        </View>
        <View className="">
          <View className="mb-4">
            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Email Address"
                  error={errors?.email}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          <View className="mb-6">
            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  password
                  placeholder="Password"
                  error={errors?.password}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-2 mb-4"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-center font-bold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
