const stripe = require('stripe')('YOUR_SECRET_KEY');

// Define an array of objects, where each object contains the plan information for a subscription or the amount information for a one-time payment
const items = [
  {
    customerId: 'CUSTOMER_ID_1',
    planName: 'Plan 1',
    planAmount: 1000,
    planInterval: 'month',
    trialPeriodDays: 30,
    billingCycleAnchor: 1647312000, // Unix timestamp representing March 14, 2022
    createPlan: true,
    createSubscription: true,
  },
  {
    customerId: 'CUSTOMER_ID_2',
    planName: 'Plan 2',
    planAmount: 2000,
    planInterval: 'month',
    trialPeriodDays: 0,
    billingCycleAnchor: 1644600000, // Unix timestamp representing February 12, 2022
    createPlan: true,
    createSubscription: true,
  },
  {
    customerId: 'CUSTOMER_ID_1',
    amount: 5000,
    description: 'One-time payment for subscription upgrade',
    chargeCustomer: true,
  },
  {
    customerId: 'CUSTOMER_ID_2',
    amount: 10000,
    description: 'One-time payment for additional service',
    chargeCustomer: false,
  },
  // Add as many subscription and one-time payment objects as you need
];

// Separate the subscription objects and the one-time payment objects into separate arrays
const subscriptions = items.filter(item => item.createSubscription);
const oneTimePayments = items.filter(item => !item.createSubscription);

// Calculate the total amount to charge the customer for all one-time payments that require a charge
const totalOneTimePaymentAmount = oneTimePayments
  .filter(payment => payment.chargeCustomer)
  .reduce((total, payment) => total + payment.amount, 0);

// Use Promise.all to create all plans in parallel
Promise.all(subscriptions.filter(subscription => subscription.createPlan).map(subscription => {
  if (subscription.createSubscription) {
    const trialEnd = Math.floor(Date.now() / 1000) + (subscription.trialPeriodDays * 86400);
    const billingCycleAnchor = subscription.billingCycleAnchor;
    return stripe.plans.create({
      amount: subscription.planAmount,
      currency: 'usd',
      interval: subscription.planInterval,
      trial_period_days: subscription.trialPeriodDays,
      product: {
        name: subscription.planName,
      },
      billing_scheme: 'per_unit',
      usage_type: 'licensed',
      metadata: {
        customerId: subscription.customerId,
        trialEnd,
        billingCycleAnchor,
      },
    });
  }
}))
.then(plans => {
  // Use the returned plan IDs to create subscriptions for each customer
  Promise.all(subscriptions.map(subscription => {
    if (subscription.createSubscription) {
      const { customerId, planName, planAmount, planInterval, trialPeriodDays } = subscription;
      const trialEnd = Math.floor(Date.now() / 1000) + (trialPeriodDays * 86400);
      const billingCycleAnchor = subscription.billingCycleAnchor;
      const planId = plans.find(plan => plan.product.name === planName).id;
      return stripe.subscriptions.create({
        customer: customerId,
        items: [{
          plan: planId,
        }],
        billing_cycle_anchor: billingCycleAnchor,
        trial_end: trialEnd,
        metadata: {
          planName: planName,
          planAmount: planAmount,
          planInterval: planInterval,
          trialPeriodDays: trialPeriodDays,
          oneTimePayment: false,


        }
      )}

// Use Promise.all to create all plans in parallel
Promise.all(subscriptions.filter(subscription => subscription.createPlan).map(subscription => {
// check if there's a custom date for this subscription, otherwise use the default date
const billingCycleAnchor = subscription.billingCycleAnchor || Math.floor(Date.now() / 1000);

// create the plan with the custom date
return stripe.plans.create({
amount: subscription.planAmount,
currency: 'usd',
interval: subscription.planInterval,
trial_period_days: subscription.trialPeriodDays,
product: {
name: subscription.planName,
},
billing_cycle_anchor: billingCycleAnchor,
});
}))
.then(plans => {
// Use the returned plan IDs to create subscriptions for each customer
Promise.all(subscriptions.map(subscription => {
if (subscription.createSubscription) {
// check if there's a custom date for this subscription, otherwise use the default date
const billingCycleAnchor = subscription.billingCycleAnchor || Math.floor(Date.now() / 1000);


  // create the subscription with the custom date
  return stripe.subscriptions.create({
    customer: subscription.customerId,
    items: [{
      plan: plans.find(plan => plan.product.name === subscription.planName).id,
    }],
    billing_cycle_anchor: billingCycleAnchor,
  });
} else {
  return Promise.resolve();
}
}));
})
.then(subscriptions => {
// Handle the successful creation of subscriptions

// Charge the customer for all one-time payments that require a charge
if (totalOneTimePaymentAmount > 0) {
stripe.charges.create({
amount: totalOneTimePaymentAmount,
currency: 'usd',
customer: oneTimePayments[0].customerId, // You can choose any customer ID, as long as they have a valid payment method on file
description: 'One-time payment for subscription upgrade',
});
}
})
.then(charge => {
// Handle the successful charge of the customer

// Handle any errors that occurred during the creation of plans, subscriptions, or charges
})
.catch(error => {
// Handle any errors that occurred during the execution of the code
});