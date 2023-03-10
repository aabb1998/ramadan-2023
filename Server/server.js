const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
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
const easyinvoice = require("easyinvoice");
const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  deleteDoc,
} = require("firebase/firestore");
const { sale } = require("paypal-rest-sdk");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.raw({ type: "*/*" }));
// // const rawBodyParser = bodyParser.raw({ type: "*/*" });
// app.use(bodyParser.json());

// app.use(cors());
app.use(express.json());
app.use(cors());

// STRIPE WEBHOOKS
const endpointSecret =
  "whsec_79ecdb9f07ca450c8426328a114b65d68e80b8bfd2058f19b9bf81dc30c29e26";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      const rawBody = request.body;
      console.log(rawBody.data.object.metadata);
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // console.log("Payment successed");
        console.log("SUCCESS" + paymentIntentSucceeded);
        // Then define and call a function to handle the event payment_intent.succeeded

        const addReceiptToQuickbooks = () => {
          const nameArray =
            paymentIntentSucceeded.data.object.metadata.fullName.split(" ");
          const firstName = nameArray[0]; // "Aniss"
          const lastName = nameArray[1]; // "Abbou"

          const token = JSON.parse(oauth2_token_json);
          const endpoint =
            "https://quickbooks.api.intuit.com/v3/company/403496926/query";

          // Set up the query parameters to search for a customer by email
          const query = `SELECT * FROM Customer WHERE DisplayName = '${paymentIntentSucceeded.data.object.metadata.fullName}'`;
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
                  customerId = customer[0].Id;

                  let totalAmount =
                    paymentIntentSucceeded.data.object.amount / 100;
                  let processingFee = 0.03 * totalAmount;
                  let totalMinusFee = totalAmount - processingFee;
                  let salesReceiptLines = [];

                  const salesReceiptLine = {
                    Description: `Donation ${paymentIntentSucceeded.data.object.metadata.name}`,
                    DetailType: "SalesItemLineDetail",
                    SalesItemLineDetail: {
                      TaxCodeRef: {
                        value: "6",
                      },

                      Qty: 1,
                      UnitPrice: totalMinusFee,
                      ItemRef: {
                        name: "42020 FG - Tax Ded Donations (NP)",
                        value: "26",
                      },
                      ClassRef: {
                        name: paymentIntentSucceeded.data.object.metadata
                          .quickbooksName,
                        value:
                          paymentIntentSucceeded.data.object.metadata
                            .quickbooksId,
                      },
                    },
                    LineNum: 1,
                    Amount: totalMinusFee,
                    Id: `1`,
                  };
                  salesReceiptLines.push(salesReceiptLine);
                  const processingFeeLine = {
                    Description: `Merchant Fees`,
                    DetailType: "SalesItemLineDetail",
                    SalesItemLineDetail: {
                      TaxCodeRef: {
                        value: "6",
                      },
                      Qty: 1,
                      UnitPrice: processingFee,
                      ItemRef: {
                        name: "42020 FG - Tax Ded Donations (NP)",
                        value: "26",
                      },
                      ClassRef: {
                        name: "General",
                        value: 5100000000000049941,
                      },
                    },
                    LineNum: 2,
                    Amount: processingFee,
                    Id: `2`,
                  };

                  salesReceiptLines.push(processingFeeLine);
                  console.log(salesReceiptLines);

                  const salesReceipt = {
                    Line: salesReceiptLines,
                    CustomerRef: {
                      value: customerId,
                    },
                    PaymentMethodRef: {
                      name: paymentIntentSucceeded.data.object.metadata
                        .paymentMethodRefName,
                      value: paymentIntentSucceeded.data.object.metadata.value,
                    },
                    TotalAmt: totalAmount,
                  };
                }
              });
          } catch (error) {
            console.log(error);
          }
        };

        break;
      // ... handle other event types
      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

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
  const listId = process.env.MAILCHIMP_LIST_ID;
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

