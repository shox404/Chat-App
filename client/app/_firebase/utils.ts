import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

export const createDoc = async (
  collectionName: string,
  data: DocumentData
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating document:", error);
    return null;
  }
};

export const getAllDocs = async (
  collectionName: string
): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
};

export const getOneDoc = async (
  collectionName: string,
  id: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`No document found with ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

export const getOneDocByField = async (
  collectionName: string,
  field: string,
  value: string
): Promise<DocumentData | null> => {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }

    return null;
  } catch (error) {
    console.error("Error querying document:", error);
    return null;
  }
};

export const updateDocById = async (
  collectionName: string,
  id: string,
  newData: DocumentData
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, newData);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
};

export const deleteDocById = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
};
