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
import { auth } from "../../firebase";

const MainProgressBar = ({ mainCampaign }) => {
  const [progress, setProgress] = useState(0);
  const [documentData, setDocumentData] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    let totalProgress = (documentData?.raised / documentData?.goal) * 100;
    if (totalProgress > 100) {
      setProgress(100);
    } else {
      setProgress(totalProgress);
    }
  }, [documentData]);

  useEffect(() => {
    if (mainCampaign) {
      const unsubscribe = onSnapshot(
        doc(db, "campaigns", mainCampaign?.campaignId),
        (doc) => {
          setDocumentData(doc.data());
        }
      );
      return () => unsubscribe();
    }
  }, [mainCampaign]);

  useEffect(() => {
    console.log(documentData);
  }, [documentData]);

  return (
    <>
      {documentData && mainCampaign ? (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
          <div className="progress-info">
            <div className="progress-info-container">
              <h4>${documentData?.raised.toLocaleString()}</h4>
              <span>Raised</span>
            </div>
            <div className="progress-info-container">
              <h4>{Math.round(progress, 2)}%</h4>
              <span>From goal</span>
            </div>
            <div className="progress-info-container">
              <h4>${documentData?.goal.toLocaleString()}</h4>
              <span>Total goal</span>
            </div>
          </div>
        </div>
      ) : (
        <span>Not loaded yet</span>
      )}
    </>
  );
};

export default MainProgressBar;
