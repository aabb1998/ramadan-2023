import React, { useRef, useState } from "react";
import "./CheckoutCart.css";
import paypalIcon from "../../assets/paypal.svg";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import cart from "../../Redux/cart";
import ReactDOM from "react-dom";

// const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalCheckout = ({ billingDetails, personalDetails }) => {
  const [hideButton, setHideButton] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);

  const [subscription, setSubscription] = useState(null);

  const paypal = useRef();

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
        setHideButton(true);
        window.paypal
          .Buttons({
            createOrder: (data, actions, err) => {
              return actions.order.create({
                intent: "CAPTURE",

                purchase_units: [
                  {
                    description: "Al-Ihsan - Ramadan 2023",
                    amount: {
                      currency_code: "AUD",
                      value: 650.0,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              console.log("Successful order:" + order);
            },
            onError: (err) => {
              console.log(err);
            },
          })
          .render(paypal.current);
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

    // e.preventDefault();
  };

  return (
    <div ref={paypal} className="body-right-total-checkout">
      {!hideButton ? (
        <button
          onClick={(e) => handlePaypalPayment(e)}
          className="checkout-paypal"
        >
          <img src={paypalIcon} />
          Checkout with Paypal
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PaypalCheckout;
