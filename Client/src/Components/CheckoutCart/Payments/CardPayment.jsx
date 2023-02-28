import React, { useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import ErrorIcon from "@mui/icons-material/Error";
import { loadStripe } from "@stripe/stripe-js";
import "./styles.css";
import cart from "../../../Redux/cart";
import cards from "../../../assets/cards.svg";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import {
  addDonation,
  updateAmountsInDocuments,
} from "../../../FirebaseFunctions/FirebaseFunctions";
import { useNavigate } from "react-router-dom";
import loader from "./gid.gif";

const CardPayment = ({ billingDetails, personalDetails }) => {
  const { cartItems, anonymous } = useSelector((state) => state.cart);
  const { oneTimeDonation } = useSelector((state) => state.cart);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);

  const navigate = useNavigate();

  const handleCardChange = (event) => {
    setIsCardNumberComplete(event.complete);
  };
  useEffect(() => {
    console.log(personalDetails);
  }, [personalDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems[0] != null) {
      const total = cartItems.reduce((acc, obj) => acc + obj.amount, 0);

      if (
        personalDetails.fullName &&
        personalDetails.email &&
        personalDetails.phoneNumber &&
        billingDetails.streetAddress &&
        billingDetails.city &&
        billingDetails.zip &&
        billingDetails.country
      ) {
        const cardElement = elements.getElement(CardElement);
        if (isCardNumberComplete) {
          setLoading(true);
          setProcessing(true);

          const { error, paymentMethod } = await stripe
            .createPaymentMethod({
              type: "card",
              card: elements.getElement(CardElement),
            })
            .then(async (paymentMethod) => {
              const response = await axios.post(
                "http://localhost:3002/createCustomer",
                {
                  billingDetails: billingDetails,
                  personalDetails: personalDetails,
                  email: personalDetails.email,
                  paymentMethodId: paymentMethod.paymentMethod.id,
                }
              );
              console.log(response.data);
              return response.data;
            })
            .then(async (customer) => {
              const response = await axios.post(
                "http://localhost:3002/createCharges",
                {
                  customerId: customer.id,
                  cart: cartItems,
                  oneTimeDonation,
                }
              );
              return response.data;
            })
            .then(async (response) => {
              let result = response.paymentIntentResultsArray.length > 0;
              console.log(response);
              if (result) {
                for (
                  let i = 0;
                  i < response.paymentIntentResultsArray.length;
                  i++
                ) {
                  const confirmResponse = await stripe.confirmCardPayment(
                    response.paymentIntentResultsArray[i].client_secret,
                    {
                      payment_method:
                        response.paymentIntentResultsArray[i].payment_method,
                    }
                  );
                  console.log(confirmResponse);
                }
              }
              return response.orderNumber;
            })
            .then(async (orderNumber) => {
              // elements.getElement(CardElement).clear();

              // add sales receipt
              axios
                .post("http://localhost:3002/getCustomersQuickbooks", {
                  cartItems,
                  paymentMethod: "Stripe",
                  paymentId: 6,
                  userEmail: billingDetails.email,
                  billingDetails,
                  personalDetails,
                  oneTimeDonation,
                })
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.log(error);
                });
              console.log(cartItems[0]);

              await addDonation("donations", {
                name: anonymous ? "Anonymous" : personalDetails.fullName,
                amount: total,
                anonymous: anonymous,
                campaignName: cartItems[0].name,
                location: `${billingDetails.city}, ${billingDetails.country}`,
                imgLink: cartItems[0].imgUrl,
              }).then((response) => {
                console.log("Donation added to firebase.");
              });

              updateAmountsInDocuments(cartItems);

              NotificationManager.success(
                "Payment successful.",
                "Payment.",
                3000
              );
              navigate(`/paymentSuccess/${orderNumber}`, {
                state: {
                  orderNumber,
                  cartItems,
                  hideCart: true,
                  billingDetails: billingDetails,
                  personalDetails: personalDetails,
                },
              });
              setProcessing(false);
              setLoading(false);
              setError("");
              setErrorMessage("");
            })
            .catch((error) => {
              setLoading(false);
              setProcessing(false);
              setError("Please enter valid details.");
              setErrorMessage("Please enter valid details.");
              NotificationManager.error("Payment failed.", "Payment.", 3000);
            });
        } else {
          setLoading(false);
          setErrorMessage("Please enter your card details.");
        }
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

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="card-error">
          <ErrorIcon />
          <span>{errorMessage}</span>
        </div>
      )}
      <CardElement
        onChange={handleCardChange}
        className="card-element"
        options={CARD_ELEMENT_OPTIONS}
      />
      <div className="body-right-total-checkout">
        {!processing ? (
          <button onClick={(e) => handleSubmit(e)} className="checkout-card">
            <img src={cards} />
            Checkout with Card
          </button>
        ) : (
          <button disabled className="checkout-card-processing">
            <img src={loader} />
            Processing
          </button>
        )}
      </div>
    </form>
  );
};

export default CardPayment;
