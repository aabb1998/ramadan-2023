const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const bodyParser = require("body-parser");
const OAuthClient = require("intuit-oauth");
const handlebars = require("handlebars");
const paypal = require("@paypal/checkout-server-sdk");
const { start } = require("repl");
const quickbooks = require("node-quickbooks");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const ngrok = process.env.NGROK_ENABLED === "true" ? require("ngrok") : null;
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cors());

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_CLIENT_KEY,
  server: "us18",
});

app.post("/runMailChimp", async (req, res) => {
  const runMailChimp = async () => {
    const response = await mailchimp.ping.get();
    console.log(response);
  };

  runMailChimp();
});

app.post("/addSubscriberToMailChimp", async (req, res) => {
  const listId = "dca51ab98c";
  const subscribingUser = {
    email: req.body.email,
  };

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
    });

    res.send(response);

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      e,
    });
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_SECRET_ID;
// const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const client = new paypal.core.PayPalHttpClient(environment);

function generateOrderNumber() {
  // Generate a random integer between 1 and 9999
  const randomNumber = Math.floor(Math.random() * 9999) + 1;

  // Get the current date and time
  const now = new Date();

  // Format the date and time as a string in the format YYYYMMDDHHmmss
  const dateString =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");

  // Concatenate the date and time string with the random number to create the order number
  const orderNumber = dateString + randomNumber.toString().padStart(4, "0");

  return orderNumber;
}

function generatePlanId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let planId = "";

  for (let i = 0; i < 10; i++) {
    planId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return planId;
}

let oauth2_token_json = null;
let redirectUri = "";
let oauthClient = null;

app.get("/authUri", async (req, res) => {
  oauthClient = new OAuthClient({
    clientId: "ABO7mjlXZjdutUJtWYmKYtaFfBdJ6uugnxfnFUfCRh5jGimE2h",
    clientSecret: "tRZqGo6Vsz9XsnYh6SYtYnFJUd3cu4qjlA6YmMOE",
    environment: "sandbox",
    redirectUri: "http://localhost:3002/callback",
  });

  const authUri = await oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "intuit-test",
  });

  res.send(authUri);
});

