import React from "react";
import Facebook from "../../assets/Facebook";
import Share from "../../assets/Share";
import Twitter from "../../assets/Twitter";
import User from "../../assets/User";
import Instagram from "../../assets/Instagram";
import "./styles.css";
import HeaderMenu from "./HeaderMenu";
import logo from "../../assets/logo.webp";

const Header = () => {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-inner-left">
          <Share />
          <span className="header-inner-social">OUR SOCIAL</span>
          <a href="https://www.facebook.com/alihsanfoundation/?_ga=2.268938229.548689017.1678140701-1326894390.1666650603">
            <Facebook />
          </a>
          <a href="https://twitter.com/Alihsan_AU?_ga=2.100724613.548689017.1678140701-1326894390.1666650603">
            <Twitter />
          </a>
          <a href="https://www.instagram.com/alihsan_foundation/?hl=en">
            <Instagram />
          </a>
          <span className="header-inner-tax">
            Donations of $2 or more are Tax Deductible
          </span>
        </div>
      </div>

      <div className="headerMenu">
        <div className="headerMenu-inner">
          <HeaderMenu />
        </div>
      </div>
    </div>
  );
};
export default Header;
