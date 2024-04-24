// const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.processPayment = catchAsyncErrors(async (req, res, next) => {
//   const myPayment = await stripe.paymentIntents.create({
//     amount: req.body.amount,
//     currency: "inr",
//     metadata: {
//       company: "Ecommerce",
//     },
//     description: 'Payment for products', // Add a description for the payment
//   });

//   res
//     .status(200)
//     .json({ success: true, client_secret: myPayment.client_secret });
// });

// exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
//   res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
// });


const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // Check if the currency is INR
  if (req.body.currency !== "inr") {
    // Check if the shipping/billing address is outside India
    if (req.body.shippingAddress.country === "India") {
      return res.status(400).json({
        success: false,
        message: "NON-INR TRANSACTIONS IN INDIA SHOULD HAVE SHIPPING/BILLING ADDRESS OUTSIDE INDIA",
      });
    }
  }

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: req.body.currency,
    metadata: {
      company: "Ecommerce",
    },
    description: req.body.description,
  });

  res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
