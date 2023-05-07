import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import AuthProvider from './context';
import TeacherScreen from './screens/TeacherScreen';
import ScanScreen from './screens/ScanScreen';
import CreateStudentScreen from './screens/CreateStudentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Teacher" component={TeacherScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="CreateStudent" component={CreateStudentScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
