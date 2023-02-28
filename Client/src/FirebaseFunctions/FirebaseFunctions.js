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
  runTransaction,
  orderBy,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { auth } from "../firebase";
import { data } from "autoprefixer";
import cart from "../Redux/cart";

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

const incrementTotal = async (documentId, amountToAdd) => {
  const docRef = doc(db, "campaigns", documentId);
  console.log(documentId);
  return runTransaction(db, async (transaction) => {
    const docSnapshot = await transaction.get(docRef);
    const currentAmount = docSnapshot.get("raised");
    const newAmount = currentAmount + amountToAdd;
    transaction.update(docRef, { raised: newAmount });
  });
};

const updateAmountsInDocuments = async (cartItems) => {
  try {
    cartItems.forEach((item) => {
      incrementTotal(item.campaignId, item.amount);
    });
    console.log("AMount incremeneted");
  } catch (error) {
    console.error("Error incrementing amounts;");
  }
};

const addDonation = async (collectionName, documentData) => {
  console.log(documentData);
  try {
    const timeStamp = serverTimestamp();
    const dataWithTimestamp = { ...documentData, createdAt: timeStamp };
    const docRef = await addDoc(
      collection(db, collectionName),
      dataWithTimestamp
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getDonationsFromCollection = async (collectionName) => {
  let data = [];
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const documents = querySnapshot.docs.map((doc) => data.push(doc.data()));
  return data;
};

const getLastestDonations = async () => {
  const docs = [];

  const collectionRef = collection(db, "donations");
  const q = query(collectionRef, orderBy("createdAt", "desc"), limit(5));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id }, ...doc.data());
    });
  });
  return docs;
};

export {
  getAllCampaigns,
  incrementTotal,
  updateAmountsInDocuments,
  addDonation,
  getDonationsFromCollection,
  getLastestDonations,
};
