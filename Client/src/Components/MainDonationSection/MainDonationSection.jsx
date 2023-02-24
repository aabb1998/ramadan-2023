import React, { useState, useRef, useEffect } from "react";
import { getDonationsFromCollection } from "../../FirebaseFunctions/FirebaseFunctions";
import MainProgressBar from "../MainProgressBar/MainProgressBar";
import MainDonationAddToCart from "./MainDonationAddToCart";
import "./Styles.css";

const MainDonationSection = ({ mainCampaign }) => {
  const [showMore, setShowMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState(null);
  const [truncatedText, setTruncatedText] = useState(null);
  const [fullText, setFullText] = useState(null);
  const [showMoreContainer, setShowMoreContainer] = useState(true);
  const ref = useRef(null);

  const toggleShowMore = () => setShowMore(!showMore);
  // const truncatedText = text.split(" ").slice(0, 13).join(" ");
  // const fullText = text.split(" ").join(" ");

  const handleImageLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    console.log(mainCampaign);

    setText(mainCampaign?.longDesc);
  }, [mainCampaign]);

  useEffect(() => {
    if (text?.length > 13) {
      setTruncatedText(text.split(" ").slice(0, 13).join(" "));
      setFullText(text.split(" ").join(" "));
    }
  }, [text]);

  const handleReadMoreClick = () => {
    setExpanded(true);
  };

  const getLineHeight = () => {
    const lineHeight = window
      .getComputedStyle(ref.current)
      .getPropertyValue("line-height");
    return parseInt(lineHeight, 10);
  };

  const getHeight = () => {
    return showMore ? ref.current.scrollHeight : getLineHeight() * 2;
  };

  useEffect(() => {
    getDonations();
  }, []);

  const getDonations = async () => {
    let data = await getDonationsFromCollection("donations");
    console.log(data);
  };

  return (
    <>
      <div className="MainDonationSection">
        <div className="MainDonationSection-inner">
          <div className="MainDonationSection-container">
            <div className="MainDonationSection-header">
              <h5>DONATE NOW!</h5>

              {/* <span>
								This holiday season, your gift will be matched
								to provide double the lifesaving assistance.
							</span> */}
            </div>
            <div className="MainDonationSection-img">
              <img
                onLoad={handleImageLoad}
                className={`fade-in ${loaded ? "loaded" : ""}`}
                src={mainCampaign?.imgLink}
              />
            </div>
            <div className="MainDonationSection-img-desc">
              <h1>{mainCampaign?.desc}</h1>
              {/* <span>
								Do I have consent to do what I lorem ipsum root
								and branch review.
							</span> */}

              <div className="container">
                <span className={`text ${showMore ? "show" : ""}`}>
                  {showMore ? fullText : truncatedText}
                </span>
                <button onClick={toggleShowMore} className="read-more">
                  {showMore ? "Read Less" : "Read More"}
                </button>
              </div>
            </div>
            <div>
              <MainProgressBar mainCampaign={mainCampaign} />
            </div>
            <div>
              <MainDonationAddToCart mainCampaign={mainCampaign} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDonationSection;
