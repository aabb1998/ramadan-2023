import React from "react";
import MainProgressBar from "../MainProgressBar/MainProgressBar";
import MainDonationAddToCart from "./MainDonationAddToCart";
import "./Styles.css";

const MainDonationSection = () => {
  return (
    <>
      <div className="MainDonationSection">
        <div className="MainDonationSection-inner">
          <div className="MainDonationSection-container">
            <div className="MainDonationSection-header">
              <h5>DONATE NOW!</h5>
              <span>
                This holiday season, your gift will be matched to provide double
                the lifesaving assistance.
              </span>
            </div>
            <div className="MainDonationSection-img">
              <img src="https://scontent.fmel16-1.fna.fbcdn.net/v/t39.30808-6/312659658_499169832238672_8455937611123451192_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=e3f864&_nc_ohc=yVwj2n-uMf0AX90NFW0&_nc_ht=scontent.fmel16-1.fna&oh=00_AfAWqv0pPaXoXUvCU_x0zFFTQIKMzyjPGd-85Wsawai-Lw&oe=63F1E50C" />
            </div>
            <div className="MainDonationSection-img-desc">
              <h1>People that needs healthy food.</h1>
              <span>
                Do I have consent to do what I lorem ipsum root and branch
                review.
              </span>
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