app.get("/callback", function (req, res) {
  oauthClient
    .createToken(req.url)
    .then(function (authResponse) {
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      console.log(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });
  res.send("");
});

app.get("/api", async (req, res) => {
  const token = JSON.parse(oauth2_token_json);

  // Create a new OAuth2 client using the token
  oauthClient = new OAuthClient({
    clientId: "ABO7mjlXZjdutUJtWYmKYtaFfBdJ6uugnxfnFUfCRh5jGimE2h",
    clientSecret: "tRZqGo6Vsz9XsnYh6SYtYnFJUd3cu4qjlA6YmMOE",
    environment: "sandbox",
    redirectUri: "http://localhost:3002/callback",
    token: token,
  });

  try {
    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    };
    // Make an API call using the OAuth2 token
    const response = await axios.get(
      "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query?query=SELECT * FROM Customer",
      { headers }
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while calling API");
  }
});

app.post("/getCustomersQuickbooks", async (req, res) => {
  console.log(req.body);
  const nameArray = req.body.personalDetails.fullName.split(" ");
  const firstName = nameArray[0]; // "Aniss"
  const lastName = nameArray[1]; // "Abbou"
  const token = JSON.parse(oauth2_token_json);
  // Set up the QuickBooks API endpoint
  const endpoint =
    "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query";

  // Set up the query parameters to search for a customer by email
  const query = `SELECT * FROM Customer WHERE DisplayName = '${req.body.personalDetails.fullName}'`;
  // Create a new OAuth2 client using the token
  console.log(req.body);
  oauthClient = new OAuthClient({
    clientId: "ABO7mjlXZjdutUJtWYmKYtaFfBdJ6uugnxfnFUfCRh5jGimE2h",
    clientSecret: "tRZqGo6Vsz9XsnYh6SYtYnFJUd3cu4qjlA6YmMOE",
    environment: "sandbox",
    redirectUri: "http://localhost:3002/callback",
    token: token,
  });

  let customerId;

  try {
    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    };
    axios
      .get(endpoint, { params: { query }, headers })
      .then(async (response) => {
        const customer = response.data.QueryResponse.Customer;
        if (customer) {
          console.log("customer found.");
          // console.log(customer[0].Id);
          customerId = customer[0].Id;
        } else {
          console.log("Customer not found, creating customer.");

          const customerData = {
            GivenName: firstName,
            FamilyName: lastName,
            PrimaryEmailAddr: {
              Address: req.body.email,
            },
            DisplayName: req.body.personalDetails.fullName,
            BillAddr: {
              Line1: req.body.billingDetails.streetAddress,
              City: req.body.billingDetails.city,
              PostalCode: req.body.billingDetails.zip,
            },
            Job: false,
            SalesTermRef: {
              value: "3",
            },
            CurrencyRef: {
              value: "AUD",
            },
          };
          const createCustomerResponse = await axios.post(
            "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/customer?minorversion=65",
            customerData,
            { headers }
          );
          console.log(
            "New customer created:",
            createCustomerResponse.data.Customer
          );
          customerId = createCustomerResponse.data.Customer.Id;
          console.log("haytch" + customerId);
        }

        for (let i = 0; i < req.body.cartItems.length; i++) {
          let processingFee = (3 / 100) * req.body.cartItems[i].amount;

          const salesReceipt = {
            Line: [
              {
                Description: `Donation ${req.body.cartItems[i].name}`,
                DetailType: "SalesItemLineDetail",
                SalesItemLineDetail: {
                  TaxCodeRef: {
                    value: "5",
                  },

                  Qty: 1,
                  UnitPrice: req.body.cartItems[i].amount,
                  ItemRef: {
                    name: "42020 FG - Tax Ded Donations (NP)",
                    value: "26",
                  },
                  ClassRef: {
                    name: req.body.cartItems[i].quickbooksClassName,
                    value: req.body.cartItems[i].quickbooksClassId,
                  },
                },
                LineNum: 1,
                Amount: req.body.cartItems[i].amount,
                Id: "1",
              },
              {
                Description: `Merchant Fees`,
                DetailType: "SalesItemLineDetail",
                SalesItemLineDetail: {
                  TaxCodeRef: {
                    value: "5",
                  },
                  Qty: 1,
                  UnitPrice: processingFee,
                  ItemRef: {
                    name: "42020 FG - Tax Ded Donations (NP)",
                    value: "26",
                  },
                  ClassRef: {
                    name: "General",
                    value: "5100000000000049941",
                  },
                },
                LineNum: 1,
                Amount: processingFee,
                Id: "1",
              },
            ],
            CustomerRef: {
              value: customerId,
            },
            PaymentMethodRef: {
              name: req.body.paymentMethod,
              value: req.body.paymentId,
            },
          };
          const createSalesReceiptResponse = await axios.post(
            "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/salesreceipt?minorversion=65",
            salesReceipt,
            { headers }
          );
        }

        res.send("Sales receipt created successfully");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.Fault &&
          error.response.data.Fault.Error
        ) {
          const validationErrors = error.response.data.Fault.Error;
          console.log(validationErrors);
          console.error("Validation errors:");
          validationErrors.forEach((validationError) => {
            console.error("-", validationError.Message);
          });
        } else {
          console.error("Error searching for customer:", error);
        }
      });
    // Make an API call using the OAuth2 token
    // const response = await axios.get(
    //   "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query?query=SELECT * FROM Customer",
    //   { headers }
    // );

    // res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while calling API");
  }
});

