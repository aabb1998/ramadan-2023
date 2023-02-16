import React from "react";
import "./styles.css";
import { useParams } from "react-router-dom";

import Header from "../Components/Navbars/Header";
import Footer from "../Components/Navbars/Footer";
import "../index.css";
import ID2 from "../ID2/ID2";
import ID3 from "../ID3/ID3";
import MainDonationSection from "../Components/MainDonationSection/MainDonationSection";
const ID1 = () => {
  return (
    <div className="ID1">
      <div>
        <MainDonationSection />
      </div>
    </div>
  );
};

export default ID1;