app.post("/generateInvoice", async (req, res) => {
  console.log(req.body.data);
  let items = [];
  for (let i = 0; i < req.body.data.items.length; i++) {
    let item = {
      quantity: 1,
      description: `Donation - ${req.body.data.items[i].name}`,
      "tax-rate": 3,
      price: req.body.data.items[i].amount,
    };
    items.push(item);
  }

  if (req.body.data.oneTimeDonation > 0) {
    let newItem = {
      quantity: 1,
      description: "One time donation",
      "tax-rate": 3,
      price: 10,
    };
    items.push(newItem);
  }

  console.log(items);

  var data = {
    // Customize enables you to provide your own templates
    // Please review the documentation for instructions and examples
    customize: {
      //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
    },
    images: {
      // The logo on top of your invoice
      // The invoice background
      background:
        "https://firebasestorage.googleapis.com/v0/b/ramadan2023-703d7.appspot.com/o/invoices%2FbackgroundInvoice.png?alt=media&token=449950f7-c937-426e-8e35-6543de5e7aed",
    },
    // Your own data
    sender: {
      company: "AlIhsan Foundation",
      address: "176 Waldron Road",
      zip: "2162",
      city: "Chester Hill",
      country: "Australia",
      "Payment Date": "23/23/23",

      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    // Your recipient
    client: {
      company: req.body.data.personalDetails.fullName,
      address: req.body.data.billingDetails.streetAddress,
      zip: req.body.data.billingDetails.zip,
      city: req.body.data.billingDetails.city,
      country: req.body.data.billingDetails.country,
      // "Payment Date": "23/23/23",
      // "custom3": "custom value 3"
    },
    information: {
      number: req.body.data.orderNumber,
      date: "12-12-2021",
      "due-date": "N/A",
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    products: items,
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Thank you for your donations.",
    // Settings to customize your invoice
    settings: {
      currency: "AUD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
      "tax-notation": "Processing Fee", // Defaults to 'vat'
      // "margin-top": 25, // Defaults to '25'
      // "margin-right": 25, // Defaults to '25'
      // "margin-left": 25, // Defaults to '25'
      // "margin-bottom": 25, // Defaults to '25'
      // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
      // "height": "1000px", // allowed units: mm, cm, in, px
      // "width": "500px", // allowed units: mm, cm, in, px
      // "orientation": "landscape", // portrait or landscape, defaults to portrait
    },
    // Translate your invoice to your preferred language
    translate: {
      invoice: "ORDER RECEIPT", // Default to 'INVOICE'
      number: "Order no.", // Defaults to 'Number'
      date: "-", // Default to 'Date'
      // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
      products: "Campaign Donations", // Defaults to 'Products'
      // "quantity": "Aantal", // Default to 'Quantity'
      // "price": "Prijs", // Defaults to 'Price'
      // "product-total": "Totaal", // Defaults to 'Total'
      // "total": "Totaal" // Defaults to 'Total'
    },
  };
  try {
    const result = await easyinvoice.createInvoice(data);
    return res.send({
      status: true,
      invoice: result,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: false,
    });
  }
});

app.get("/allQuickbooksClasses", (req, res) => {
  const token = JSON.parse(oauth2_token_json);
  const endpoint =
    "https://quickbooks.api.intuit.com/v3/company/403496926/query";

  // Set up the query parameters to search for a customer by email
  const query = "SELECT * FROM Class";
  // Create a new OAuth2 client using the token

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
    //   "https://sandbox-quickbooks.api.intuit.com/v3/company/403496926/query?query=SELECT * FROM Customer",
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
  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: "production",
    redirectUri: "http://localhost:3002/callback",
  });
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
  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: "production",
    redirectUri: "http://localhost:3002/callback",
  });
  const now = new Date().getTime() / 1000;
  if (oauth2_token_json) {
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
  }
}, 3600000);

app.get("/refreshAccessToken", function (req, res) {
  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: "production",
    redirectUri: "http://localhost:3002/callback",
  });
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

// app.post("/createCharges", async (req, res) => {
// 	// const subscriptions = req.body.cartItems.filter(item => item.)
// 	let { cart } = req.body;
// 	let { customerId } = req.body;
// 	let { oneTimeDonation } = req.body;
// 	let { billingDetails } = req.body;
// 	let { personalDetails } = req.body;
// 	let { orderNumber } = req.body;
// 	let paymentIntentResult;
// 	let subscriptionResult = [];
// 	let paymentIntentResultsArray = [];

// 	let subscriptions = cart.filter((item) => item.subscription);
// 	let oneTimePayments = cart.filter((item) => !item.subscription);

// 	const oneTimePaymentsTotal = oneTimePayments.reduce(
// 		(total, payment) => total + payment.amount,
// 		0
// 	);

// 	const endDate = new Date("2023-04-20");

// 	const Last10startDate = new Date("2023-04-10");
// 	const currentDate = Date.now();

// 	const ramadanDailyDate = new Date("2023-03-22");

// 	if (currentDate >= ramadanDailyDate.getTime()) {
// 		ramadanDailyDate.setTime(currentDate);
// 	}

// 	if (currentDate >= Last10startDate.getTime()) {
// 		Last10startDate.setTime(currentDate);
// 	}

// 	if (subscriptions.length > 0) {
// 		await Promise.all(
// 			subscriptions.map(async (subscription) => {
// 				console.log(subscription);
// 				const plan = await stripe.plans.create({
// 					amount:
// 						(3 / 100) * subscription.amount * 100 +
// 						subscription.amount * 100,
// 					currency: "aud",
// 					interval: subscription.scheduleDuration,
// 					interval_count: 1,
// 					product: {
// 						name: `${subscription.name} - ${customerId} Ramadan 2023`,
// 					},
// 				});

// 				if (subscription.start && subscription.end) {
// 					let todaysDateTimestamp = Math.floor(Date.now() / 1000);
// 					// const startDate = Math.floor(
// 					//   (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
// 					// ); // Current timestamp
// 					// const endDate = Math.floor(
// 					//   (Date.now() + 60 * 24 * 60 * 60 * 1000) / 1000
// 					// ); // 30 days from now\

// 					// const ramadanStartDate = Math.floor(
// 					//   new Date("2023-03-22").getTime() / 1000
// 					// ); // March 20th, 2023
// 					// const ramadanEndDate = Math.floor(
// 					//   new Date("2023-04-20").getTime() / 1000
// 					// ); // April 20th, 2023

