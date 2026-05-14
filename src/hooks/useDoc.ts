import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { onSnapshot, setDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function useDoc<T>(path: string | null, initialData: T) {
  const [data, setData] = useState<T>(() => {
    const local = path ? localStorage.getItem(path) : null;
    return local ? JSON.parse(local) : initialData;
  });
  const [isLoading, setIsLoading] = useState(!!path);

  useEffect(() => {
    if (!path) {
      if (isLoading) {
        Promise.resolve().then(() => setIsLoading(false));
      }
      return;
    }

    if (!isLoading) {
      Promise.resolve().then(() => setIsLoading(true));
    }

    const docRef = doc(db, path);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const item = snapshot.data() as T;
        setData(item);
        localStorage.setItem(path, JSON.stringify(item));
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [path, isLoading]);

  const update = async (newData: T) => {
    setData(newData);
    if (path) {
      try {
        localStorage.setItem(path, JSON.stringify(newData));
        await setDoc(doc(db, path), newData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      // If no path (not logged in), we should probably handle local storage elsewhere or via key
    }
  };

  return { data, update, isLoading };
}
