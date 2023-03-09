import React, { useEffect, useState } from "react";
import axios from "axios";

const TestPage = () => {
  const [token, setToken] = useState(null);

  const [disabled, setDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    let cooldownTimeout;
    if (cooldown) {
      // set a 20-second cooldown timer
      cooldownTimeout = setTimeout(() => {
        setDisabled(false);
        setCooldown(false);
      }, 20000);
    }

    // Clear timeout if component unmounts
    return () => clearTimeout(cooldownTimeout);
  }, [cooldown]);

  const handleClick = () => {
    if (!disabled) {
      setDisabled(true);
      setCooldown(true);
      // perform your button action here
      axios
        .post("http://localhost:3002/syncReceipts")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleQuickbooks = async () => {
    // const response = await axios.get("http://localhost:3002/authUri");
    axios
      .get("http://localhost:3002/authUri")
      .then((response) => {
        console.log("The Auth Uris is: " + response.data);
        const authUri = response.data;

        const parameters =
          "location=1,width=800,height=650" +
          ",left=" +
          (window.innerWidth - 800) / 2 +
          ",top=" +
          (window.innerHeight - 650) / 2;

        const win = window.open(authUri, "connectPopup", parameters);
        const pollOAuth = window.setInterval(() => {
          //   try {
          //     if (win.document.URL.indexOf("code") !== -1) {
          //       window.clearInterval(pollOAuth);
          //       win.close();
          //       window.location.reload();
          //     }
          //   } catch (e) {
          //     console.log(e);
          //   }
        }, 100);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const retrieveToken = () => {
    axios
      .get("http://localhost:3002/retrieveToken")
      .then((response) => {
        const token =
          response.data ??
          "Please Authorize Using Connect to Quickbooks first!";
        console.log(token);
        setToken(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function refreshToken() {
    axios
      .get("http://localhost:3002/refreshAccessToken")
      .then((response) => {
        const token =
          response.data ??
          "Please Authorize Using Connect to Quickbooks first!";
        console.log(token);
        setToken(token);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const apiTest = async () => {
    axios
      .get("http://localhost:3002/allQuickbooksClasses")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const syncReceipts = async () => {
    axios
      .post("http://localhost:3002/syncReceipts")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button onClick={handleQuickbooks}>Quickbooks</button>
      <button onClick={retrieveToken}>Retrieve token</button>
      <button disabled={token ? true : false} onClick={refreshToken}>
        Refresh token
      </button>
      <button onClick={apiTest}>test</button>
      <button disabled={disabled} onClick={handleClick}>
        {disabled ? "Button is on cooldown" : "Sync"}
      </button>
    </div>
  );
};

export default TestPage;