// 					if (subscription.time === "ramadan-daily") {
// 						console.log(subscription);
// 						const userSubscription =
// 							await stripe.subscriptions.create({
// 								customer: customerId,
// 								items: [
// 									{
// 										plan: plan.id,
// 									},
// 								],
// 								billing_cycle_anchor: Math.floor(
// 									ramadanDailyDate.getTime() / 1000
// 								),
// 								billing_cycle_anchor: Math.floor(
// 									ramadanDailyDate.getTime() / 1000
// 								),
// 								trial_end: Math.floor(
// 									ramadanDailyDate.getTime() / 1000
// 								),
// 								cancel_at: Math.floor(endDate.getTime() / 1000),
// 								metadata: {
// 									start_date: ramadanDailyDate,
// 									end_date: endDate,
// 									paymentMethodRefName: "Stripe",
// 									value: 6,
// 									fullName: personalDetails.fullName,
// 									quickbooksName:
// 										subscription.quickbooksClassName,
// 									quickbooksId:
// 										subscription.quickbooksClassId,
// 									campaignName: subscription.name,
// 								},
// 							});
// 						const customer = await stripe.customers.retrieve(
// 							customerId
// 						);
// 						const defaultPaymentMethod =
// 							customer.invoice_settings.default_payment_method;
// 						try {
// 							const paymentIntent =
// 								await stripe.paymentIntents.create({
// 									amount:
// 										(subscription.amount +
// 											0.03 * subscription.amount) *
// 										100,
// 									currency: "AUD",
// 									customer: customerId,
// 									payment_method: defaultPaymentMethod,
// 									description: `Ramadan 2023 - Order #${orderNumber} - (first charge)`,
// 								});
// 							paymentIntentResult = paymentIntent;
// 							console.log("paument intent created");
// 							paymentIntentResultsArray.push(paymentIntent);

// 							subscriptionResult.push(subscription);
// 							console.error(error);
// 							console.log("PAYMENT FAILLEDDDDDD");
// 							res.status(200).send({
// 								success: false,
// 								message: "Payment failed",
// 							});
// 						} catch {
// 							console.error(error);
// 							console.log("PAYMENT FAILLEDDDDDD");
// 							res.status(500).send({
// 								success: true,
// 								message: "Payment successful",
// 							});
// 						}
// 					} else if (subscription.time === "ramadan-last-10") {
// 						console.log(subscription);
// 						const userSubscription =
// 							await stripe.subscriptions.create({
// 								customer: customerId,
// 								items: [
// 									{
// 										plan: plan.id,
// 									},
// 								],
// 								billing_cycle_anchor: Math.floor(
// 									Last10startDate.getTime() / 1000
// 								),
// 								trial_end: Math.floor(
// 									Last10startDate.getTime() / 1000
// 								),
// 								cancel_at: Math.floor(endDate.getTime() / 1000),
// 								metadata: {
// 									start_date: ramadanDailyDate,
// 									end_date: endDate,
// 									paymentMethodRefName: "Stripe",
// 									value: 6,
// 									fullName: personalDetails.fullName,
// 									quickbooksName:
// 										subscription.quickbooksClassName,
// 									quickbooksId:
// 										subscription.quickbooksClassId,
// 									campaignName: subscription.name,
// 								},
// 							});
// 						const customer = await stripe.customers.retrieve(
// 							customerId
// 						);
// 						const defaultPaymentMethod =
// 							customer.invoice_settings.default_payment_method;
// 						try {
// 							const paymentIntent =
// 								await stripe.paymentIntents.create({
// 									amount:
// 										(subscription.amount +
// 											0.03 * subscription.amount) *
// 										100,
// 									currency: "AUD",
// 									customer: customerId,
// 									payment_method: defaultPaymentMethod,
// 									description: `Ramadan 2023 - Order #${orderNumber} - (first charge)`,
// 								});
// 							paymentIntentResult = paymentIntent;

// 							paymentIntentResultsArray.push(paymentIntent);
// 							console.log(paymentIntent);
// 						} catch (error) {
// 							console.error("Error creating payment: ", error);
// 							return { error: error.message };
// 						}
// 					} else {
// 						const userSubscription =
// 							await stripe.subscriptions.create({
// 								customer: customerId,
// 								description: `Ramadan 2023 - Order #${orderNumber} - Subscription`,

// 								items: [
// 									{
// 										plan: plan.id,
// 									},
// 								],
// 								metadata: {
// 									start_date: ramadanDailyDate,
// 									end_date: endDate,
// 									paymentMethodRefName: "Stripe",
// 									value: 6,
// 									fullName: personalDetails.fullName,
// 									quickbooksName:
// 										subscription.quickbooksClassName,
// 									quickbooksId:
// 										subscription.quickbooksClassId,
// 									campaignName: subscription.name,
// 								},
// 							});
// 					}
// 				} else {
// 					await stripe.subscriptions.create({
// 						customer: customerId,
// 						description: `Ramadan 2023 - Order #${orderNumber} - Subscription`,

