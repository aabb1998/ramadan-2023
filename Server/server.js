const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const handlebars = require("handlebars");
const paypal = require("@paypal/checkout-server-sdk");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cors());

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET_ID;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

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

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
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

app.listen(3002, () => console.log("Example app is listening on port 3002"));
