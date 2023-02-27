import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import cards from "../../assets/cards.svg";
import cart from "../../Redux/cart";
import "./CheckoutCart.css";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CardPayment from "./Payments/CardPayment";
import { loadStripe } from "@stripe/stripe-js";

const CardCheckout = ({ billingDetails, personalDetails }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const { oneTimeDonation } = useSelector((state) => state.cart);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    fetch("http://localhost:3002/config").then(async (res) => {
      const { publishableKey } = await res.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const handleCardPayment = async (e) => {
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
    <>
      <Elements stripe={stripePromise}>
        <CardPayment
          billingDetails={billingDetails}
          personalDetails={personalDetails}
        />
      </Elements>
    </>
  );
};

export default CardCheckout;