// 						items: [
// 							{
// 								plan: plan.id,
// 							},
// 						],
// 						metadata: {
// 							start_date: ramadanDailyDate,
// 							end_date: endDate,
// 							paymentMethodRefName: "Stripe",
// 							value: 6,
// 							fullName: personalDetails.fullName,
// 							quickbooksName: subscription.quickbooksClassName,
// 							quickbooksId: subscription.quickbooksClassId,
// 							campaignName: subscription.name,
// 						},
// 					});
// 				}
// 			})
// 		);
// 	}

// 	if (oneTimePaymentsTotal > 0) {
// let totalWithProcessing;
// if (oneTimeDonation > 0) {
// 	let totalAmountCalc = oneTimePaymentsTotal + 10;
// 	let totalAmountCalcProcessingFee = (3 / 100) * totalAmountCalc;
// 	totalWithProcessing =
// 		totalAmountCalc + totalAmountCalcProcessingFee;
// } else {
// 	let totalAmountCalc = oneTimePaymentsTotal;
// 	let totalAmountCalcProcessingFee = (3 / 100) * totalAmountCalc;
// 	totalWithProcessing =
// 		totalAmountCalc + totalAmountCalcProcessingFee;
// }

// 		const customer = await stripe.customers.retrieve(customerId);
// 		const defaultPaymentMethod =
// 			customer.invoice_settings.default_payment_method;
// 		try {
// 			const paymentIntent = await stripe.paymentIntents.create({
// 				amount: Math.round(totalWithProcessing * 100),
// 				currency: "AUD",
// 				customer: customerId,
// 				payment_method: defaultPaymentMethod,
// 				description: `Ramadan 2023 - Order #${orderNumber}`,
// 			});
// 			paymentIntentResult = paymentIntent;
// 			console.log(paymentIntent);
// 			paymentIntentResultsArray.push(paymentIntent);
// 			res.status(200).send({
// 				success: true,
// 				message: "Payment successful",
// 			});
// 		} catch {
// 			console.error(error);
// 			console.log("PAYMENT FAILLEDDDDDD");
// 			res.status(500).send({
// 				success: false,
// 				message: "Payment failed",
// 			});
// 		}
// 	} else {
// 		let totalWithProcessing;

// 		if (oneTimeDonation > 0) {
// 			let totalAmountCalc = 10;
// 			let totalAmountCalcProcessingFee = (3 / 100) * totalAmountCalc;
// 			totalWithProcessing =
// 				totalAmountCalc + totalAmountCalcProcessingFee;
// 			const customer = await stripe.customers.retrieve(customerId);
// 			const defaultPaymentMethod =
// 				customer.invoice_settings.default_payment_method;
// 			try {
// 				const paymentIntent = await stripe.paymentIntents.create({
// 					amount:
// 						(subscription.amount + 0.03 * subscription.amount) *
// 						100,
// 					currency: "AUD",
// 					customer: customerId,
// 					payment_method: defaultPaymentMethod,
// 					description: `Ramadan 2023 - Order #${orderNumber} - (first charge)`,
// 				});
// 				paymentIntentResult = paymentIntent;
// 				console.log("paument intent created");
// 				paymentIntentResultsArray.push(paymentIntent);
// 				subscriptionResult.push(subscription);
// 				res.status(200).send({
// 					success: true,
// 					message: "Payment successful",
// 				});
// 			} catch (error) {
// 				console.error(error);
// 				console.log("PAYMENT FAILLEDDDDDD");
// 				res.status(500).send({
// 					success: false,
// 					message: "Payment failed",
// 				});
// 			}
// 			// const paymentIntent = await stripe.paymentIntents.create({
// 			// 	amount: Math.round(totalWithProcessing * 100),
// 			// 	currency: "AUD",
// 			// 	customer: customerId,
// 			// 	payment_method: defaultPaymentMethod,
// 			// 	description: `Ramadan 2023 - Order #${orderNumber}`,
// 			// });
// 			// paymentIntentResult = paymentIntent;
// 			// console.log(paymentIntent);
// 			// paymentIntentResultsArray.push(paymentIntent);
// 		}
// 	}

// 	res.status(200).send({
// 		paymentIntentResult,
// 		subscriptionResult,
// 		orderNumber,
// 		cart,
// 		paymentIntentResultsArray,
// 	});
// });

