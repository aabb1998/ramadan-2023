import React from "react";
import { NotificationManager } from "react-notifications";
import cards from "../../assets/cards.svg";

const CardCheckout = ({ billingDetails, personalDetails }) => {
  const handleCardPayment = (e) => {
    e.preventDefault();
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
      // At least one field is empty, show an error message...
      NotificationManager.error("Please fill in the forms.", "Checkout", 3000);
    }
  };

  return (
    <div className="body-right-total-checkout">
      <button onClick={(e) => handleCardPayment(e)} className="checkout-card">
        <img src={cards} />
        Checkout with Card
      </button>
    </div>
  );
};

export default CardCheckout;
