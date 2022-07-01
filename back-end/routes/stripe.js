const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/payment", (req, res) => {
stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    },
    (error, response) => {
    if (error) {
        res.status(500).json(error);
    } else {
        res.status(200).json({msg: "Order payed with success..", response});
    }}
)});

module.exports = router;