setInterval(() => {
  console.log("CHECKING");
  const token = JSON.parse(oauth2_token_json);
  const endpoint =
    "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query";
  const query = "SELECT * FROM Class";
  oauthClient = new OAuthClient({
    clientId: "ABO7mjlXZjdutUJtWYmKYtaFfBdJ6uugnxfnFUfCRh5jGimE2h",
    clientSecret: "tRZqGo6Vsz9XsnYh6SYtYnFJUd3cu4qjlA6YmMOE",
    environment: "sandbox",
    redirectUri: "http://localhost:3002/callback",
    token: token,
  });
  try {
    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    };
    axios
      .get(endpoint, { params: { query }, headers })
      .then(async (response) => {
        console.log(response.data.QueryResponse);
      });

    // Make an API call using the OAuth2 token
    // const response = await axios.get(
    //   "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query?query=SELECT * FROM Customer",
    //   { headers }
    // );

    // res.send(response.data);
  } catch (error) {
    console.error(error);
    console.log("TOKEN ERROR");
    oauthClient
      .refresh()
      .then(function (authResponse) {
        console.log(
          `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
        );
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        res.send(oauth2_token_json);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
}, 10000);

app.get("/allQuickbooksClasses", (req, res) => {
  const token = JSON.parse(oauth2_token_json);

  const endpoint =
    "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query";

  // Set up the query parameters to search for a customer by email
  const query = "SELECT * FROM Class";
  // Create a new OAuth2 client using the token
  oauthClient = new OAuthClient({
    clientId: "ABO7mjlXZjdutUJtWYmKYtaFfBdJ6uugnxfnFUfCRh5jGimE2h",
    clientSecret: "tRZqGo6Vsz9XsnYh6SYtYnFJUd3cu4qjlA6YmMOE",
    environment: "sandbox",
    redirectUri: "http://localhost:3002/callback",
    token: token,
  });

  try {
    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    };
    axios
      .get(endpoint, { params: { query }, headers })
      .then(async (response) => {
        console.log(response.data.QueryResponse);
      });

    // Make an API call using the OAuth2 token
    // const response = await axios.get(
    //   "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query?query=SELECT * FROM Customer",
    //   { headers }
    // );

    // res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while calling API");
  }
});

app.get("/retrieveToken", function (req, res) {
  res.send(oauth2_token_json);
});

const countdown = 3600000; // 1 hour in milliseconds
let startTime = Date.now();
let timer = setInterval(() => {
  const elapsedTime = Date.now() - startTime;

  if (elapsedTime >= countdown - 5000) {
    // if there are 5 seconds or less left on the timer, run your code here
    console.log("Time's almost up!");
    resetTimer();
    console.log("GENERATING NEW ACCESS TOKEN");
    oauthClient
      .refresh()
      .then(function (authResponse) {
        console.log(
          `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
        );
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  if (elapsedTime >= countdown) {
    clearInterval(timer); // stop the timer when the countdown reaches zero
    console.log("Time's up!");
    resetTimer();
    // run your code here when the timer ends
    console.log("GENERATING NEW ACCESS TOKEN");

    oauthClient
      .refresh()
      .then(function (authResponse) {
        console.log(
          `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
        );
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
}, 1000); // call the function every 1 second (1000 milliseconds)

// reset the timer
function resetTimer() {
  console.log("Timer reset");
  startTime = Date.now();
}

setInterval(() => {
  const now = new Date().getTime() / 1000;
  const expirationTime = oauth2_token_json.expires_in;
  const timeUntilExpiration = expirationTime - now;

  if (timeUntilExpiration < 300) {
    console.log("GENERATING NEW ACCESS TOKEN");
    oauthClient
      .refresh()
      .then(function (authResponse) {
        console.log(
          `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
        );
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        res.send(oauth2_token_json);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
}, 3600000);

app.get("/refreshAccessToken", function (req, res) {
  oauthClient
    .refresh()
    .then(function (authResponse) {
      console.log(
        `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
      );
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/createCharges", async (req, res) => {
  // const subscriptions = req.body.cartItems.filter(item => item.)
  let { cart } = req.body;
  let { customerId } = req.body;
  let { oneTimeDonation } = req.body;
  let paymentIntentResult;
  let subscriptionResult = [];
  let paymentIntentResultsArray = [];

  let subscriptions = cart.filter((item) => item.subscription);
  let oneTimePayments = cart.filter((item) => !item.subscription);

  const oneTimePaymentsTotal = oneTimePayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const endDate = new Date("2023-04-20");

  const Last10startDate = new Date("2023-04-10");
  const currentDate = Date.now();

  const ramadanDailyDate = new Date("2023-03-22");

  if (currentDate >= ramadanDailyDate.getTime()) {
    ramadanDailyDate.setTime(currentDate);
  }

  if (currentDate >= Last10startDate.getTime()) {
    Last10startDate.setTime(currentDate);
  }

  if (subscriptions.length > 0) {
    await Promise.all(
      subscriptions.map(async (subscription) => {
        console.log(subscription);
        const plan = await stripe.plans.create({
          amount: subscription.amount * 100,
          currency: "aud",
          interval: subscription.scheduleDuration,
          interval_count: 1,
          product: {
            name: `${subscription.name} - ${customerId} Ramadan 2023`,
          },
        });

        if (subscription.start && subscription.end) {
          let todaysDateTimestamp = Math.floor(Date.now() / 1000);
          // const startDate = Math.floor(
          //   (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
          // ); // Current timestamp
          // const endDate = Math.floor(
          //   (Date.now() + 60 * 24 * 60 * 60 * 1000) / 1000
          // ); // 30 days from now\

          // const ramadanStartDate = Math.floor(
          //   new Date("2023-03-22").getTime() / 1000
          // ); // March 20th, 2023
          // const ramadanEndDate = Math.floor(
          //   new Date("2023-04-20").getTime() / 1000
          // ); // April 20th, 2023

          if (subscription.time === "ramadan-daily") {
            const subscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
              billing_cycle_anchor: Math.floor(
                ramadanDailyDate.getTime() / 1000
              ),
              billing_cycle_anchor: Math.floor(
                ramadanDailyDate.getTime() / 1000
              ),
              trial_end: Math.floor(ramadanDailyDate.getTime() / 1000),
              cancel_at: Math.floor(endDate.getTime() / 1000),
              metadata: {
                start_date: ramadanDailyDate,
                end_date: endDate,
              },
            });
            const customer = await stripe.customers.retrieve(customerId);
            const defaultPaymentMethod =
              customer.invoice_settings.default_payment_method;
            const paymentIntent = await stripe.paymentIntents.create({
              amount: 100 * 100,
              currency: "AUD",
              customer: customerId,
              payment_method: defaultPaymentMethod,
              description: `Ramadan 2023 - Order #${generateOrderNumber()} - (first charge)`,
            });
            paymentIntentResult = paymentIntent;
            console.log("paument intent created");
            paymentIntentResultsArray.push(paymentIntent);

            subscriptionResult.push(subscription);
          } else if (subscription.time === "ramadan-last-10") {
            const subscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
              billing_cycle_anchor: Math.floor(
                Last10startDate.getTime() / 1000
              ),
              trial_end: Math.floor(Last10startDate.getTime() / 1000),
              cancel_at: Math.floor(endDate.getTime() / 1000),
            });
            const customer = await stripe.customers.retrieve(customerId);
            const defaultPaymentMethod =
              customer.invoice_settings.default_payment_method;
            const paymentIntent = await stripe.paymentIntents.create({
              amount: 100 * 100,
              currency: "AUD",
              customer: customerId,
              payment_method: defaultPaymentMethod,
              description: `Ramadan 2023 - Order #${generateOrderNumber()} - (first charge)`,
            });
            paymentIntentResultsArray.push(paymentIntent);
            console.log(paymentIntent);

            paymentIntentResult = paymentIntent;
          } else {
            const subscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
            });
          }
        } else {
          await stripe.subscriptions.create({
            customer: customerId,
            items: [
              {
                plan: plan.id,
              },
            ],
          });
        }
      })
    );
  }

  if (oneTimePaymentsTotal > 0) {
    let totalWithProcessing;
    if (oneTimeDonation > 0) {
      let totalAmountCalc = oneTimePaymentsTotal + 10;
      let totalAmountCalcProcessingFee = (3 / 100) * totalAmountCalc;
      totalWithProcessing = totalAmountCalc + totalAmountCalcProcessingFee;
    } else {
      let totalAmountCalc = oneTimePaymentsTotal;
      let totalAmountCalcProcessingFee = (3 / 100) * totalAmountCalc;
      totalWithProcessing = totalAmountCalc + totalAmountCalcProcessingFee;
    }

    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethod =
      customer.invoice_settings.default_payment_method;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalWithProcessing * 100,
      currency: "AUD",
      customer: customerId,
      payment_method: defaultPaymentMethod,
      description: `Ramadan 2023 - Order #${generateOrderNumber()}`,
    });
    paymentIntentResult = paymentIntent;
    console.log(paymentIntent);
    paymentIntentResultsArray.push(paymentIntent);
  }

  let orderNumber = generateOrderNumber();

  res.status(200).send({
    paymentIntentResult,
    subscriptionResult,
    orderNumber,
    cart,
    paymentIntentResultsArray,
  });
});

