import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import looper from "../../assets/Looper-3.svg";
import UpSellItem from "./UpSellItems/UpSellItem";
import UpsellCart from "./UpsellCart/UpsellCart";

const UpSells = ({ otherCampaigns }) => {
  const targetRef = useRef(null);
  const [showDiv, setShowDiv] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [clickedCampaign, setClickedCampaign] = useState();
  const toggleDiv = (clicked) => {
    setShowDiv(true);
    setClickedCampaign(clicked);
  };
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    console.log(windowWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
              {otherCampaigns?.map((item, index) => (
                <UpSellItem toggleDiv={toggleDiv} item={item} key={index} />
              ))}
            </div>
            {windowWidth > 755 && (
              <div
                className={`MainUpsellSection-cart ${showDiv ? "show" : ""}`}
              >
                <UpsellCart campaign={clickedCampaign} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpSells;
