import React, { useEffect, useState } from "react";
import "./CheckoutCart.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import paypalIcon from "../../assets/paypal.svg";
import cards from "../../assets/cards.svg";
import CheckoutItems from "./CheckoutItems";
import cart, {
  addItemToCart,
  addOneTimeDonation,
  removeOneTimeDonation,
  setAnon,
} from "../../Redux/cart";
import { useDispatch, useSelector } from "react-redux";
import PaypalCheckout from "./PaypalCheckout";
import CardCheckout from "./CardCheckout";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { NotificationManager } from "react-notifications";
const CheckoutCart = () => {
  const [paypal, setPaypal] = useState(false);
  const [disableCheckout, setDisabledCheckout] = useState(false);
  const [donation, setDonation] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const { cartItems, oneTimeDonation } = useSelector((state) => state.cart);
  let totalAmount = cartItems.reduce((total, item) => total + item.amount, 0);

  const toggle = () => {
    setPaypal(false);
    setDonation(false);
  };

  const togglePaypalButton = () => {
    setPaypal(false);
  };

  const dispatch = useDispatch();

  const disablePayments = () => {
    setDisabledCheckout(true);
  };

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

  useEffect(() => {
    if (donation) {
      dispatch(addOneTimeDonation());
    } else {
      dispatch(removeOneTimeDonation());
    }
  }, [donation]);

  useEffect(() => {
    togglePaypalButton();
  }, [oneTimeDonation, cartItems]);

  useEffect(() => {
    if (paypal) {
      const hasScheduledItem = cartItems.some((item) => item.schedule === true);
      if (hasScheduledItem) {
        NotificationManager.error(
          "Please note, subscriptions are unavailable with Paypal.",
          "Paypal",
          3000
        );
      }
    }
  }, [paypal]);

  const changePaypalStatus = () => {
    setPaypal(false);
  };

  return (
    <>
      <div className="CheckoutCart">
        <div className="CheckoutCart-inner">
          <div className="CheckoutCart-container">
            <div className="CheckoutCart-header">
              <h5>CHECKOUT CART</h5>
              <span>
                Complete your donation with ease and make a difference with
                Alihsan Foundation.
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
                          <span>Card</span>
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
                    <span>
                      $
                      {donation
                        ? parseInt(totalAmount.toFixed(2)) + 10
                        : parseInt(totalAmount.toFixed(2))}
                    </span>
                  </div>
                  <div className="body-right-total-container bottom">
                    <span>Processing Fee</span>
                    {oneTimeDonation === 0 ? (
                      <span>${((3 / 100) * totalAmount).toFixed(2)}</span>
                    ) : (
                      <span>
                        ${(0.03 * totalAmount + 0.03 * 10).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="cart-10-section">
                    <div
                      className={`cart-10-donation ${donation && "checked"}`}
                      onClick={() => {
                        setDonation(!donation);
                      }}
                    >
                      <div className="cart-10-donation-container">
                        <PriceChangeIcon style={{ color: "green" }} />
                        <span>$10 Donation</span>
                      </div>
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={donation ? true : false}
                          />
                        </label>
                      </div>
                    </div>
                    <div
                      className={`cart-10-donation ${anonymous && "checked"}`}
                      onClick={() => {
                        dispatch(setAnon());
                        setAnonymous(!anonymous);
                      }}
                    >
                      <div className="cart-10-donation-container">
                        <span>Anonymous Donation</span>
                      </div>
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={anonymous ? true : false}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="body-right-total-container last">
                    <span>Total</span>
                    <span>
                      $
                      {oneTimeDonation > 0
                        ? (
                            0.03 * totalAmount +
                            0.03 * 10 +
                            10 +
                            totalAmount
                          ).toFixed(2)
                        : (0.03 * totalAmount + totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
                {paypal ? (
                  <PaypalCheckout
                    billingDetails={billingDetails}
                    personalDetails={personalDetails}
                    disablePayments={disablePayments}
                    toggle={toggle}
                    changePaypalStatus
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
