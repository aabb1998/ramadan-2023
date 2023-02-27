import React, { useState } from "react";
import axios from "axios";

const TestPage = () => {
  const [token, setToken] = useState(null);

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

  return (
    <div>
      <button onClick={handleQuickbooks}>Quickbooks</button>
      <button onClick={retrieveToken}>Retrieve token</button>
      <button disabled={token ? true : false} onClick={refreshToken}>
        Refresh token
      </button>
      <button onClick={apiTest}>test</button>
    </div>
  );
};

export default TestPage;
