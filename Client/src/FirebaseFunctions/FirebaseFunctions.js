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

export { getAllCampaigns, incrementTotal, updateAmountsInDocuments };
