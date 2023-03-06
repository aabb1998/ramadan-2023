import React, { useEffect, useState } from "react";
import MiniProgressBar from "../MiniProgressBar/MiniProgressBar";
import UpsellCart from "../UpsellCart/UpsellCart";
import "./UpSellItem.css";
const UpSellItem = ({ item, toggleDiv }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    console.log(windowWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="UpSellItem">
        <div className="UpSellItem-img">
          <img src={item?.imgLink} />
        </div>
        <div className="UpSellItem-desc">
          <span>{item?.desc}</span>
        </div>
        <div className="UpSellItem-progress">
          <MiniProgressBar
            item={item}
            goal={item?.goal}
            raised={item?.raised}
          />
        </div>
        <div className="UpSellItem-cart">
          <button
            onClick={() => {
              toggleDiv(item);
              setShowModal(!showModal);
            }}
          >
            Donate
          </button>
        </div>
      </div>
      {showModal && windowWidth <= 755 && <UpsellCart campaign={item} />}
    </>
  );
};

export default UpSellItem;
