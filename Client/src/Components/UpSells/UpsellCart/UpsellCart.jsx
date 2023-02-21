import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import arrow from "../../../assets/arrow.svg";
import icon from "../../../assets/Icon.svg";
import "./UpsellCart.css";
import cart, { addItemToCart } from "../../../Redux/cart";
import { NotificationManager } from "react-notifications";

const UpsellCart = ({ campaign }) => {
  const [schedule, setSchedule] = useState("onetime");
  const [timeframe, setTimeFrame] = useState("");
  const [selectAmount, setSelectAmount] = useState(100);

  const dispatch = useDispatch();

  const handleButtonClick = () => {
    if (selectAmount === 0 || selectAmount < 0 || selectAmount === "-0") {
      NotificationManager.error("Please enter a valid amount.", "Cart", 2000);
    } else {
      dispatch(addItemToCart(donation));
      NotificationManager.success(
        `$${donation.amount.toLocaleString()} donation - ${donation.name}`,
        "Added to cart",
        3000
      );
    }
  };

  const donation = {
    name: campaign?.campaignName,
    campaignId: campaign?.campaignId,
    amount: selectAmount,
    schedule: schedule === "onetime" ? false : true,
    time: timeframe,
    imgUrl: campaign?.imgLink,
  };

  useEffect(() => {
    console.log(campaign);
  }, [campaign]);

  return (
    <>
      <div className="MainDonationAddToCart">
        <div className="MainDonationAddToCart-innerBtns">
          <div
            onClick={() => {
              setSchedule("onetime");
              setTimeFrame("");
            }}
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
        {schedule != "onetime" && (
          <div className="MainDonationAddToCart-innerSchedule">
            <div
              className={`innerBtn-schedule left ${
                timeframe === "ramadan-daily" ? "active" : ""
              }`}
              onClick={() => setTimeFrame("ramadan-daily")}
            >
              <span>Ramadan Daily</span>
            </div>
            <div
              className={`innerBtn-schedule left ${
                timeframe === "ramadan-last-10" ? "active" : ""
              }`}
              onClick={() => setTimeFrame("ramadan-last-10")}
            >
              <span>Ramadan last 10 days</span>
            </div>
            <div
              className={`innerBtn-schedule left ${
                timeframe === "monthly" ? "active" : ""
              }`}
              onClick={() => setTimeFrame("monthly")}
            >
              <span>Monthly</span>
            </div>
            <div
              className={`innerBtn-schedule left ${
                timeframe === "yearly" ? "active" : ""
              }`}
              onClick={() => setTimeFrame("yearly")}
            >
              <span>Yearly</span>
            </div>
          </div>
        )}
        <div className="UpSellAddToCart-campaignName">
          <span>{campaign?.desc}</span>
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
          <input type={"number"} placeholder={selectAmount} />
        </div>
        <div className="MainDonationAddToCart-campaign">
          <div>
            <span>Campaign you are donating to:</span>
          </div>
          <div>
            <span>{campaign?.name}</span>
          </div>
        </div>
        <div onClick={handleButtonClick} className="UpSellAddToCart-button">
          <span>Add To Cart</span>
          <img src={icon} />
        </div>
      </div>
    </>
  );
};

export default UpsellCart;
