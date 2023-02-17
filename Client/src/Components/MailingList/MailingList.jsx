import React from "react";
import "./styles.css";
const MailingList = () => {
  return (
    <>
      <div className="MailingListSection">
        <div className="MailingListSection-inner">
          <div className="MailingListSection-container">
            <div className="MainUpsellSection-header">
              <h5>Join our mailing list</h5>
              <span className="MailingListSection-span">
                Stay up to date with our campaigns and initiatives.
              </span>
            </div>
            <div className="MailingListSection-input">
              <input></input>
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MailingList;
