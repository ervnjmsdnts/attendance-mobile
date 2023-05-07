import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({ icon, password, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(password);
  return (
    <View className="">
      <TextInput
        ref={ref}
        className={`w-full bg-white mb-4 rounded-md p-2 px-4 ${
          icon && 'px-8'
        } ${error && 'border border-red-500'}`}
        secureTextEntry={showPassword}
        autoCorrect={false}
        {...props}
      />
      {error && (
        <Text className="text-red-500 -mt-4 mb-2">{error.message}</Text>
      )}
      {icon && (
        <Ionicons
          name={icon}
          style={{ position: 'absolute', left: 8, top: 14 }}
          color="gray"
          size={16}
        />
      )}
      {password && (
        <TouchableOpacity
          style={{ position: 'absolute', right: 8, top: 10 }}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons
            name={!showPassword ? 'eye' : 'eye-off'}
            color="gray"
            size={24}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
