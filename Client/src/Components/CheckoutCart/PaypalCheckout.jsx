import React from "react";
import "./CheckoutCart.css";
import paypalIcon from "../../assets/paypal.svg";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import cart from "../../Redux/cart";

const PaypalCheckout = ({ billingDetails, personalDetails }) => {
  const { cartItems } = useSelector((state) => state.cart);

  const handlePaypalPayment = (e) => {
    e.preventDefault();

    if (cartItems[0]) {
      if (
        personalDetails.fullName &&
        personalDetails.email &&
        personalDetails.phoneNumber &&
        billingDetails.streetAddress &&
        billingDetails.city &&
        billingDetails.zip &&
        billingDetails.country
      ) {
        // All fields are filled, do something...
        console.log("filled");
      } else {
        NotificationManager.error(
          "Please fill in the forms.",
          "Checkout",
          3000
        );
      }
    } else {
      NotificationManager.error(
        "You have no items in your cart.",
        "Checkout",
        3000
      );
    }
  };

  return (
    <div className="body-right-total-checkout">
      <button
        onClick={(e) => handlePaypalPayment(e)}
        className="checkout-paypal"
      >
        <img src={paypalIcon} />
        Checkout with Paypal
      </button>
    </div>
  );
};

export default PaypalCheckout;
