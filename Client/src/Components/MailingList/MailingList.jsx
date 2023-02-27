import React, { useState } from "react";
import "./styles.css";
const MailingList = () => {
  const [email, setEmail] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    if (email.length === 0) {
      NotificationManager.error(
        "Please input a valid email.",
        "Mailing List",
        2000
      );
    } else {
      susbcribeEmail();
      setEmail("");
    }
  };

  const susbcribeEmail = async () => {
    const response = await axios
      .post("http://localhost:3002/addSubscriberToMailChimp", {
        email: email,
      })
      .then((response) => {
        NotificationManager.success(
          "You have been subscribed to our mailing list.",
          "Mailing List",
          2000
        );
      })
      .catch((error) => {
        NotificationManager.error("Unable to subscribe.", "Mailing List", 2000);
        console.log(error);
      });
  };

  return (
    <>
      <div className="MailingListSection">
        <div className="MailingListSection-inner">
          <div className="MailingListSection-container">
            <div className="MainUpsellSection-header">
              <h5>Join our mailing list</h5>
              <span className="MailingListSection-span">
                Stay up to date with our campaigns and initiatives.
              </span>
            </div>
            <div className="MailingListSection-input">
              <input />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MailingList;
