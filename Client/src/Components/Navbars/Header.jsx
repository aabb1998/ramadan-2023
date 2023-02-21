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
          <Facebook />
          <Twitter />
          <Instagram />
          <span className="header-inner-tax">
            Donations of $2 or more are Tax Deductible
          </span>
        </div>

        <div className="header-inner-right">
          <User />
          <span>REGISTER</span>
          <span>LOGIN</span>
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
