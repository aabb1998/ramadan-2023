import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Footer from "../Components/Navbars/Footer";
import Header from "../Components/Navbars/Header";
import RecentDonations from "../Components/RecentDonations/RecentDonations";
import RecentDonationsPostCheckout from "../Components/RecentDonations/RecentDonationsPostCheckout";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [uploadProgress, setUploadProgress] = useState(false);
  const [urlFound, setUrlFound] = useState(true);

  const generateInvoice = async () => {
    setUploadProgress(false);
    const data = {
      items: state.cartItems,
      orderNumber: state.orderNumber,
      billingDetails: state.billingDetails,
      personalDetails: state.personalDetails,
    };

    const invoiceGenerator = await axios
      .post("http://localhost:3002/generateInvoice", {
        data,
      })
      .then((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    const url = window.location.href;
    const lastDigits = url.slice(-18); // Extract the last 16 characters
    console.log(lastDigits); // Output: "32143214222"

    if (lastDigits != state?.orderNumber) {
      setUrlFound(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="payment-container">
        {state?.orderNumber && (
          <div className="payment-container-inner">
            <div className="MainDonationSection-header">
              <h5>ORDER SUCCESSFUL!</h5>

              <span>Your donation has successfuly been made.</span>
            </div>
            <div className="payment-container-inner-order">
              <span>Order #{state?.orderNumber}</span>
              <div className="payment-container-buttons">
                <button>Download Invoice</button>
              </div>
            </div>
          </div>
        )}
        {!urlFound && navigate("/P0Vz0&C&m4Ozq^2d")}
      </div>
      <RecentDonationsPostCheckout />
      {/* <Footer /> */}
    </>
  );
};

export default PaymentSuccess;
