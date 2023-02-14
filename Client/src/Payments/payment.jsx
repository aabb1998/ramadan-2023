import React from "react";
import { PaypalButton } from "react-paypal-button-v2";

const payment = () => {
  return (
    <div>
      <PayPalButton
        createOrder={createOrder}
        onApprove={onApprove}
      ></PayPalButton>
    </div>
  );
};

export default payment;
