import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Action = ({ name, navigate, icon }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(navigate)}
      className="bg-blue-400 rounded-lg flex-1 py-8 justify-center items-center"
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text className="text-lg text-white">{name}</Text>
    </TouchableOpacity>
  );
};

const TeacherScreen = () => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    return navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="bg-gray-100 p-4 flex-1">
      <View className="flex-row justify-center">
        <Text className="text-2xl font-bold flex-grow text-gray-700 mb-8">{`Hello, ${currentUser.name}`}</Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="h-8 w-8 rounded-full justify-center bg-blue-400 items-center"
        >
          <MaterialIcons name="logout" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-lg text-gray-400">Actions</Text>
      <View className="flex-row my-4" style={{ gap: 8 }}>
        <Action name="Scan" icon="scan" navigate="Scan" />
        <Action
          name="Create Student"
          icon="person-add"
          navigate="CreateStudent"
        />
      </View>
    </SafeAreaView>
  );
};

export default TeacherScreen;
