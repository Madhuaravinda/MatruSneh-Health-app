import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { useUser } from '../contexts/UserContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function useCollection<T extends { id: string }>(collectionName: string, initialData: T[], customUid?: string) {
  const { firebaseUser: authUser } = useUser();
  const effectiveUid = customUid || authUser?.uid;
  
  const [data, setData] = useState<T[]>(() => {
    // Initial load from local storage to avoid sync setState in effect
    const local = localStorage.getItem(collectionName);
    if (local && !customUid) { // Only use local cache for own profile
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Local data load error:", e);
      }
    }
    return initialData;
  });
  const [isLoading, setIsLoading] = useState(!!effectiveUid);

  // Path for Firestore: /users/{userId}/{collectionName}
  const path = effectiveUid ? `users/${effectiveUid}/${collectionName}` : null;

  useEffect(() => {
    if (!path) {
      // Use a microtask to avoid sync setState warning
      if (isLoading) {
        Promise.resolve().then(() => setIsLoading(false));
      }
      return;
    }

    // Set loading to true when path changes via microtask to avoid sync setState warning
    if (!isLoading) {
      Promise.resolve().then(() => setIsLoading(true));
    }

    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
      setData(items);
      setIsLoading(false);
      // Optional: keep local storage in sync as cache
      localStorage.setItem(collectionName, JSON.stringify(items));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [path, collectionName, isLoading]);

  const add = async (item: T) => {
    if (path) {
      try {
        await setDoc(doc(db, path, item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `${path}/${item.id}`);
      }
    } else {
      const newData = [...data, item];
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
    }
  };

  const remove = async (id: string) => {
    if (path) {
      try {
        await deleteDoc(doc(db, path, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
      }
    } else {
      const newData = data.filter(i => i.id !== id);
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
    }
  };

  const update = async (item: T) => {
    if (path) {
      try {
        await setDoc(doc(db, path, item.id), item, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `${path}/${item.id}`);
      }
    } else {
      const newData = data.map(i => i.id === item.id ? item : i);
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
    }
  };

  return { data, add, remove, update, isLoading };
}