app.post("/createCharges", async (req, res) => {
  try {
    let { cart } = req.body;
    let { customerId } = req.body;
    let { oneTimeDonation } = req.body;
    let { billingDetails } = req.body;
    let { personalDetails } = req.body;
    let { orderNumber } = req.body;
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
            amount:
              (3 / 100) * subscription.amount * 100 + subscription.amount * 100,
            currency: "aud",
            interval: subscription.scheduleDuration,
            interval_count: 1,
            product: {
              name: `${subscription.name} - ${customerId} Ramadan 2023`,
            },
          });

          if (subscription.start && subscription.end) {
            let todaysDateTimestamp = Math.floor(Date.now() / 1000);

            if (subscription.time === "ramadan-daily") {
              console.log(subscription);
              const userSubscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [
                  {
                    plan: plan.id,
                  },
                ],
                billing_cycle_anchor: Math.floor(
                  ramadanDailyDate.getTime() / 1000
                ),
                trial_end: Math.floor(ramadanDailyDate.getTime() / 1000),
                cancel_at: Math.floor(endDate.getTime() / 1000),
                metadata: {
                  start_date: ramadanDailyDate,
                  end_date: endDate,
                  paymentMethodRefName: "Stripe",
                  value: 6,
                  fullName: personalDetails.fullName,
                  quickbooksName: subscription.quickbooksClassName,
                  quickbooksId: subscription.quickbooksClassId,
                  campaignName: subscription.name,
                },
              });
              const customer = await stripe.customers.retrieve(customerId);
              subscriptionResult.push(userSubscription);
              const defaultPaymentMethod =
                customer.invoice_settings.default_payment_method;
              try {
                const paymentIntent = await stripe.paymentIntents.create({
                  amount:
                    (subscription.amount + 0.03 * subscription.amount) * 100,
                  currency: "AUD",
                  customer: customerId,
                  payment_method: defaultPaymentMethod,
                  description: `Ramadan 2023 - Order #${orderNumber} - (first charge)`,
                  confirmation_method: "manual",
                  confirm: true,
                  metadata: {
                    start_date: Last10startDate,
                    end_date: endDate,
                    paymentMethodRefName: "Stripe",
                    value: 5,
                    fullName: personalDetails.fullName,
                    quickbooksName: subscription.quickbooksClassName,
                    quickbooksId: subscription.quickbooksClassId,
                    campaignName: subscription.name,
                  },
                });
                paymentIntentResult = paymentIntent;

                paymentIntentResultsArray.push(paymentIntent);
                console.log(paymentIntent);
              } catch (error) {
                console.error("Error creating payment: ", error);
                return { error: error.message };
              }
            } else if (subscription.time === "ramadan-last-10") {
              const userSubscription = await stripe.subscriptions.create({
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
                metadata: {
                  start_date: Last10startDate,
                  end_date: endDate,
                  paymentMethodRefName: "Stripe",
                  value: 5,
                  fullName: personalDetails.fullName,
                  quickbooksName: subscription.quickbooksClassName,
                  quickbooksId: subscription.quickbooksClassId,
                  campaignName: subscription.name,
                },
              });
              const customer = await stripe.customers.retrieve(customerId);
              subscriptionResult.push(userSubscription);
            }
          } else {
            const userSubscription = await stripe.subscriptions.create({
              customer: customerId,
              items: [
                {
                  plan: plan.id,
                },
              ],
              metadata: {
                paymentMethodRefName: "Stripe",
                fullName: personalDetails.fullName,
                quickbooksName: subscription.quickbooksClassName,
                quickbooksId: subscription.quickbooksClassId,
                campaignName: subscription.name,
              },
            });
            const customer = await stripe.customers.retrieve(customerId);
            subscriptionResult.push(userSubscription);
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
      paymentIntentResult = await stripe.paymentIntents.create({
        amount: Math.round(totalWithProcessing * 100),
        currency: "aud",
        customer: customerId,
        payment_method: defaultPaymentMethod,
        confirmation_method: "manual",
        confirm: true,
        description: `Ramadan 2023 - Order #${orderNumber}`,

        metadata: {
          fullName: personalDetails.fullName,
          orderNumber: orderNumber,
        },
      });
      paymentIntentResultsArray.push(paymentIntentResult);
    }

    res.status(200).send({ subscriptionResult, paymentIntentResultsArray });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing payments");
  }
});

app.post("/createCustomer", async (req, res) => {
  console.log(req.body);
  try {
    const customers = await stripe.customers.list({
      email: req.body.email,
    });
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
    res.status(500).json({
      error: "An error occured while creating a customer.",
    });
  }
});

