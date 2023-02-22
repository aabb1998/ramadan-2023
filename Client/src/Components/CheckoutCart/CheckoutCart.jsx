import React, { useEffect, useState } from "react";
import "./CheckoutCart.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import paypalIcon from "../../assets/paypal.svg";
import cards from "../../assets/cards.svg";
import CheckoutItems from "./CheckoutItems";
import cart from "../../Redux/cart";
import { useSelector } from "react-redux";
import PaypalCheckout from "./PaypalCheckout";
import CardCheckout from "./CardCheckout";
const CheckoutCart = () => {
  const [paypal, setPaypal] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const totalAmount = cartItems.reduce((total, item) => total + item.amount, 0);

  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [billingDetails, setBillingDetails] = useState({
    streetAddress: "",
    city: "",
    zip: "",
    country: "",
  });

  const handlePersonalDetailsChange = (event) => {
    const { name, value } = event.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleBillingDetailsChange = (event) => {
    const { name, value } = event.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  useEffect(() => {
    console.log(totalAmount);
  }, [cartItems]);

  useEffect(() => {
    console.log(personalDetails);
  }, [personalDetails]);

  useEffect(() => {}, [cart]);

  return (
    <>
      <div className="CheckoutCart">
        <div className="CheckoutCart-inner">
          <div className="CheckoutCart-container">
            <div className="CheckoutCart-header">
              <h5>CHECKOUT CART</h5>
              <span>
                This holiday season, your gift will be matched to provide double
                the lifesaving assistance.
              </span>
            </div>
            <div className="CheckoutCart-body">
              <div className="CheckoutCart-body-left">
                <div className="body-left-personal">
                  <h3>Personal Details</h3>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Full Name"
                        name="fullName"
                        value={personalDetails.fullName}
                        onChange={handlePersonalDetailsChange}
                        type={"text"}
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Email"
                        name="email"
                        type={"email"}
                        value={personalDetails.email}
                        onChange={handlePersonalDetailsChange}
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Phone Number"
                        name="phoneNumber"
                        type={"number"}
                        value={personalDetails.phoneNumber}
                        onChange={handlePersonalDetailsChange}
                      />
                    </div>
                  </Box>
                </div>
                <div className="body-left-shipping">
                  <h3>Billing Details</h3>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Street Address"
                        name="streetAddress"
                        type={"text"}
                        value={billingDetails.streetAddress}
                        onChange={handleBillingDetailsChange}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <TextField
                        required
                        id="outlined-required"
                        label="City"
                        name="city"
                        type={"text"}
                        value={billingDetails.city}
                        onChange={handleBillingDetailsChange}
                      />
                      <TextField
                        required
                        id="outlined-required"
                        label="Zip Code"
                        name="zip"
                        type={"text"}
                        value={billingDetails.zip}
                        onChange={handleBillingDetailsChange}
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Country"
                        name="country"
                        type={"text"}
                        value={billingDetails.country}
                        onChange={handleBillingDetailsChange}
                      />
                    </div>
                  </Box>
                </div>
                <div className="body-left-payments">
                  <div className="body-left-payment">
                    <h3>Payment Methods</h3>
                    <div className="body-left-paymentContainer">
                      <div
                        className={`body-left-payMethods ${!paypal && "sdsd"}`}
                        style={{ marginRight: "5px" }}
                        onClick={() => {
                          if (paypal) {
                            setPaypal(false);
                          }
                        }}
                      >
                        <div>
                          <img src={cards} />
                          <span>Credit Card</span>
                        </div>
                        <div>
                          <label>
                            <input
                              checked={paypal ? false : true}
                              type="checkbox"
                              onChange={() => {
                                if (paypal) {
                                  setPaypal(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div
                        className={`body-left-payMethods ${paypal && "sdsd"}`}
                        onClick={() => {
                          setPaypal(true);
                        }}
                      >
                        <div>
                          <img src={paypalIcon} />
                          <span>Paypal</span>
                        </div>
                        <div>
                          <label>
                            <input
                              checked={paypal ? true : false}
                              type="checkbox"
                              onChange={() => {
                                setPaypal(true);
                                if (paypal === true) {
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="CheckoutCart-body-right">
                <div className="body-right-summary">
                  <h3>Order Summary</h3>
                  <div className="body-right-summary-container">
                    {/* {cartItems[0] === null ? (
                      cartItems.map((item, index) => (
                        <CheckoutItems item={item} key={index} />
                      ))
                    ) : (
                      <span>No items in cart</span>
                    )} */}
                    {cartItems.map((item, index) => (
                      <CheckoutItems item={item} key={index} />
                    ))}
                  </div>
                </div>
                <div className="body-right-totals">
                  <div className="body-right-total-container bottom">
                    <span>Sub total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="body-right-total-container bottom">
                    <span>Processing Fee</span>
                    <span>${((3 / 100) * totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="body-right-total-container last">
                    <span>Total</span>
                    <span>
                      ${(totalAmount + (3 / 100) * totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
                {paypal ? (
                  <PaypalCheckout
                    billingDetails={billingDetails}
                    personalDetails={personalDetails}
                  />
                ) : (
                  <CardCheckout
                    billingDetails={billingDetails}
                    personalDetails={personalDetails}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutCart;
