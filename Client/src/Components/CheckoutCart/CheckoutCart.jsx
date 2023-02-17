import React from "react";
import "./CheckoutCart.css";

const CheckoutCart = () => {
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
                <div className="body-left-personal"></div>
                <div className="body-left-shipping"></div>
                <div className="body-left-payments"></div>
              </div>
              <div className="CheckoutCart-body-right">
                <div className="body-right-summary"></div>
                <div className="body-right-totals"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutCart;
