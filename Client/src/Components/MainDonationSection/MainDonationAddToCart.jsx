import React, { useState, useRef } from "react";
import arrow from "../../assets/arrow.svg";
import ellipse from "../../assets/Looper-3.svg";
import { useDispatch, useSelector } from "react-redux";
import cart, { addItemToCart } from "../../Redux/cart";
import { NotificationManager } from "react-notifications";

const MainDonationAddToCart = ({ targetRef, mainCampaign }) => {
  const [schedule, setSchedule] = useState("onetime");
  const [timeframe, setTimeFrame] = useState("");
  const [selectAmount, setSelectAmount] = useState(0);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    if (selectAmount === 0 || selectAmount < 0 || selectAmount === "-0") {
      NotificationManager.error("Please enter a valid amount.", "Cart", 2000);
    } else if (schedule != "onetime" && timeframe === "") {
      NotificationManager.error("Please enter a schedule.", "Schedule", 2000);
    } else {
      // window.scrollBy({
      //   top: 1300,
      //   behavior: "smooth", // This line is optional and makes the scrolling smooth
      // });
      dispatch(addItemToCart(mainDonation));
      NotificationManager.success(
        `$${mainDonation.amount.toLocaleString()} donation - ${
          mainDonation.name
        }`,
        "Added to cart",
        3000
      );
      setSelectAmount(0);
    }
  };

  function generateRandomID() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?,./;";
    const idLength = 10;
    let id = "";
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  }

  let campaignIds = {
    campaign1: "maintest123",
    campaign2: "maintest12345",
    campaign3: "maintest123234",
    campaign4: "maintest121233",
  };

  const mainDonation = {
    name: "Main Campaign",
    campaignId: campaignIds.campaign1,
    amount: parseInt(selectAmount),
    schedule: schedule === "onetime" ? false : true,
    time: timeframe,
    priceId: generateRandomID(),
    imgUrl: mainCampaign?.imgLink,
  };

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
              <span>Ramadan last 10</span>
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

        <div className="MainDonationAddToCart-amounts">
          <div className="MainDonationAddToCart-amounts-row">
            <div
              onClick={() => {
                setSelectAmount(10);
              }}
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
          <input
            onChange={(e) => setSelectAmount(parseInt(e.target.value))}
            placeholder={selectAmount}
            value={selectAmount}
            type={"number"}
          />
        </div>
        <div
          onClick={handleButtonClick}
          className="MainDonationAddToCart-button"
        >
          <span>Add To Cart</span>
        </div>
      </div>
    </>
  );
};

export default MainDonationAddToCart;
