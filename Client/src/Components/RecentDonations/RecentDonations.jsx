import React, { useEffect, useRef, useState } from "react";
import "./RecentDonations.css";
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
import icon from "../../assets/Icon.svg";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

import { getLastestDonations } from "../../FirebaseFunctions/FirebaseFunctions";
const db = getFirestore();

const RecentDonations = (checkout) => {
  const [docs, setDocs] = useState([]);
  const recentDonationsRef = useRef(null);
  useEffect(() => {
    // Create a reference to the collection
    const collectionRef = collection(db, "donations");

    // Create a query to retrieve the 5 newest documents
    const q = query(collectionRef, orderBy("createdAt", "desc"), limit(5));

    // Listen for changes to the query and update the state
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = [];
      querySnapshot.forEach((doc) => {
        newDocs.push({ id: doc.id, ...doc.data() });
      });
      setDocs(newDocs);
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(docs);
  }, [docs]);

  const getShorterName = (fullName) => {
    if (fullName != "Anonymous") {
      const namesArray = fullName.split(" ");
      const firstName = namesArray[0];
      const lastName = namesArray[namesArray.length - 1]; // Get the last name
      const middleInitial = lastName.charAt(0); // Get the first letter of the last name

      const abbreviatedName = `${firstName} ${middleInitial}.`; // Concatenate the first name, middle initial, and period
      return abbreviatedName;
    } else {
      return fullName;
    }
  };

  const handleButtonClickCampaigns = () => {
    window.scrollBy({
      top: isMobile ? 800 : 500,
      behavior: "smooth", // This line is optional and makes the scrolling smooth
    });
  };

  const handleButtonClick = () => {
    window.scrollBy({
      top: isMobile ? 3200 : 500,
      behavior: "smooth", // This line is optional and makes the scrolling smooth
    });
  };

  return (
    <>
      <div ref={recentDonationsRef} className="MainUpsellSection">
        <div className="MainDonationSection-inner">
          <div className="MainDonationSection-container">
            <div className="RecentDonations-inner">
              <div className="MainDonationSection-header">
                <div>
                  <h5 style={{ fontSize: "45px" }}>RECENT DONATIONS</h5>
                </div>
              </div>
              <div className="RecentDonations-donations">
                <div>
                  {docs.map((donation, index) => (
                    <div className="RecentDonations-donation">
                      <div className="RecentDonations-img">
                        <img src={donation.imgLink} />
                        <span className="recentDonation-campaign">
                          {donation.campaignName}
                        </span>
                      </div>
                      <div className="recentDonation-nameInfo">
                        <span className="recentDonation-name">
                          {getShorterName(donation.name)}
                        </span>
                        <span className="recentDonation-amount">
                          ${donation.amount.toLocaleString()}
                        </span>
                      </div>

                      <span className="RecentDonation-location">
                        {donation.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {checkout && (
                <>
                  <div
                    onClick={handleButtonClickCampaigns}
                    className="UpSellAddToCart-button-recents"
                  >
                    <span>View our other campaigns</span>
                  </div>
                  <div className="donations-divider">
                    <div className="donations-divider-horizontal" />
                    <span>OR</span>
                    <div className="donations-divider-horizontal" />
                  </div>
                  <div
                    onClick={handleButtonClick}
                    className="UpSellAddToCart-button"
                  >
                    <span>Go To Cart</span>
                    <img src={icon} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentDonations;
