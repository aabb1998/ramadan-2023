import React from "react";
import logo from "../../assets/logo.webp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const HeaderMenu = () => {
  return (
    <div className="HeaderMenu">
      <div>
        <img className="lazyloaded" src={logo} />
      </div>
      <div>
        <nav className="headerMenu-nav">
          <ul>
            <li>
              <a className="headerMenu-nav-a">
                ABOUT US
                <span>
                  <ArrowDropDownIcon />
                </span>
              </a>
              <ul className="mega-sub-menu">
                <li className="mega-sub-menu-li">
                  <a className="mega-sub-menu-a">About Al-Ihsan Foundation</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Reports</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="headerMenu-nav-a">
                ABOUT OUR PROJECTS
                <span>
                  <ArrowDropDownIcon />
                </span>
              </a>
              <ul className="mega-sub-menu">
                <li className="mega-menu-row">
                  <ul>
                    <li>
                      <ul>
                        <li className="mega-menu-item">
                          <a>AQEEQAH AND GENERAL SACRIFICE</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* <li className="mega-sub-menu-li">
                  <a className="mega-sub-menu-a">Fundraise with Us</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Become a Sponsor</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Volunteer</a>
                </li> */}
              </ul>
            </li>
            <li>
              <a className="headerMenu-nav-a">
                DONATE
                <span>
                  <ArrowDropDownIcon />
                </span>
              </a>
            </li>
            <li>
              <a className="headerMenu-nav-a">
                GET INVOLVED
                <span>
                  <ArrowDropDownIcon />
                </span>
              </a>
              <ul className="mega-sub-menu">
                <li className="mega-sub-menu-li">
                  <a className="mega-sub-menu-a">Fundraise with Us</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Become a Sponsor</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Volunteer</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="headerMenu-nav-a">
                CONTACT
                <span>
                  <ArrowDropDownIcon />
                </span>
              </a>
              <ul className="mega-sub-menu">
                <li className="mega-sub-menu-li">
                  <a className="mega-sub-menu-a">Contact Us</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Subscribe</a>
                </li>
                <li>
                  <a className="mega-sub-menu-a">Technical Support</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="headerMenu-nav-a">
                <ShoppingCartIcon />
                <span>0</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HeaderMenu;
