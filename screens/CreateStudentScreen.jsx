import { SafeAreaView } from 'react-native-safe-area-context';
import Back from '../components/Back';
import { Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/Input';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useCustomMutation from '../utils/useCustomMutation';
import { createStudent } from '../actions';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context';

const createStudentSchema = z.object({
  firstName: z.string().nonempty({ message: 'Field is required' }),
  middleName: z.string().nonempty({ message: 'Field is required' }),
  lastName: z.string().nonempty({ message: 'Field is required' }),
});

const CreateStudentScreen = () => {
  const [studentId, setStudentId] = useState(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: zodResolver(createStudentSchema) });

  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const createStudentMigration = useCustomMutation(createStudent, {
    onSuccess: () => {
      navigation.goBack();
    },
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStudentId(
        (
          snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((doc) => doc.role === 'STUDENT').length + 1
        )
          .toString()
          .padStart(6, '0')
      );
    });

    return () => {
      unsub();
    };
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      idNumber: studentId,
      school: currentUser.school,
    };

    await createStudentMigration.execute({ ...payload });
  };

  return (
    <SafeAreaView className="p-4 bg-gray-100 flex-1">
      <Back title="Create Student" />
      <View className="mt-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="First Name"
              value={value}
              error={errors?.firstName}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          name="middleName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Middle Name"
              error={errors?.lastName}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Last Name"
              error={errors?.lastName}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          name="idNumber"
          control={control}
          render={() => (
            <Input editable={false} placeholder="ID Number" value={studentId} />
          )}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-400 p-4 rounded-md shadow-sm"
        >
          <Text className="text-center text-white text-lg">Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateStudentScreen;
