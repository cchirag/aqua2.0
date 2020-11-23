const functions = require('firebase-functions');
const stripe = require("stripe")("sk_test_51H6jpPI6dlHBa6hZxklGxkA5xSzuaZnBZA6v1aJZc2dog1uElfLMKlX4m29YbWd6r0otmDfS81Yd9OBY9EZPQ1v4005MZ3Kyx7")

exports.completePaymentWithStripe = functions.https.onRequest(
    (request, response) => {
        stripe.charges
            .create({
                amount: request.body.amount,
                currency: request.body.currency,
                source: 'tok_visa',
                description: 'Payment towards Aqua',
                shipping: {
                    name: request.body.name,
                    address: {
                        line1: 'Canary Place',
                        postal_code: '931217',
                        city: 'Macon',
                        state: 'Georgia',
                        country: 'US',
                    },
                },

            })
            // eslint-disable-next-line promise/always-return
            .then((charge) => {
                response.send(charge);
                console.log("Hello")
                console.log(charge)
            })
            .catch((err) => {
                console.log(err);
            });
    },
);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
