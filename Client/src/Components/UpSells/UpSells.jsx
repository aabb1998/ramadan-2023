import React, { useRef, useState } from "react";
import "./styles.css";
import looper from "../../assets/Looper-3.svg";
import UpSellItem from "./UpSellItems/UpSellItem";
import UpsellCart from "./UpsellCart/UpsellCart";

const UpSells = () => {
  const targetRef = useRef(null);
  const [showDiv, setShowDiv] = useState(false);
  const [clickedCampaign, setClickedCampaign] = useState();
  const toggleDiv = (clicked) => {
    setShowDiv(true);
    setClickedCampaign(clicked);
  };
  const upSellItems = [
    {
      name: "Cancer",
      desc: "Breast cancer death rates declined 40% from",
      goal: 100000,
      raised: 20932,
      campaignId: "234jk23lh4j23hl4",

      imgLink:
        "https://alihsan.org.au/wp-content/uploads/bread-givewp-image-600x463.jpg",
    },
    {
      name: "Orphan",
      desc: "Over the last decade Caridad has provided over ",
      goal: 123674,
      raised: 12332,
      campaignId: "234jk23lh42432ddsa23hl4",
      imgLink:
        "https://alihsan.org.au/wp-content/uploads/back-to-school-image-1-givewp-600x463.jpg",
    },
    {
      name: "Poor",
      desc: "Help poor people give food and Careing african child",
      goal: 874356,
      raised: 75656,
      campaignId: "234jac1212k23lh4j23hl4",
      imgLink:
        "https://alihsan.org.au/wp-content/uploads/2021/08/Clothes-appeal-600x463.png",
    },
  ];

  return (
    <>
      {/* <img className="bg-looper-left" src={looper} /> */}
      <div className="MainUpsellSection">
        <div className="MainUpsellSection-inner">
          <div className="MainUpsellSection-container">
            <div className="MainUpsellSection-header">
              <h5>Our Other Running campaigns</h5>
              <span>
                This holiday season, your gift will be matched to provide double
                the lifesaving assistance.
              </span>
            </div>
            <div className="UpSellItems">
              {upSellItems.map((item, index) => (
                <UpSellItem toggleDiv={toggleDiv} item={item} key={index} />
              ))}
            </div>

            <div className={`MainUpsellSection-cart ${showDiv ? "show" : ""}`}>
              <UpsellCart campaign={clickedCampaign} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpSells;
