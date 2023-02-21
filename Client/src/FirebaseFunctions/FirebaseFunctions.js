import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase";
import { data } from "autoprefixer";

const db = getFirestore();

const getAllCampaigns = async () => {
  let data = [];
  const campaignsRef = collection(db, "campaigns");
  const querySnapshot = await getDocs(campaignsRef);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export { getAllCampaigns };
