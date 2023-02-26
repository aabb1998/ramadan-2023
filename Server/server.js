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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cors());

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

app.get("/getCustomersQuickbooks", async (req, res) => {
  console.log(req.body);
  const token = JSON.parse(oauth2_token_json);
  // Set up the QuickBooks API endpoint
  const endpoint =
    "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/query";

  // Set up the query parameters to search for a customer by email
  const query =
    "SELECT * FROM Customer WHERE PrimaryEmailAddr = 'polyester@gmail.com'";
  // Create a new OAuth2 client using the token
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
            GivenName: "John",
            FamilyName: "Doe",
            PrimaryEmailAddr: {
              Address: "polyester@gmail.com",
            },
            DisplayName: "John Doe",
            BillAddr: {
              Line1: "123 Main St",
              City: "Anytown",
              CountrySubDivisionCode: "CA",
              PostalCode: "90210",
              Lat: "34.148",
              Long: "-118.383",
            },
            Job: false,
            SalesTermRef: {
              value: "3",
            },
            CurrencyRef: {
              value: "USD",
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
          let newCustomerId = createCustomerResponse.data.Customer;
          console.log("haytch" + newCustomerId);
        }

        // create sales receipt
        const salesReceipt = {
          Line: [
            {
              Description: "Pest Control Services",
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: {
                TaxCodeRef: {
                  value: "5",
                },
                Qty: 1,
                UnitPrice: 35,
                ItemRef: {
                  name: "42020 FG - Tax Ded Donations (NP)",
                  value: "26",
                },
              },
              LineNum: 1,
              Amount: 35.0,
              Id: "1",
            },
          ],
          CustomerRef: {
            value: customerId,
          },
          ClassRef: {
            name: "FP - 10d - Ramadan Lebanon Food Packs",
            value: "5100000000000049934",
          },
        };

        const createSalesReceiptResponse = await axios.post(
          "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365281993540/salesreceipt?minorversion=65",
          salesReceipt,
          { headers }
        );
        // console.log("Sales receipt created:", createSalesReceiptResponse);
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
  let paymentIntentResult;
  let subscriptionResult = [];

  let subscriptions = cart.filter((item) => item.subscription);
  let oneTimePayments = cart.filter((item) => !item.subscription);

  const oneTimePaymentsTotal = oneTimePayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  if (subscriptions.length > 0) {
    Promise.all(
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
          // const startDate = Math.floor(Date.parse(subscription.start) / 1000);
          // const endDate = Math.floor(Date.parse(subscription.end) / 1000);

          // let ramadanStartDate = new Date("2023-03-22");
          // let ramadanStartDateTimestamp = Math.floor(
          //   ramadanStartDate.getTime() / 1000
          // );

          // let ramadanEndDate = new Date("2023-04-20");
          // let ramadanEndDateTimestamp = Math.floor(
          //   ramadanEndDate.getTime() / 1000
          // );

          // let ramadanLast10Start = new Date("2023-04-10");
          // let ramadanLast10StartTimestamp = Math.floor(
          //   ramadanLast10Start.getTime() / 1000
          // );

          let todaysDateTimestamp = Math.floor(Date.now() / 1000);
          const startDate = Math.floor(
            (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
          ); // Current timestamp
          const endDate = Math.floor(
            (Date.now() + 60 * 24 * 60 * 60 * 1000) / 1000
          ); // 30 days from now\

          const ramadanStartDate = Math.floor(
            new Date("2023-03-22").getTime() / 1000
          ); // March 20th, 2023
          const ramadanEndDate = Math.floor(
            new Date("2023-04-20").getTime() / 1000
          ); // April 20th, 2023

          if (subscription.time === "ramadan-daily") {
            const subscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
              billing_cycle_anchor: new Date("2023-03-01").getTime(), // Start billing on March 1, 2023
              cancel_at: new Date("2023-04-01").getTime(), // Cancel subscription on April 1, 2023

              metadata: {
                start_date: startDate,
                end_date: endDate,
              },
            });
            subscriptionResult.push(subscription);
          } else if (subscription.time === "ramadan-last-10") {
            const subscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
              billing_cycle_anchor: ramadanLast10StartTimestamp,
              cancel_at: ramadanEndDateTimestamp,
            });
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
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethod =
      customer.invoice_settings.default_payment_method;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: oneTimePaymentsTotal * 100,
      currency: "AUD",
      customer: customerId,
      payment_method: defaultPaymentMethod,
      description: `Ramadan 2023 - Order #${generateOrderNumber()}`,
    });
    paymentIntentResult = paymentIntent;
  }

  let orderNumber = generateOrderNumber();

  res
    .status(200)
    .send({ paymentIntentResult, subscriptionResult, orderNumber, cart });
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
