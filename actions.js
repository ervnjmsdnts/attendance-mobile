import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export const login = async (payload = {}) => {
  const conditions = [
    where('email', '==', payload.email),
    where('password', '==', payload.password),
  ];
  const userRef = collection(db, 'users');
  const filterQuery = query(userRef, ...conditions);
  const user = await getDocs(filterQuery);
  if (!user.size) return Promise.reject('Invalid credentials');

  return { id: user.docs[0].id, ...user.docs[0].data() };
};

export const createStudent = async (payload = {}) => {
  const res = await addDoc(collection(db, 'users'), {
    ...payload,
    role: 'STUDENT',
  });

  return res;
};

export const addStudentAttendance = async (payload = {}) => {
  try {
    const conditions = [
      where('idNumber', '==', payload.idNumber),
      where('role', '==', 'STUDENT'),
    ];
    const userRef = collection(db, 'users');
    const filterQuery = query(userRef, ...conditions);
    const user = await getDocs(filterQuery);
    if (!user.size) return Promise.reject('Student does not exist');

    const now = new Date();
    const currentHour = now.getHours();

    console.log('START');

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    const attendanceCondition = [
      where('userId', '==', user.docs[0].id),
      where('createdAt', '>=', startOfToday),
      where('createdAt', '<=', endOfToday),
    ];

    const attendanceRef = collection(db, 'attendance');
    const attendanceQuery = query(attendanceRef, ...attendanceCondition);
    const attendanceSnapshot = await getDocs(attendanceQuery);

    console.log('END');

    if (!attendanceSnapshot.empty) {
      const attendanceDoc = attendanceSnapshot.docs[0];
      if (attendanceDoc.data().status === 'IN') {
        await updateDoc(attendanceDoc.ref, {
          status: 'OUT',
          isMorning: currentHour < 12 ? true : false,
        });
        console.log('Out');
        return Promise.resolve('Attendance updated successfully');
      } else {
        console.log('Already Out');
        return Promise.reject('Attendance already marked as OUT');
      }
    } else {
      console.log('In');
      await addDoc(attendanceRef, {
        userId: user.docs[0].id,
        status: 'IN',
        isMorning: currentHour < 12 ? true : false,
        createdAt: now,
      });
      return Promise.resolve('Attendance marked successfully');
    }
  } catch (e) {
    console.log({ e });
  }
};
