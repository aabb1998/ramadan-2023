import React, { useState } from "react";
import logo from "../../assets/logo.webp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./styles.css";
import Typist from "react-typist";
import { TypeAnimation } from "react-type-animation";

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
											<a className="mega-sub-menu-a">
												About Al-Ihsan Foundation
											</a>
										</li>
										<li>
											<a className="mega-sub-menu-a">
												Reports
											</a>
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
															<a>
																AQEEQAH AND
																GENERAL
																SACRIFICE
															</a>
														</li>
													</ul>
												</li>
											</ul>
										</li>
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
											<a className="mega-sub-menu-a">
												Fundraise with Us
											</a>
										</li>
										<li>
											<a className="mega-sub-menu-a">
												Become a Sponsor
											</a>
										</li>
										<li>
											<a className="mega-sub-menu-a">
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
											<a className="mega-sub-menu-a">
												Contact Us
											</a>
										</li>
										<li>
											<a className="mega-sub-menu-a">
												Subscribe
											</a>
										</li>
										<li>
											<a className="mega-sub-menu-a">
												Technical Support
											</a>
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
