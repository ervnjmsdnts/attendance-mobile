import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Back from '../components/Back';
import useCustomMutation from '../utils/useCustomMutation';
import { addStudentAttendance } from '../actions';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const addAttendanceMutation = useCustomMutation(addStudentAttendance, {
    onSuccess: () => {
      setIsScanning(false);
    },
  });

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleScan = async ({ data }) => {
    setIsScanning(false);

    const payload = JSON.parse(data);

    await addAttendanceMutation.execute({ ...payload });
  };

  return (
    <SafeAreaView className="bg-gray-100 p-4 flex-1">
      <Back title="Scan" />
      <View className="justify-center items-center h-full">
        {hasPermission === null ? (
          <Text className="text-lg">Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <>
            <Text className="text-lg mb-2">No access to camera</Text>
            <Button
              onPress={() => askForCameraPermission()}
              title="Allow Camera"
            />
          </>
        ) : (
          <>
            <View className="justify-center mb-4 items-center h-[300px] w-[300px] overflow-hidden rounded-md">
              <BarCodeScanner
                onBarCodeScanned={!isScanning ? undefined : handleScan}
                style={{ height: 400, width: 400 }}
              />
            </View>
            <TouchableOpacity
              className={`py-2 px-8 rounded-md justify-center items-center ${
                isScanning ? 'bg-blue-300' : 'bg-blue-400'
              }`}
              onPress={() => setIsScanning(true)}
              disabled={isScanning}
            >
              <Text className="text-white text-2xl font-bold">
                {isScanning ? 'Scanning' : 'Scan'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ScanScreen;
