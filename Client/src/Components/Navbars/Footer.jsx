import React from "react";
import Facebook from "../../assets/Facebook";
import Instagram from "../../assets/Instagram";
import Twitter from "../../assets/Twitter";

const Footer = () => {
  return (
    <>
      <div className="Footer">
        <div className="Footer-inner">
          <div className="Footer-inner-left">
            <button>Subscribe to email</button>
          </div>
          <div className="Footer-inner-right">
            <h5>Donation Details</h5>
            <span>You can donate via:</span>
            <p>
              <strong>St George Bank</strong>
            </p>
            <p>
              <strong>Acc Name: </strong>Al-Ihsan Foundation
            </p>
            <p>
              <strong>BSB: </strong>112 879
            </p>
            <p>
              <strong>ACCOUNT NO: </strong>425 989 660
            </p>
            <img src="https://test.alihsan.org.au/wp-content/uploads/tax-acnc.png" />
          </div>
        </div>
      </div>
      <div className="Footer-bottom">
        <div>
          <span className="Footer-bottom-abn">
            © Copyright 2023 Al-Ihsan Foundation | ABN: 53168960361 | CFN: 23924
          </span>
        </div>
        <div className="Footer-bottom-socials">
          <a>
            <Twitter />
            TWITTER
          </a>
          <a>
            <Instagram />
            INSTAGRAM
          </a>
          <a>
            <Facebook />
            FACEBOOK
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
