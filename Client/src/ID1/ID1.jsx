import React from "react";
import "./styles.css";
import { useParams } from "react-router-dom";

import Header from "../Components/Navbars/Header";
import Footer from "../Components/Navbars/Footer";
import "../index.css";
import ID2 from "../ID2/ID2";
import ID3 from "../ID3/ID3";
import MainDonationSection from "../Components/MainDonationSection/MainDonationSection";
import UpSells from "../Components/UpSells/UpSells";
import RecentDonations from "../Components/RecentDonations/RecentDonations";
import MailingList from "../Components/MailingList/MailingList";
import CheckoutCart from "../Components/CheckoutCart/CheckoutCart";
const ID1 = () => {
  return (
    <div>
      <div>
        <MainDonationSection />
      </div>
      <div className="ID1-upsells">
        <UpSells />
      </div>
      <div className="ID1-recentDonations">
        <RecentDonations />
      </div>
      <div>
        <MailingList />
      </div>
      <div>
        <CheckoutCart />
      </div>
    </div>
  );
};

export default ID1;
