import React, { useState } from "react";
import logo from "../../assets/logo.webp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./styles.css";
import { TypeAnimation } from "react-type-animation";
import MenuIcon from "@mui/icons-material/Menu";

const HeaderMenu = () => {
  const texts = [
    "first text",
    "second text",
    "third text",
    "Gift an education, make a better life.",
  ];
  const [currentTextCounter, setCurrentTextCounter] = useState(0);
  return (
    <>
      {/* <div>
        <MenuIcon />
      </div> */}
      <div>
        <div className="HeaderMenu">
          <div>
            <img className="lazyloaded" src={logo} />
          </div>
          <div className="HeaderMenu-navbar">
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
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/about-al-ihsan-foundation/"
                      >
                        About Al-Ihsan Foundation
                      </a>
                    </li>
                    <li>
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/annual-report/"
                      >
                        Reports
                      </a>
                    </li>
                  </ul>
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
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/fundraise-with-us/"
                      >
                        Fundraise with Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/become-a-sponsor/"
                      >
                        Become a Sponsor
                      </a>
                    </li>
                    <li>
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/volunteer-positions/"
                      >
                        Volunteer
                      </a>
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
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/contact/"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/subscribe/"
                      >
                        Subscribe
                      </a>
                    </li>
                    <li>
                      <a
                        className="mega-sub-menu-a"
                        href="https://alihsan.org.au/technical-support/"
                      >
                        Technical Support
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    onClick={() => {
                      window.scrollBy({
                        top: 4000,
                        behavior: "smooth", // This line is optional and makes the scrolling smooth
                      });
                    }}
                    className="headerMenu-nav-a"
                  >
                    <ShoppingCartIcon />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="headerMenu-maintext">
          {/* <Typist key={currentTextCounter}>
						<h1>Gift an education, make a better life.</h1>
					</Typist> */}
          <TypeAnimation
            sequence={[
              "Make a difference this Ramadan.", // Types 'One'
              2000, // Waits 1s
              "Your donations will change lives.", // Deletes 'One' and types 'Two'
              2000, // Waits 2s
              "Donate to support our charity campaigns.",
              2000, // Types 'Three' without deleting 'Two'
              () => {
                console.log("Done typing!"); // Place optional callbacks anywhere in the array
              },
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            style={{ fontSize: "2em" }}
          />
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