app.post("/createCustomer", async (req, res) => {
  console.log(req.body);
  try {
    const customers = await stripe.customers.list({ email: req.body.email });
    let customerCheck;
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: req.body.email,
        name: req.body.personalDetails.fullName,
        phone: req.body.personalDetails.phoneNumber,
        address: {
          city: req.body.billingDetails.city,
          country: req.body.billingDetails.country,
          postal_code: req.body.billingDetails.zip,
          line1: req.body.billingDetails.streetAddress,
        },
      });
    }

    const paymentMethod = await stripe.paymentMethods.attach(
      req.body.paymentMethodId,
      { customer: customer.id }
    );

    // set card as default
    const defaultCard = await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    });
    res.json(defaultCard);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occured while creating a customer." });
  }
});

app.post("/chargeCustomer", async (req, res) => {
  console.log(req.body);
  let { cart } = req.body;

  let totalOneTimePayment = cart.reduce((acc, item) => {
    if (!item.schedule) {
      return acc + item.amount;
    }
    return acc;
  }, 0);
  let processingFee = (3 / 100) * totalOneTimePayment;
  totalOneTimePayment += processingFee;

  let totalSubPayment = cart.reduce((acc, item) => {
    if (item.schedule) {
      return acc + item.amount;
    }
    return acc;
  }, 0);

  let processingFeeSub = (3 / 100) * totalSubPayment;
  totalSubPayment += processingFeeSub;

  let paymentIntent;
  let subscription;

  try {
    const customer = await stripe.customers.retrieve(req.body.customerId);
    const defaultPaymentMethod =
      customer.invoice_settings.default_payment_method;

    if (totalOneTimePayment > 0) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalOneTimePayment * 100,
        currency: "AUD",
        customer: req.body.customerId,
        payment_method: defaultPaymentMethod,
        description: `Ramadan 2023 - Order #${generateOrderNumber()}`,
      });
    }

    if (totalSubPayment > 0) {
      const plan = await stripe.plans.create({
        amount: totalSubPayment * 100,
        currency: "aud",
        interval: "month",
        product: {
          name: "Ramadan subscription.",
        },
        id: generatePlanId(),
      });

      if (plan) {
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              plan: plan.id,
            },
          ],
        });
        console.log(subscription);
      }
    }

    res.json(paymentIntent);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while charging the customer." });
  }
});

