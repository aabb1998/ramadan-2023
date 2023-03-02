import React from "react";
import MiniProgressBar from "../MiniProgressBar/MiniProgressBar";
import UpsellCart from "../UpsellCart/UpsellCart";
import "./UpSellItem.css";
const UpSellItem = ({ item, toggleDiv }) => {
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
          <button onClick={() => toggleDiv(item)}>Donate</button>
        </div>
      </div>
      {/* <UpsellCart campaign={item} /> */}
    </>
  );
};

export default UpSellItem;
