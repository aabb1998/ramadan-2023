import React, { useState, useRef } from "react";
import MainProgressBar from "../MainProgressBar/MainProgressBar";
import MainDonationAddToCart from "./MainDonationAddToCart";
import "./Styles.css";

const MainDonationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis neque ac magna scelerisque blandit. Nullam vitae velit nibh. Donec vel quam a libero tempor semper vel vel ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris ultricies augue eu enim sagittis, in dictum eros maximus. Duis non bibendum nibh, quis malesuada turpis. Phasellus eu ultrices dolor. Duis dignissim lectus eu massa lacinia ornare.";

  const toggleShowMore = () => setShowMore(!showMore);
  const truncatedText = text.split(" ").slice(0, 13).join(" ");
  const fullText = text.split(" ").join(" ");

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const firstWords = text.split(" ").slice(0, 20).join(" ");
  const remainingWords = text.split(" ").slice(20).join(" ");

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
                src="https://scontent.fmel16-1.fna.fbcdn.net/v/t39.30808-6/312659658_499169832238672_8455937611123451192_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=e3f864&_nc_ohc=yVwj2n-uMf0AX90NFW0&_nc_ht=scontent.fmel16-1.fna&oh=00_AfAWqv0pPaXoXUvCU_x0zFFTQIKMzyjPGd-85Wsawai-Lw&oe=63F1E50C"
              />
            </div>
            <div className="MainDonationSection-img-desc">
              <h1>People that needs healthy food.</h1>
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
              <MainProgressBar />
            </div>
            <div>
              <MainDonationAddToCart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDonationSection;