app.post("/create-payment", async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(id);
    console.log(paymentMethod);
    res.json({
      paymentMethod: paymentMethod,
    });
  } catch (error) {
    console.error(error);

    // Send an error response back to the client
    res.status(500).json({
      message: "An error occurred while processing the payment.",
    });
  }
});
app.post("/ramadanWebsite", (req, res) => {
  const filepath = path.join(__dirname, "./EmailTemplates/test.html");

  const source = fs.readFileSync(filepath, "utf-8").toString();
  const template = handlebars.compile(source);

  const replacements = {
    fullname: "df",
    downloadUrl: "df",
  };

  const htmlToSend = template(replacements);

  var subject = `OATW - Order ${req.body.orderNumber}.`;
  var message = "OATW Order Invoice";

  var mail = {
    from: `OATW <${process.env.MAIL_EMAIL_USER}>`,
    to: "saxedeen@gmail.com",
    subject: "test",
    text: "sdfsdf",

    html: htmlToSend,
  };

  const client = nodemailer.createTransport({
    service: "Outlook365",
    auth: {
      user: "mail@alihsan.org.au",
      pass: "2814OydROEkC",
    },
  });

  client.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
      console.log(err);
    } else {
      res.json({
        status: "success",
      });
      console.log("Success");
    }
  });
});

app.listen(3002, () => {
  console.log("Example app is listening on port 3002");
});
