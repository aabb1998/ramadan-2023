import React, { useEffect, useState } from "react";
import "./styles.css";
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
import { auth } from "../../../firebase";

const MiniProgressBar = ({ goal, raised, item }) => {
  const [progress, setProgress] = useState(0);
  const [documentData, setDocumentData] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    let totalProgress = (documentData?.raised / documentData?.goal) * 100;

    if (totalProgress > 100) {
      setProgress(100);
    } else {
      setProgress(Math.round(totalProgress, 2));
    }
  }, [documentData]);

  useEffect(() => {
    if (item) {
      const unsubscribe = onSnapshot(
        doc(db, "campaigns", item.campaignId),
        (doc) => {
          setDocumentData(doc.data());
        }
      );
      return () => unsubscribe();
    }
  }, [item]);

  useEffect(() => {
    console.log(documentData);
  }, [documentData]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <div className="progress-circle" style={{ left: `${progress}%` }}>
          <div className="progress-percentage">{`${progress}%`}</div>
        </div>
      </div>
      <div className="progress-bar-infos">
        <div className="progress-bar-info">
          <span>OUR GOAL</span>
          <p>${documentData?.goal.toLocaleString()}</p>
        </div>
        <div className="progress-bar-info">
          <span>RAISED</span>
          <p>${documentData?.raised.toLocaleString()}</p>
        </div>
        <div className="progress-bar-info">
          <span>TO GO</span>
          <p>${(documentData?.goal - documentData?.raised).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniProgressBar;
