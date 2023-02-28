import React, { useState, useRef } from "react";
import arrow from "../../assets/arrow.svg";
import ellipse from "../../assets/Looper-3.svg";
import { useDispatch, useSelector } from "react-redux";
import cart, { addItemToCart } from "../../Redux/cart";
import { NotificationManager } from "react-notifications";

const MainDonationAddToCart = ({
  targetRef,
  mainCampaign,
  recentDonationsRef,
}) => {
  const [schedule, setSchedule] = useState("onetime");
  const [timeframe, setTimeFrame] = useState("");
  const [selectAmount, setSelectAmount] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [subscription, setSubscription] = useState(false);
  const componentRef = useRef(null);

  const dispatch = useDispatch();
  const handleButtonClick = () => {
    if (selectAmount === 0 || selectAmount < 0 || selectAmount === "-0") {
      NotificationManager.error("Please enter a valid amount.", "Cart", 2000);
    } else if (schedule != "onetime" && timeframe === "") {
      NotificationManager.error(
        `For schedules, please choose a duration.`,
        "Subscriptions.",
        3000
      );
    } else {
      window.scrollBy({
        top: 500,
        behavior: "smooth", // This line is optional and makes the scrolling smooth
      });
      console.log(recentDonationsRef);
      recentDonationsRef.current.scrollIntoView({ behaviour: "smooth" });
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

  const getTimeFrameStart = (timeframe) => {
    let ramadanMonth = 3;
    let ramadanDay = 22;
    let ramadanEndMonth = 4;
    let ramadanEndDay = 20;

    let isoDate;

    if (timeframe === "ramadan-daily") {
      let ramadanDailyStart = new Date(2023, ramadanMonth - 1, ramadanDay);
      let ramadanDailyEnd = new Date(2023, ramadanEndMonth - 1, ramadanEndDay);

      const isoDateStart = ramadanDailyStart.toISOString();
      const isoDateEnd = ramadanDailyEnd.toISOString();
      isoDate = isoDateStart;
    } else if (timeframe === "ramadan-last-10") {
      let ramadanLast10Start = new Date(2023, ramadanEndMonth - 1, 10);
      let ramadanLast10End = new Date(2023, ramadanEndMonth - 1, ramadanEndDay);
      const isoDateStart = ramadanLast10Start.toISOString();
      const isoDateEnd = ramadanLast10End.toISOString();
      isoDate = isoDateStart;
    }
    return isoDate;
  };

  const getTimeFrameEnd = (timeframe) => {
    let ramadanMonth = 3;
    let ramadanDay = 22;
    let ramadanEndMonth = 4;
    let ramadanEndDay = 20;
    let isoDate;
    if (timeframe === "ramadan-daily") {
      let ramadanDailyStart = new Date(2023, ramadanMonth - 1, ramadanDay);
      let ramadanDailyEnd = new Date(2023, ramadanEndMonth - 1, ramadanEndDay);

      const isoDateStart = ramadanDailyStart.toISOString();
      const isoDateEnd = ramadanDailyEnd.toISOString();
      isoDate = isoDateEnd;
    } else if (timeframe === "ramadan-last-10") {
      let ramadanLast10Start = new Date(2023, ramadanEndMonth - 1, 10);
      let ramadanLast10End = new Date(2023, ramadanEndMonth - 1, ramadanEndDay);
      const isoDateStart = ramadanLast10Start.toISOString();
      const isoDateEnd = ramadanLast10End.toISOString();
      isoDate = isoDateEnd;
    }
    return isoDate;
  };

  const mainDonation = {
    name: "Main Campaign",
    campaignId: mainCampaign?.campaignId,
    amount: parseInt(selectAmount),
    schedule: schedule === "onetime" ? false : true,
    time:
      (timeframe === "yearly" && "year") ||
      (timeframe === "monthly" && "month") ||
      (timeframe === "ramadan-last-10" && "ramadan-last-10") ||
      (timeframe === "ramadan-daily" && "ramadan-daily"),
    start: getTimeFrameStart(timeframe),
    end: getTimeFrameEnd(timeframe),
    priceId: generateRandomID(),
    imgUrl: mainCampaign?.imgLink,
    subscription: schedule === "onetime" ? false : true,
    scheduleDuration:
      (timeframe === "yearly" && "year") ||
      (timeframe === "monthly" && "month") ||
      (timeframe === "ramadan-last-10" && "day") ||
      (timeframe === "ramadan-daily" && "day"),
    quickbooksClassName: mainCampaign?.quickbooksClassName,
    quickbooksClassId: mainCampaign?.quickbooksClassId,
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
        {!mainCampaign?.foodPack ? (
          <>
            <div className="UpSellAddToCart-campaignName">
              <span>{mainCampaign?.desc}</span>
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
          </>
        ) : (
          <>
            <div className="UpSellAddToCart-campaignName">
              <span>{mainCampaign?.desc}</span>
            </div>
            <div className="MainDonationAddToCart-amounts">
              <div className="MainDonationAddToCart-amounts-row">
                <div
                  onClick={() => setSelectAmount(50)}
                  className={`MainDonationAddToCart-amount left ${
                    selectAmount === 50 ? "amount-active" : ""
                  }`}
                >
                  <span>1 Pack</span>
                </div>
                <div
                  onClick={() => setSelectAmount(100)}
                  className={`MainDonationAddToCart-amount ${
                    selectAmount === 100 ? "amount-active" : ""
                  }`}
                >
                  <span>2 Packs</span>
                </div>
                <div
                  onClick={() => setSelectAmount(150)}
                  className={`MainDonationAddToCart-amount right ${
                    selectAmount === 150 ? "amount-active" : ""
                  }`}
                >
                  <span>3 Packs</span>
                </div>
              </div>
              <div className="MainDonationAddToCart-amounts-row">
                <div
                  onClick={() => setSelectAmount(250)}
                  className={`MainDonationAddToCart-amount left ${
                    selectAmount === 250 ? "amount-active" : ""
                  }`}
                >
                  <span>5 Packs</span>
                </div>
                <div
                  onClick={() => setSelectAmount(500)}
                  className={`MainDonationAddToCart-amount ${
                    selectAmount === 500 ? "amount-active" : ""
                  }`}
                >
                  <span>10 Packs</span>
                </div>
                <div
                  onClick={() => setSelectAmount(1000)}
                  className={`MainDonationAddToCart-amount right ${
                    selectAmount === 1000 ? "amount-active" : ""
                  }`}
                >
                  <span>20 Packs</span>
                </div>
              </div>
            </div>
          </>
        )}
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
