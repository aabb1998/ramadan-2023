import React, { useState } from "react";
import arrow from "../../assets/arrow.svg";
import ellipse from "../../assets/Looper-3.svg";

const MainDonationAddToCart = () => {
  const [schedule, setSchedule] = useState("onetime");
  const [selectAmount, setSelectAmount] = useState(100);

  return (
    <>
      <div className="MainDonationAddToCart">
        <div className="MainDonationAddToCart-innerBtns">
          <div
            onClick={() => setSchedule("onetime")}
            className={`innerBtn ${schedule === "onetime" ? "active" : ""}`}
          >
            <span>ONE TIMER</span>
          </div>
          <div
            onClick={() => setSchedule("schedule")}
            className={`innerBtn ${schedule != "onetime" ? "active" : ""}`}
          >
            <span>SCHEDULE</span>
          </div>
        </div>
        <div className="MainDonationAddToCart-scheduleInfo">
          <span>
            Schedule your gifts to stay consistent with your donations{" "}
            <img src={arrow} />
          </span>
        </div>
        <div className="MainDonationAddToCart-amounts">
          <div className="MainDonationAddToCart-amounts-row">
            <div
              onClick={() => setSelectAmount(10)}
              className={`MainDonationAddToCart-amount left ${
                selectAmount === 10 ? "amount-active" : ""
              }`}
            >
              <span>$10</span>
            </div>
            <div
              onClick={() => setSelectAmount(25)}
              className={`MainDonationAddToCart-amount ${
                selectAmount === 25 ? "amount-active" : ""
              }`}
            >
              <span>$25</span>
            </div>
            <div
              onClick={() => setSelectAmount(50)}
              className={`MainDonationAddToCart-amount right ${
                selectAmount === 50 ? "amount-active" : ""
              }`}
            >
              <span>$50</span>
            </div>
          </div>
          <div className="MainDonationAddToCart-amounts-row">
            <div
              onClick={() => setSelectAmount(60)}
              className={`MainDonationAddToCart-amount left ${
                selectAmount === 60 ? "amount-active" : ""
              }`}
            >
              <span>$60</span>
            </div>
            <div
              onClick={() => setSelectAmount(75)}
              className={`MainDonationAddToCart-amount ${
                selectAmount === 75 ? "amount-active" : ""
              }`}
            >
              <span>$75</span>
            </div>
            <div
              onClick={() => setSelectAmount(100)}
              className={`MainDonationAddToCart-amount right ${
                selectAmount === 100 ? "amount-active" : ""
              }`}
            >
              <span>$100</span>
            </div>
          </div>
        </div>
        <div className="MainDonationAddToCart-input">
          <span>$</span>
          <input placeholder={selectAmount} />
        </div>
        <div className="MainDonationAddToCart-button">
          <span>Add To Cart</span>
        </div>
      </div>
    </>
  );
};

export default MainDonationAddToCart;
