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
            <div className="Footer-inner-left-nav">
              <h1>About Us</h1>
              <div>
                <ul className="left-nav-ul">
                  <li>
                    <a href="https://alihsan.org.au/who-we-are/">Who We are?</a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/our-vision-mission/">
                      Our Vision & Mission
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/objectives-strategies/">
                      Objectives & Strategies
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/case-studies/">
                      Case Studies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="Footer-inner-left-nav">
              <h1>News</h1>
              <div>
                <ul className="left-nav-ul">
                  <li>
                    <a href="https://alihsan.org.au/category/news/campaign-updates/">
                      Post Campaign Updates
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/on-the-ground-videos/">
                      On the Ground Videos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="Footer-inner-left-nav">
              <h1>Policies & Procedures</h1>
              <div>
                <ul className="left-nav-ul">
                  <li>
                    <a href="https://alihsan.org.au/terms-conditions/">
                      Terms and Conditions
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/privacy/">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/child-protection-policy/">
                      Child Protection Policies & Procedures
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/data-deletion-policy/">
                      Data Deletion Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://alihsan.org.au/safeguarding-policy/">
                      Safeguarding Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Footer-inner-right">
            <h1>Donation Details</h1>
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
