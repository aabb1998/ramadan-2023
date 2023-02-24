import React, { useEffect, useRef, useState } from "react";
import "./CheckoutCart.css";
import paypalIcon from "../../assets/paypal.svg";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import cart, { emptyCart } from "../../Redux/cart";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router";
import {
  addDonation,
  getDonationsFromCollection,
  updateAmountsInDocuments,
} from "../../FirebaseFunctions/FirebaseFunctions";

// const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalCheckout = ({
  billingDetails,
  personalDetails,
  disablePayments,
}) => {
  const dispatch = useDispatch();
  const [hideButton, setHideButton] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const [allowPaypal, setAllowPaypal] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  function generateOrderNumber() {
    // Generate a random integer between 1 and 9999
    const randomNumber = Math.floor(Math.random() * 9999) + 1;

    // Get the current date and time
    const now = new Date();

    // Format the date and time as a string in the format YYYYMMDDHHmmss
    const dateString =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");

    // Concatenate the date and time string with the random number to create the order number
    const orderNumber = dateString + randomNumber.toString().padStart(4, "0");

    return orderNumber;
  }

  const paypal = useRef();

  const handlePaypalPayment = (e) => {
    e.preventDefault();
    if (cartItems[0] && allowPaypal) {
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
        let isAllSubscriptions = cartItems.every((item) => item.subscription);
        let isAllNotSubscriptions = cartItems.every(
          (item) => !item.subscription
        );

        const totalAmount = cartItems.reduce(
          (acc, item) => acc + item.amount,
          0
        );

        const processingFee = (3 / 100) * totalAmount;

        if (isAllNotSubscriptions) {
          let orderNumber = generateOrderNumber();

          window.paypal
            .Buttons({
              disabled: true,
              createOrder: (data, actions, err) => {
                return actions.order.create({
                  intent: "CAPTURE",

                  purchase_units: [
                    {
                      description: `Al-Ihsan Order ${orderNumber} - Ramadan 2023`,
                      amount: {
                        currency_code: "AUD",
                        value: totalAmount + processingFee,
                      },
                    },
                  ],
                });
              },
              onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                updateAmountsInDocuments(cartItems);
                dispatch(emptyCart());
                await addDonation("donations", {
                  name: "Haytch Sax",
                  amount: 9998,
                  anonymous: true,
                  campaignName: "Cancer",
                  location: "Sydney, Australia",
                });
                navigate(`/paymentSuccess/${orderNumber}`, {
                  state: {
                    cartItems,
                    total: totalAmount + processingFee,
                    orderNumber,
                  },
                });
                console.log("Successful order:" + order);
              },
              onError: (err) => {
                console.log(err);
              },
            })
            .render(paypal.current);
        } else if (isAllSubscriptions) {
        }
      } else {
        NotificationManager.error(
          "Please fill in the forms.",
          "Checkout",
          3000
        );
      }
    } else {
      if (!allowPaypal) {
        NotificationManager.error("Paypal unavailable.", "Checkout", 3000);
      } else {
        NotificationManager.error(
          "You have no items in your cart.",
          "Checkout",
          3000
        );
      }
    }

    // e.preventDefault();
  };

  useEffect(() => {
    let isAllSubscriptions = cartItems.every((item) => item.subscription);
    let isAllNotSubscriptions = cartItems.every((item) => !item.subscription);

    if (isAllSubscriptions) {
      // Check if all subscriptions have the same timeframe
      const subscriptionTimeframes = cartItems.map(
        (item) => `${item.start}-${item.end}`
      );
      const isSameTimeframe = subscriptionTimeframes.every(
        (tf) => tf === subscriptionTimeframes[0]
      );
      if (isSameTimeframe) {
        console.log("All items are subscriptions with the same timeframe");
        setAllowPaypal(true);
      } else {
        console.log(
          "All items are subscriptions, but with different timeframes"
        );
      }
    } else if (isAllNotSubscriptions) {
      console.log("No items are subscriptions");
      setAllowPaypal(true);
    } else if (cartItems.length === 0) {
      console.log("Cart is empty");
      setAllowPaypal(false);
    } else {
      console.log("Some items are subscriptions and some are not");

      setAllowPaypal(false);
    }
  }, [cartItems]);

  return (
    <div ref={paypal} className="body-right-total-checkout">
      {!hideButton && allowPaypal ? (
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
      {paypalEnabled && (
        <div ref={paypal} className="paypal-button-container"></div>
      )}
      {!allowPaypal && (
        <div className="checkout-paypal-wrapper">
          <button
            onClick={(e) => handlePaypalPayment(e)}
            className="checkout-paypal-disabled"
          >
            <img src={paypalIcon} />
            Paypal Unavailable
          </button>
          <div class="checkout-paypal-tooltip">
            To use Paypal please follow the following:
            <br />
            <br />
            1. Have only subscriptions with the same schedule.
            <br />
            <br />
            2. Have only one-timer payments.
          </div>
        </div>
      )}
    </div>
  );
};

export default PaypalCheckout;
