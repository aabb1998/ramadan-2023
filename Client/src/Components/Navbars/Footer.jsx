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
            <p>St George Bank</p>
            <p>Acc Name: Al-Ihsan Foundation</p>
            <p>BSB: 112 879</p>
            <p>ACCOUNT NO: 425 989 660</p>
            <img src="https://test.alihsan.org.au/wp-content/uploads/tax-acnc.png" />
          </div>
        </div>
      </div>
      <div className="Footer-bottom">
        <div>
          <span>
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
