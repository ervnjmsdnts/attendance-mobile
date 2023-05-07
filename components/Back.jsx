import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Back = ({ title, white }) => {
  const navigation = useNavigation();
  return (
    <View className="flex flex-row items-center gap-4">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color={white && 'white'} />
      </TouchableOpacity>
      <Text className={`text-lg ${white && 'text-white'}`}>{title}</Text>
    </View>
  );
};

export default Back;
