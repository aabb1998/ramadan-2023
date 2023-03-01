import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Footer from "../Components/Navbars/Footer";
import Header from "../Components/Navbars/Header";
import RecentDonations from "../Components/RecentDonations/RecentDonations";
import RecentDonationsPostCheckout from "../Components/RecentDonations/RecentDonationsPostCheckout";
import "./PaymentSuccess.css";
import loader from "./gid.gif";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { storage } from "firebase/app";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [urlFound, setUrlFound] = useState(true);
  const [downloadLink, setDownloadLink] = useState(null);
  const storage = getStorage();
  const API_URL = process.env.REACT_APP_API_URL;
  const generateInvoice = async () => {
    setGenerating(true);
    const data = {
      items: state.cartItems,
      orderNumber: state.orderNumber,
      billingDetails: state.billingDetails,
      personalDetails: state.personalDetails,
      oneTimeDonation: state.oneTimeDonation,
    };

    const invoiceGenerator = await axios
      .post(`http://localhost:3002/generateInvoice`, {
        data,
      })
      .then((response) => {
        console.log(response);
        if (!response.data.invoice.pdf) {
          setGenerating(false);
          console.log("Unable to generate invoice.");
        } else {
          setGenerated(true);
          setGenerating(false);
          setInvoiceFile(response.data.invoice.pdf);
        }
      })
      .catch((error) => {
        setGenerating(false);
        console.log(error);
      });
  };

  const handleFileUpload = async () => {
    let downloadUrl;
    const userFolderRef = ref(storage, `invoices/${state.orderNumber}`);
    uploadString(userFolderRef, invoiceFile, "base64", {
      contentType: "application/pdf",
    }).then((snapshot) => {
      getDownloadURL(userFolderRef).then(function (downloadUrl) {
        setDownloadLink(downloadUrl);
      });
    });
    setDownloadLink(downloadUrl);
  };

  useEffect(() => {
    if (!generated) {
      generateInvoice();
    }
  }, []);

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

  useEffect(() => {
    handleFileUpload();
  }, [invoiceFile]);

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
                {generating && !downloadLink ? (
                  <button style={{ cursor: "default" }}>
                    <img style={{ width: "20px" }} src={loader} />
                  </button>
                ) : (
                  <button onClick={() => window.open(downloadLink, "_blank")}>
                    Download Invoice
                  </button>
                )}
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