app.post("/createCustomer", async (req, res) => {
  console.log(req.body);
  try {
    const customers = await stripe.customers.list({
      email: req.body.email,
    });
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
    res.status(500).json({
      error: "An error occured while creating a customer.",
    });
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
        description: `Ramadan 2023 - Order #${orderNumber}`,
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
          description: `Ramadan 2023 - Order #${orderNumber} - Subscription`,
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
    res.status(500).json({
      error: "An error occurred while charging the customer.",
    });
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

/* *****************************************************************************
 ********************************************************************************
 ********************************************************************************
 ********************************************************************************
 *********************************FIREBASE/QUICKBOOKS****************************
 ********************************************************************************
 ********************************************************************************
 ********************************************************************************
 ********************************************************************************
 ******************************************************************************** */
let oauth2_token_json = null;
let redirectUri = "";
let oauthClient = null;

app.get("/authUri", async (req, res) => {
  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: "production",
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
      console.log("TOKEN");
      console.log(authResponse.getJson());
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      console.log(oauth2_token_json);

      updateAccessToken(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });
  res.send(oauth2_token_json);
});

app.get("/api", async (req, res) => {
  console.log("Fetching");
  const token = JSON.parse(oauth2_token_json);
  let data = await getTokenFromFirebase();
  console.log(JSON.stringify(data));
});

const updateAccessToken = (body) => {
  console.log(body);

  const quickbooksRef = db.collection("quickbooks");
  const accessTokenRef = quickbooksRef.doc("access_token");
  let newBody = JSON.parse(body);
  console.log(newBody.token_type);
  accessTokenRef
    .set({
      // Add the properties you want to update here
      access_token: newBody.access_token,
      token_type: newBody.token_type,
      refresh_token: newBody.refresh_token,
      x_refresh_token_expires_in: newBody.x_refresh_token_expires_in,
      expires_in: newBody.expires_in,
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};

const getTokenFromFirebase = () => {
  const quickbooksRef = db.collection("quickbooks");
  const accessTokenRef = quickbooksRef.doc("access_token");
  let tokenFromFb;
  accessTokenRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        tokenFromFb = doc.data();
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  return tokenFromFb;
};

app.get("/retreiveAccessToken", async (req, res) => {
  const quickbooksRef = db.collection("quickbooks");
  const accessTokenRef = quickbooksRef.doc("access_token");
  accessTokenRef
    .set({
      // Add your object properties here
      expires_in: 3600,
      access_token: "your_access_token_value_here",
      refresh_token: "your_refresh_token_value_here",
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
});

app.get("/updateAccessToken", async (req, res) => {
  await getTokenFromFirebase();
});

app.post("/getCustomersQuickbooks", async (req, res) => {
  // GET TOKEN FROM FIREBASE

  const token = JSON.parse(oauth2_token_json);
  // Set up the QuickBooks API endpoint
  const endpoint =
    "https://quickbooks.api.intuit.com/v3/company/403496926/query";
  console.log(req.body);
  const nameArray = req.body.personalDetails.fullName.split(" ");
  const firstName = nameArray[0]; // "Aniss"
  const lastName = nameArray[1]; // "Abbou"
  const query = `SELECT * FROM Customer WHERE DisplayName = '${req.body.personalDetails.fullName}'`;
  let customerId;

  if (token !== null) {
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
            // const customerData = {
            //   GivenName: firstName,
            //   FamilyName: lastName,
            //   PrimaryEmailAddr: {
            //     Address: req.body.personalDetails.email,
            //   },
            //   DisplayName: req.body.personalDetails.fullName,
            //   BillAddr: {
            //     Line1: req.body.billingDetails.streetAddress,
            //     City: req.body.billingDetails.city,
            //     PostalCode: req.body.billingDetails.zip,
            //   },
            //   Job: false,
            //   SalesTermRef: {
            //     value: "3",
            //   },
            //   CurrencyRef: {
            //     value: "AUD",
            //   },
            // };
            const customerData = {
              FullyQualifiedName: req.body.personalDetails.fullName,
              PrimaryEmailAddr: {
                Address: req.body.personalDetails.email,
              },
              DisplayName: req.body.personalDetails.fullName,

              BillAddr: {
                City: req.body.billingDetails.city,
                PostalCode: req.body.billingDetails.zip,
                Line1: req.body.billingDetails.streetAddress,
                Country: req.body.billingDetails.country,
              },
              CurrencyRef: {
                value: "AUD",
              },
            };
            const createCustomerResponse = await axios.post(
              "https://quickbooks.api.intuit.com/v3/company/403496926/customer?minorversion=65",
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
          let totalAmount = 0;
          let salesReceiptLines = [];
          for (let i = 0; i < req.body.cartItems.length; i++) {
            const processingFee = 0.03 * req.body.cartItems[i].amount;
            const salesReceiptLine = {
              Description: `Donation ${req.body.cartItems[i].name}`,
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: {
                TaxCodeRef: {
                  value: "6",
                },
                Qty: 1,
                UnitPrice: req.body.cartItems[i].amount,
                ItemRef: {
                  name: "42020 FG - Tax Ded Donations (NP)",
                  value: "9",
                },
                ClassRef: {
                  name: req.body.cartItems[i].quickbooksClassName,
                  value: req.body.cartItems[i].quickbooksClassId,
                },
              },
              LineNum: i + 1,
              Amount: req.body.cartItems[i].amount,
              Id: `${i + 1}`,
            };
            salesReceiptLines.push(salesReceiptLine);
            totalAmount += req.body.cartItems[i].amount;
            console.log(totalAmount);
          }
          if (req.body.oneTimeDonation > 0) {
            console.log("ONE TIME DONATION FOUND");
            const salesReceiptLine = {
              Description: `Donation One Time`,
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: {
                TaxCodeRef: {
                  value: "6",
                },
                Qty: 1,
                UnitPrice: 10,
                ItemRef: {
                  name: "42020 FG - Tax Ded Donations (NP)",
                  value: "9",
                },
                ClassRef: {
                  name: "AIFIL:General (i.e Used for Merchant Fee Donations)",
                  value: "3700000000001013281",
                },
              },
              LineNum: salesReceiptLines.length + 1,
              Amount: 10,
              Id: `${salesReceiptLines.length + 1}`,
            };
            salesReceiptLines.push(salesReceiptLine);
            totalAmount += 10;
          }
          const processingFeeLine = {
            Description: `Merchant Fees`,
            DetailType: "SalesItemLineDetail",
            SalesItemLineDetail: {
              TaxCodeRef: {
                value: "6",
              },
              Qty: 1,
              UnitPrice: 0.03 * totalAmount,
              ItemRef: {
                name: "42020 FG - Tax Ded Donations (NP)",
                value: "9",
              },
              ClassRef: {
                name: "AIFIL:General (i.e Used for Merchant Fee Donations)",
                value: "3700000000001013281",
              },
            },
            LineNum: salesReceiptLines.length + 1,
            Amount: (3 / 100) * totalAmount,
            Id: `${salesReceiptLines.length + 1}`,
          };
          salesReceiptLines.push(processingFeeLine);
          console.log(salesReceiptLines);
          console.log(totalAmount + 0.03 * totalAmount);
          const salesReceipt = {
            Line: salesReceiptLines,
            CustomerRef: {
              value: customerId,
            },
            PaymentRefNum: req.body.orderNumber,

            PaymentMethodRef: {
              name: req.body.paymentMethod,
              value: req.body.paymentId,
            },
            BillEmail: {
              Address: req.body.personalDetails.email,
            },
            TotalAmt: totalAmount,
          };
          const createSalesReceiptResponse = await axios.post(
            "https://quickbooks.api.intuit.com/v3/company/403496926/salesreceipt?minorversion=65",
            salesReceipt,
            { headers }
          );
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
      //   "https://sandbox-quickbooks.api.intuit.com/v3/company/403496926/query?query=SELECT * FROM Customer",
      //   { headers }
      // );
      // res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error occurred while calling API");
    }
  } else {
    console.log("TOKEN IS NULL - STORE SALES ITEMS IN FIREBASE TO SYNC");
    // console.log(req.body);
    // const receiptsRef = db.collection("receipts");
    // const newDocumentRef = receiptsRef.doc(req.body.orderNumber);
    // newDocumentRef
    //   .set({
    //     // Add your object properties here
    //     orderNumber: req.body.orderNumber,
    //     oneTimeDonation: req.body.oneTimeDonation,
    //     personalDetails: req.body.personalDetails,
    //     billingDetails: req.body.billingDetails,
    //     userEmail: req.body.personalDetails.email,
    //     paymentId: req.body.paymentId,
    //     paymentMethod: req.body.paymentMethod,
    //     cartItems: req.body.cartItems,
    //   })
    //   .then(() => {
    //     console.log("Document successfully written!");
    //     res.send("Document written to firebase.");
    //   })
    //   .catch((error) => {
    //     console.error("Error writing document: ", error);
    //   });
  }
  // res.send("Adding sales receipts...");
});

app.post("/syncReceipts", async (req, res) => {
  const addSalesReceipts = async (saleItem) => {
    console.log(saleItem);
    const token = JSON.parse(oauth2_token_json);
    // Set up the QuickBooks API endpoint
    const endpoint =
      "https://quickbooks.api.intuit.com/v3/company/403496926/query";
    const nameArray = saleItem.personalDetails.fullName.split(" ");
    const firstName = nameArray[0]; // "Aniss"
    const lastName = nameArray[1]; // "Abbou"
    const query = `SELECT * FROM Customer WHERE DisplayName = '${saleItem.personalDetails.fullName}'`;
    let customerId;

    let success = false;

    try {
      const headers = {
        Authorization: `Bearer ${token.access_token}`,
        Accept: "application/json",
      };
      await axios
        .get(endpoint, { params: { query }, headers })
        .then(async (response) => {
          const customer = response.data.QueryResponse.Customer;
          if (customer) {
            console.log("customer found.");
            customerId = customer[0].Id;
            console.log(customerId);
          } else {
            console.log("Customer not found, creating customer.");
            const customerData = {
              FullyQualifiedName: saleItem.personalDetails.fullName,
              PrimaryEmailAddr: {
                Address: saleItem.personalDetails.email,
              },
              DisplayName: saleItem.personalDetails.fullName,

              BillAddr: {
                City: saleItem.billingDetails.city,
                PostalCode: saleItem.billingDetails.zip,
                Line1: saleItem.billingDetails.streetAddress,
                Country: saleItem.billingDetails.country,
              },
              CurrencyRef: {
                value: "AUD",
              },
            };
            // const customerData = {
            //   GivenName: firstName,
            //   FamilyName: lastName,
            //   PrimaryEmailAddr: {
            //     Address: saleItem.personalDetails.email,
            //   },
            //   DisplayName: saleItem.personalDetails.fullName,
            //   BillAddr: {
            //     Line1: saleItem.billingDetails.streetAddress,
            //     City: saleItem.billingDetails.city,
            //     PostalCode: saleItem.billingDetails.zip,
            //   },
            //   Job: false,
            //   SalesTermRef: {
            //     value: "3",
            //   },
            //   CurrencyRef: {
            //     value: "AUD",
            //   },
            // };
            const createCustomerResponse = await axios.post(
              "https://quickbooks.api.intuit.com/v3/company/403496926/customer?minorversion=65",
              customerData,
              { headers }
            );
            console.log(
              "New customer created:",
              createCustomerResponse.data.Customer
            );
            customerId = createCustomerResponse.data.Customer.Id;
            console.log(customerId);
          }
          let totalAmount = 0;
          let salesReceiptLines = [];
          for (let i = 0; i < saleItem.cartItems.length; i++) {
            const processingFee = 0.03 * saleItem.cartItems[i].amount;
            const salesReceiptLine = {
              Description: `Donation ${saleItem.cartItems[i].name}`,
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: {
                TaxCodeRef: {
                  value: "6",
                },
                Qty: 1,
                UnitPrice: saleItem.cartItems[i].amount,
                ItemRef: {
                  name: "42020 FG - Tax Ded Donations (NP)",
                  value: "26",
                },
                ClassRef: {
                  name: saleItem.cartItems[i].quickbooksClassName,
                  value: saleItem.cartItems[i].quickbooksClassId,
                },
              },
              LineNum: i + 1,
              Amount: saleItem.cartItems[i].amount,
              Id: `${i + 1}`,
            };
            salesReceiptLines.push(salesReceiptLine);
            totalAmount += saleItem.cartItems[i].amount;
            console.log(totalAmount);
          }
          if (saleItem.oneTimeDonation > 0) {
            console.log("ONE TIME DONATION FOUND");
            const salesReceiptLine = {
              Description: `Donation One Time`,
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: {
                TaxCodeRef: {
                  value: "6",
                },
                Qty: 1,
                UnitPrice: 10,
                ItemRef: {
                  name: "42020 FG - Tax Ded Donations (NP)",
                  value: "26",
                },
                ClassRef: {
                  name: "General",
                  value: 5100000000000049941,
                },
              },
              LineNum: salesReceiptLines.length + 1,
              Amount: 10,
              Id: `${salesReceiptLines.length + 1}`,
            };
            salesReceiptLines.push(salesReceiptLine);
            totalAmount += 10;
          }
          const processingFeeLine = {
            Description: `Merchant Fees`,
            DetailType: "SalesItemLineDetail",
            SalesItemLineDetail: {
              TaxCodeRef: {
                value: "6",
              },
              Qty: 1,
              UnitPrice: 0.03 * totalAmount,
              ItemRef: {
                name: "42020 FG - Tax Ded Donations (NP)",
                value: "26",
              },
              ClassRef: {
                name: "General",
                value: 5100000000000049941,
              },
            },
            LineNum: salesReceiptLines.length + 1,
            Amount: (3 / 100) * totalAmount,
            Id: `${salesReceiptLines.length + 1}`,
          };
          salesReceiptLines.push(processingFeeLine);
          console.log(salesReceiptLines);
          console.log(totalAmount + 0.03 * totalAmount);

          const salesReceipt = {
            Line: salesReceiptLines,
            CustomerRef: {
              value: customerId,
            },
            PaymentRefNum: saleItem.orderNumber,

            PaymentMethodRef: {
              name: saleItem.paymentMethod,
              value: saleItem.paymentId,
            },
            BillEmail: {
              Address: saleItem.personalDetails.email,
            },
            TotalAmt: totalAmount,
          };
          const createSalesReceiptResponse = await axios.post(
            "https://quickbooks.api.intuit.com/v3/company/403496926/salesreceipt?minorversion=65",
            salesReceipt,
            { headers }
          );
          success = true;
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
          success = false;
        });
      // Make an API call using the OAuth2 token
      // const response = await axios.get(
      //   "https://sandbox-quickbooks.api.intuit.com/v3/company/403496926/query?query=SELECT * FROM Customer",
      //   { headers }
      // );
      // res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error occurred while calling API");
    }
    return success;
  };

  console.log("Syncing receipts...");
  const receiptsRef = db.collection("receipts");
  receiptsRef.get().then((querySnapshot) => {
    querySnapshot.forEach(async (saleItem) => {
      console.log(saleItem.data());

      const result = await addSalesReceipts(saleItem.data());
      console.log(result);
      if (result) {
        const docRef = db.collection("receipts").doc(saleItem.id);

        await docRef
          .delete()
          .then(() => {
            console.log("Document deleted.");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
  res.send("Syncing to quickbooks...");
});

setInterval(() => {
  console.log("CHECKING");
  const token = JSON.parse(oauth2_token_json);
  const endpoint =
    "https://quickbooks.api.intuit.com/v3/company/403496926/query";
  const query = "SELECT * FROM Class";

  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: "production",
    redirectUri: "http://localhost:3002/callback",
  });
  try {
    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    };
    axios
      .get(endpoint, { params: { query }, headers })
      .then(async (response) => {})
      .catch((error) => {
        console.log(error);
      });

    // Make an API call using the OAuth2 token
    // const response = await axios.get(
    //   "https://sandbox-quickbooks.api.intuit.com/v3/company/403496926/query?query=SELECT * FROM Customer",
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
      .catch(function (e) {});
  }
}, 10000);
app.listen(process.env.PORT || 3002, () => {
  console.log("Example app is listening on port 3002");
});
